# Q601 Game Project — Developer Notes

## Project Structure

```
Q601/
├── MYH5/my_web/myh5_cilent/v1.1.9.1/   # Game client
│   ├── js/default.thm_11d2a764.js        # Compiled UI bundle — THE source of truth at runtime
│   └── resource/skins/**/*.exml          # Source EXML skins — NOT read at runtime
├── MYH5/my_s1/server.jar                 # Game server (same binary in my_s2, my_s3)
└── tools/translation_editor.py           # Translation + Sprite Editor GUI tool
```

## Key Rules

### 1. UI changes → TWO separate systems (read carefully)

**Skin layout** (label positions, sizes, wordWrap, colors in skin definitions):
→ Edit `js/default.thm_11d2a764.js` (compiled skin JS)
This file contains `generateEUI.paths` which pre-registers compiled skin classes. The EUI theme loads skins from this JS, NOT from raw EXML files. EXML files in `resource/skins/` are source files but are NOT read at runtime.

**Game logic text** (what text is assigned to labels, JS behavior):
→ Edit `js/main.min_39fbca0f.js`
This IS loaded and used at runtime.

Safe patterns to translate/edit:
```
t.text="..."   t.label="..."   t.x=NNN   t.left=NNN   t.horizontalCenter=NNN
```

Verify JS syntax after edits:
```bash
node --check js/default.thm_11d2a764.js
```

### 2. Fixing label/count overlap
When a long label text overlaps the count number next to it:
1. Find the label's `t.x` in the JS; estimate text width = `char_count × ~11px`
2. Find the count label — uses `t.x=NNN` or `t.horizontalCenter=NNN`
3. Set count: `t.x = label_x + estimated_text_width + 5`

| Skin | Old count x | New count x |
|------|-------------|-------------|
| PetJinHuaSkin | t.x=156 | t.x=300 |
| RoleOrangeDialogSkin | t.x=122 | t.x=230 |
| RoleDeityEquipUpAlertSkin | t.x=144 | t.x=230 |
| RoleImprintDialogSkin | t.x=116 | t.x=175 |
| RoleShenhunSkin | t.x=111 | t.x=215 |
| ForgingMainSkin | t.x=136 | t.x=270 |
| RoleXiushenSkin | t.left=110 | t.left=165 |
| RolePhantomSkin | horizontalCenter=37.5 | t.x=455 |

### 3. Server popup messages
Server strings live in Java `.class` files inside `server.jar`.
Patch strategy: in-place byte replacement in CONSTANT_Utf8 pool (must keep same byte length; Chinese chars = 3 UTF-8 bytes each).

```bash
mkdir /tmp/jar_extract && cd /tmp/jar_extract
jar xf /path/to/server.jar
# patch class files with Python
jar cfm /tmp/server_patched.jar META-INF/MANIFEST.MF .   # MUST pass MANIFEST.MF
```

Main-Class: `newbee.morningGlory.GameApp`

### 4. Sprite Editor (`tools/translation_editor.py`)
GUI tool with multiple tabs:
- **Config (config.nncc)** — load/search/edit client-side game data (JSON array format). "Find in all sections" panel searches across every section; click result to navigate.
- **Equipment Items** — load `my_s1/conf/item/equipItem.json`; save mirrors to my_s2/my_s3.
- **Prop Items** — load `my_s1/conf/item/propsItem.json`; save mirrors to my_s2/my_s3.
- **Sprites** — replace sprites in atlas PNG files. Click on atlas thumbnail to auto-select sprite.
- **Layout Editor** — edit text/position properties in `default.thm_11d2a764.js` by skin name.

Sprite import logic when source image ≠ slot size:
- If alpha bbox < 80% of source → crop to visible object, then resize to slot
- Else (solid/near-solid background from ChatGPT) → center cover-crop to slot aspect ratio

Tip: ask ChatGPT to generate with **transparent background** for best results.

