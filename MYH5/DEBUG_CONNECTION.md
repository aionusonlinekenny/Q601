# Connection Debug Log — PC/iPhone Cannot Connect

## Symptom

Game clients (PC Chrome/Firefox + iPhone) cannot connect to the game server at `134.22.38.31`.

Pattern observed in server logs every attempt:
```
SocketConnectionListener - N opened
MessageDecoderWebSocketImpl - message id 10000 message data ...   ← auth decoded
SocketConnectionListener - N closed                                ← 1ms later
```

Auth is decoded but session closes 1ms later. No GateWay DEBUG logs appear after auth decode.
The game client never receives an auth response, so the login screen never advances.

---

## Root Causes Identified

### RC-1: WebSocket close frame kills session before auth response (PATCHED — may not be deployed)

**What happens:** The browser sends a WebSocket close frame (opcode 8) immediately after (or during) auth.
MINA's `MessageDecoderWebSocketImpl.decodable()` sees opcode=8 → calls `session.close(true)` → session enters CLOSING state → auth response write is silently dropped.

**Patch applied (in-place bytecode edit of server.jar):**
- Class: `sophia/foundation/communication/core/impl/MessageDecoderWebSocketImpl.class`
- In `decodable()`, when opcode == 8: replaced `session.close(true)` with `buf.position(savedPos); return NEED_DATA`
- This keeps the session alive so auth response can be sent

**To verify deployed:** Server log should show GateWay DEBUG output after `message id 10000`. If still absent, patched JAR not running.

### RC-2: AbstractIoSession.write() rejects writes when session is CLOSING (PATCHED — may not be deployed)

**What happens:** Even if auth response is attempted, `AbstractIoSession.write()` checks `isClosing()` and throws/returns early.

**Patch applied (in-place bytecode edit of mina-core-2.0.7.jar inside server.jar):**
- Class: `org/apache/mina/core/session/AbstractIoSession.class`
- At bytecode offset 17379-17381: replaced `9A 00 0A` (ifne → fail) with `57 00 00` (pop; nop; nop)
- This makes write() proceed even when session is closing

**Note:** `SocketConnection.sendMessage()` has its OWN `isConnected()` guard BEFORE calling `session.write()`:
```java
if (!session.isConnected()) {
    // silently discards IOException and returns!
    return;
}
session.write(message);
```
So the AbstractIoSession patch only helps if the session is in CLOSING state (isClosing=true) but still isConnected=true.

### RC-3: Old socket's onclose triggers spurious reconnect that closes new auth socket (PATCHED in socket.min.js — not deployed)

**What happens:** When the game reconnects:
1. `connectGameHandler()` calls `closeConnect()` (closes old socket) then `connect()` (opens new socket)
2. Old socket's `onclose` fires asynchronously
3. `socketCloseHandler` → `reconnect()` → `closeConnect()` → **closes the NEW socket mid-auth**
4. Chrome enters CLOSING state, discards any incoming auth response

**Evidence:** ~35-second delay between session open and auth decode in logs. This delay = Chrome's close handshake timeout waiting for server to echo close frame.

**Patch applied:** `MYH5/my_web/myh5_cilent/v1.1.9.1/js/socket.min_8b4cb752.js`
In `HTML5WebSocket.connect()` and `connectByUrl()`, null out old socket handlers before replacing:
```javascript
if (this.socket) {
    this.socket.onopen = null;
    this.socket.onclose = null;
    this.socket.onerror = null;
    this.socket.onmessage = null;
}
```

**Deploy:** Copy updated `socket.min_8b4cb752.js` to `D:\MYH5\my_web\myh5_cilent\v1.1.9.1\js\`

---

## What Was Tried But Did NOT Fix the Problem

| Attempt | Result |
|---|---|
| Removed `ExecutorFilter` from MINA filter chain | Caused 14-22 second hangs (GateWay.onAuth ran in I/O thread, blocking DB operations). Reverted. |
| AbstractIoSession write() patch alone | Not enough — SocketConnection.sendMessage() has own isConnected() guard before write() |
| NEED_DATA patch for close frame alone | Session still closes 1ms after auth in latest logs — either patch not deployed, or another close path exists |

---

## Current State (as of 2026-06-15)

- **server.jar patches** (RC-1, RC-2): Committed to repo. User must deploy patched JAR to `my_s1/`, `my_s2/`, `my_s3/`.
- **socket.min.js patch** (RC-3): Committed to branch `claude/vigilant-meitner-owf545`. User must copy to `D:\MYH5\my_web\...\js\`.
- **Log still shows:** Session closes 1ms after auth decode. No GateWay logs after auth. Indicates patched server.jar may not be running.

---

## Key Diagnostic Questions

1. **Is the patched server.jar actually running?**
   - After restarting server, do you see GateWay DEBUG logs appearing AFTER `message id 10000`?
   - If NO → patched JAR not deployed or wrong JAR file replaced

2. **What port is my_s2 on?**
   - Log shows `[8082]` which is my_s2. Are all three servers restarted with the patched JAR?

3. **Is there a close frame being sent?**
   - Can you capture a Wireshark/tcpdump trace of a connection attempt?
   - Or check Chrome DevTools → Network → WS → see what frames are exchanged

---

## Filter Chain (MINA)

```
Network → ProtocolCodecFilter (WebSocket decode) → ExecutorFilter (thread pool)
       → SocketConnectionListener → GateWay → AuthComponent
```

Auth flow:
- Client sends C2G_AuthEvent (msgId=10000)
- GateWay.onAuth() → AuthComponent.verify() → if ok: attachSession + sendResposeMessage
- Server sends G2C_AuthEvent (msgId=10001) back
- Client then calls getCharActorList()

---

## Server Ports

| Port | Server |
|---|---|
| 8081 | my_s1 (Jetty) |
| 8082 | my_s2 (Jetty) |
| 8083 | my_s3 (Jetty) |
| 8025/8026/8027 | WebSocket game ports (proxied via Apache /ws/PORT/) |
| 80 | Apache (GM panel, pay, web client) |