### 5. Translation
All Chinese UI text in `default.thm_11d2a764.js` has been translated to English.
Only safe display-text patterns were targeted; protocol identifiers and config keys were not touched.

### 6. config.nncc
Client-side compiled JSON data file at `my_web/myh5_cilent/v1.1.9.1/resource/data/config.nncc`.
Contains all game config in named sections; each section is an array of arrays.
**NOT the same as server-side `conf/*.json`** — values (e.g. rewards) can differ.

All sections translated (global pass fixing concatenated English words, number formatting, rank patterns).  
`robotName` section intentionally left — those are NPC player-style names in Chinese/mixed.

Array field indices for `taskNewbie`:
`[id, name, type, isAutoGuide, des, needTimes, tittle, target, functionId, nextId, map, rewards, unfinished, finished, clickSound, functionParams]`

Array field indices for `activityBuy`:
`[id, activityId, type, name, ?, param1, ?, ?, ?, sortOrder, condition, bonus, reward]`

**Common fix patterns applied:**
- `NMagic Stones` → `N,NNN Magic Stones` (thousands separator + space)
- `NLv.` → `Lv.N` (reorder) + space after number
- `largeGift Pack` → `Grand Pack`
- `pcspersonboss` → `Personal Boss`
- `CumulativeLoginNo.NCelestial` → `Login Day N`
- `No.NrankReward` → `Rank N Reward`
- `accumulate minNo.N` → `Rank N`
- `lasts7Celestial` → `Lasts 7 Days`
- camelCase splitter: `([a-z])([A-Z][a-z])` → insert space

**translation_editor.py tool — Config tab:**
- Load config.nncc → Browse → shows sections in left panel
- Click section → items shown in right treeview (index | value | Chinese?)
- "Find in all sections" box at bottom-left: search across all sections, click result to navigate
- Edit value in bottom text box → Apply Change → Save

---

## Bag Item Name Truncation (Grid vs Detail)

### Overview
Item names in the bag grid (`伴包`) are set by `ItemIconRenderer` in `main.min_39fbca0f.js`.
Full item details (name + description) are shown in a tooltip when the item is tapped, via `tips.PropTip` / `tips.EquipTip` / `tips.ShenhunTip` — these read directly from the VO object, NOT from the label.

### Key Files
| File | Purpose |
|---|---|
| `js/default.thm_11d2a764.js` | Compiled skin — defines `ItemIconSkin` with `labName` label |
| `js/main.min_39fbca0f.js` | Game logic — `ItemIconRenderer.updatePropDisplay()` sets `labName.text` |

### ItemIconSkin Layout (default.thm_11d2a764.js)
Cell size: **width=90, height=110**
```
labName_i() → eui.Label, size=16, bold, textColor=0xc6b59e, y=93, horizontalCenter=0
              NOTE: no width / no truncateToFit compiled in (EXML has it but not reflected)
labCount_i() → eui.Label, size=16, bold, textAlign="right", width=61, x=22, y=64.5
```

### updatePropDisplay (main.min_39fbca0f.js, ~offset 70268)
```javascript
A.prototype.updatePropDisplay=function(H,G){
    this._tipEnabled=!1,
    this.labName.parent||this.addChild(this.labName),
    this.labCount.parent||this.addChild(this.labCount),
    this.updateRedVisisble(),
    this.updateIcon(H.icon),
    this.updateQualityDisplay(H.quality),
    this.labName.text=H.name,        // <-- NAME SET HERE (H.name = full item name)
    this.labCount.text=""+G
}
```

### Truncation Strategy
**Safe approach — 2 targeted changes:**

**Change 1** — `default.thm_11d2a764.js` → `labName_i`: add `t.width=90;t.truncateToFit=true;t.size=13;`
- Sets label width to cell width, enables built-in Egret truncation (adds "...")
- Reduce font from 16→13 so ~10-12 chars visible before truncation

**Change 2** — `main.min_39fbca0f.js` → `updatePropDisplay`: change `this.labName.text=H.name` to a short version
- `this.labName.text=H.name.length>14?H.name.substring(0,12)+"..":H.name`
- Grid shows abbreviated name; tooltip (PropTip/EquipTip) still shows `H.name` (full)

**Why tooltip is unaffected:** `showItemTip()` passes `this._itemVO` (the original VO object) to the Tip classes. They read `.name` from the VO, NOT from `labName.text`. So full name always shows in tooltip.

### Exact strings to patch
In `default.thm_11d2a764.js`:
```
OLD: t.size=16;t.text="Orange Gear Fragment";t.textAlign="center";t.textColor=0xc6b59e;t.y=93;return t
NEW: t.size=13;t.text="Orange Gear Fragment";t.textAlign="center";t.textColor=0xc6b59e;t.truncateToFit=true;t.width=90;t.y=93;return t
```

In `main.min_39fbca0f.js`:
```
OLD: this.labName.text=H.name,this.labCount.text=""+G
NEW: this.labName.text=H.name.length>14?H.name.substring(0,12)+"..":H.name,this.labCount.text=""+G
```

### Verification
After patching, run:
```bash
node --check js/default.thm_11d2a764.js
node --check js/main.min_39fbca0f.js
```

---

## Use Item Popup — Single-Line Name Fix (UsePropSkin)

### Problem
Long item names (e.g. "Purple Fragment Treasure Chest") wrapped to 2 lines in the Use Item popup.

### Root Cause
The popup is **`UsePropSkin`** (`dialog.UsePropSkin` in `default.thm_11d2a764.js`), NOT `PropTipSkin`.
`UsePropSkin` is the popup with Min/Max quantity buttons + "Use" button.
Its `labName` had `width=159.5` — too narrow, forcing text to wrap.

**Important:** Tapping a usable bag item opens `UsePropAlert` (extends `ui.UsePropSkin`), NOT `tips.PropTip`.
`PropTipSkin` is the read-only tooltip shown for non-usable items or when long-pressing.

### Tip class routing (for reference)
```
switch(mainType) {
  MATERIAL/DEBRIS/TREASURE/MONEY/ITEM → tips.PropTip (skinName="normal.PropTipSkin")
  EQUIP                               → tips.EquipTip (skinName="normal.EquipTipSkin")
  SHENHUN                             → tips.ShenhunTip (skinName="normal.ShenhunTipSkin")
}
```
But usable items also get `UsePropAlert` (skinName from `ui.UsePropSkin` / `dialog.UsePropSkin`).

### Fix Applied
In `default.thm_11d2a764.js`, UsePropSkin's `labName_i` (~byte offset 582926):
```
OLD: t.size=20;t.text="Meridian Pill";t.textColor=0x7b0ca6;t.width=159.5;t.x=67;t.y=58
NEW: t.size=16;t.text="Meridian Pill";t.textColor=0x7b0ca6;t.wordWrap=false;t.x=67;t.y=58
```
Removed `width=159.5` (was constraining text to 160px), added `wordWrap=false`, reduced font 20→16.

### Egret TextField Wrapping Behavior
In this Egret version, ANY explicit `$textFieldWidth` causes text to wrap — `wordWrap` only controls
word-boundary vs character-boundary splitting. To prevent wrapping entirely, `$textFieldWidth` must be
`NaN` (no explicit `width` on the label). Setting `wordWrap=false` alone is NOT enough if `width` is set.

---

## GM Panel & Payment System

### File Layout

```
MYH5/phpStudy/PHPTutorial/WWW/
├── gm/
│   ├── index.php               # GM panel (auth, dashboard, accounts, gift, payment, notice)
│   ├── includes/
│   │   ├── config.php          # DB creds, server list, API_KEY, PAYMENT_STATE_FILE
│   │   ├── api.php             # Game API helpers (see below)
│   │   └── db.php              # PDO helpers
│   ├── paypal_config.json      # PayPal client_id / secret / mode (sandbox|live)
│   └── payment_state.json      # {"payment_enabled": true/false, "original_packages": [...]}
└── pay/
    ├── go.php                  # Payment trampoline (called from game client)
    ├── index.php               # PayPal payment page
    └── payment_log.txt         # Append-only purchase log
```

### PHP Version Constraint

The server runs **PHP 5.4**. Never use:
- `??` null-coalescing operator → use `isset($x) ? $x : $default`
- Arrow functions `fn() =>` → use `function() use (...) {}`
- `str_contains()` → use `strpos() !== false`
- Short array syntax `[]` is OK (supported since 5.4)

### config.php Constants

| Constant | Value / Notes |
|---|---|
| `DB_HOST` | `127.0.0.1` |
| `DB_PORT` | `3306` |
| `DB_USER` | `root` |
| `DB_PASS` | `123456` |
| `DB_NAME` | `myh5_pl` (platform DB) |
| `API_KEY` | Used for PayPal redirect signatures |
| `SERVERS` | Serialized array; each entry has `api`, `tcat`, `db` keys |
| `PAYMENT_STATE_FILE` | `gm/payment_state.json` |
| `PAYPAL_CONFIG_FILE` | `gm/paypal_config.json` |
| `CONF_DIR` | `D:\MYH5\my_s1\conf` (Windows path to game config) |

Server DB names: `myh5_s1`, `myh5_s2`, `myh5_s3`

### api.php Functions

#### `api_mail_gift_db($roleName, $itemId, $count, $title, $content, $sid)`
Direct DB INSERT into `mail` table. **Use this for all single-item GM gifts.**
- Looks up player UUID by character display name (`player.name`)
- Item format: `itemId_count` (underscore — what `RewardItem.parse()` expects)
- Timestamp: `sprintf('%d000', time())` — avoids 32-bit overflow that caused "1969.12.19" date
- `mailType = 2`, `isRead = 0`

#### `api_mail_gift_db_items($roleName, $itemStr, $title, $content, $sid)`
Same as above but accepts a pre-built multi-item string. **Use this when one mail should contain multiple items.**
- `$itemStr` format: `"itemId_count;itemId_count;..."` (semicolons between items)
- Used by `pay/go.php` so one purchase = one mail

#### `api_mail_gift($roleName, $itemId, $count, $title, $content, $apiBase, $serverId)`
Jetty HTTP API (`/myh5/sendmail`). **Avoid for GM gifts** — requires player online, and `targetId` must be the account login name (`identityName`), not the character name.
- Signature: `MD5_upper(type + title + content + itemStr + time + GM_KEY)`
- `GM_KEY = "ddgg5bjjflasd12345531"` (hardcoded in `HttpSendMail.class`)
- Java's `getDecodeString()` converts "+" → space before the MD5; PHP mirrors this with `str_replace('+', ' ', ...)`

#### `api_broadcast_mail($itemId, $count, $title, $content, $apiBase)`
Jetty type=1 sendmail — broadcasts to all currently **online** players.
Used by GM panel "Broadcast Gift". Does NOT work for offline players.

#### `api_call($action, $params, $apiBase)`
Calls Tomcat `/game/services` (requires `server_patched.jar` on port `tcatPort`, e.g. 8090+).
Used for Component Switches. Original `server.jar` runs Jetty which wins the port race and blocks Tomcat.

### Payment Flow

#### Free Mode (`payment_enabled: false`)
```
Game client → /pay/go.php?pkg=PKG_ID&player=CHAR_NAME&sid=SERVER_ID
  → reads payment_state.json
  → parses pkg.oneRewards ("itemId_count;itemId_count;...")
  → calls api_mail_gift_db_items() — one mail with all items
  → shows "Purchase Complete" page
```

#### Paid Mode (`payment_enabled: true`)
```
Game client → /pay/go.php
  → redirects to /pay/?pkg=...&player=...&sid=...&s=MD5(pkg+player+API_KEY)
  → PayPal SDK creates order
  → onApprove POSTs to /pay/ with ajax=capture
  → PHP captures PayPal order, then calls api_mail_gift()
  → Returns JSON {ok: true/false}
```

Toggle payment mode from GM panel → Payment tab → ON/OFF toggle.  
State stored in `gm/payment_state.json` with key `payment_enabled`.

### Game Client → Payment Integration

In `MYH5/my_web/myh5_cilent/v1.1.9.1/js/main.min_39fbca0f.js`, the `A.prototype.buy` function was patched to call `/pay/go.php` with `pkg`, `player`, and `sid` parameters:

```javascript
prototype.buy = function(J,K,M,L,N) {
    var _pkg    = String(M);
    var _player = String(GameModels.user.player.name);
    var _sid    = GameModels.login && GameModels.login.serverList &&
                  GameModels.login.serverList.selected
                  ? String(GameModels.login.serverList.selected.sid) : '1';
    var _url = '/pay/go.php?pkg=' + encodeURIComponent(_pkg)
             + '&player='        + encodeURIComponent(_player)
             + '&sid='           + encodeURIComponent(_sid);
    window.open(_url, '_paypal', 'width=480,height=700,scrollbars=yes');
}
```

### Game Server HTTP Ports

| Port | Server | Endpoint |
|---|---|---|
| 8081/8082/8083 | Jetty (server.jar) | `/myh5/sendmail`, `/myh5/pay` |
| 8090/8091/8092 | Tomcat (server_patched.jar) | `/game/services` |
| 80 | phpStudy (Apache) | GM panel, pay pages |

`HttpWebUrl` in `gameserver.properties` must point to port **80** (not 81):
```
newbee.morningGlory.http.HttpService.HttpWebUrl = http://127.0.0.1:80/platform/services.php
```

### Mail Table Schema (game DB: myh5_s1/s2/s3)

```sql
INSERT INTO mail (playerId, mailId, title, Content, gold, coin, bindGold,
                  item, isRead, `time`, mailType)
VALUES           (UUID,     UUID,  STR,   STR,      0,    0,    0,
                  'itemId_count;itemId_count', 0, milliseconds, 2)
```

Key columns:
- `item` — reward string `"itemId_count;itemId_count"`. After collection, set to `""` by game engine.
- `time` — milliseconds (BIGINT). Use `sprintf('%d000', time())` in PHP to avoid 32-bit overflow.
- `mailType = 2` — GM mail type; displays correctly in mailbox.
- `playerId` — UUID from `player.id` (look up by `player.name` = character display name).

### gameRecharge.json Package Format

Located at `CONF_DIR/gameRecharge/gameRecharge.json`:

```json
{
  "id": 101,
  "name": "Starter Pack",
  "RMB": 30,
  "oneRewards": "201_1000;101_500",
  "rewards": "201_1000;101_500"
}
```

- `oneRewards` — items for first purchase (used by `go.php`)
- `rewards` — fallback if `oneRewards` absent
- `RMB` — price in yuan; USD = RMB / 6.5
- Item format: `itemId_count` separated by `;`. Group choices with `&` (e.g., `"A_1&B_1"`).

### GM Panel Gift Items

| Action | Backend function |
|---|---|
| Gift to Single Player | `api_mail_gift_db($pid, $itemId, $count, ...)` |
| Broadcast Gift (online) | `api_broadcast_mail($itemId, $count, ...)` |

`$pid` in the "Player ID or Name" field = character display name (matches `player.name` in DB).

### Known Issues / Non-Issues

- **Component Switches 404**: Requires `server_patched.jar`. Original `server.jar` has Jetty blocking Tomcat on the same port. Deploy patched JAR and update `tcatPort` in config to enable.
- **Old "1969.12.19" mails**: From bug where `(int)(microtime(true)*1000)` overflowed 32-bit PHP. Fixed. Old mails are uncollectable; player can delete them.
- **`status:1` from Jetty sendmail**: Usually means wrong player identifier (needs account `identityName`, not character `name`), or signature mismatch. Use `api_mail_gift_db()` to bypass Jetty entirely.

