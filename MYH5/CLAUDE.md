# Q601 Game Project — Developer Notes

## Project Structure

```
Q601/
├── MYH5/my_web/myh5_cilent/v1.1.9.1/   # Game client
│   ├── js/default.thm_11d2a764.js        # Compiled UI bundle — THE source of truth at runtime
│   └── resource/skins/**/*.exml          # Source EXML skins — NOT read at runtime
├── MYH5/my_s1/server.jar                 # Game server (same binary in my_s2, my_s3)
├── MYH5/my_kuafu/                        # Dedicated cross-server (kuafu) server
│   ├── server.jar                        # Same binary, kuafu config
│   ├── data/core-foundation.properties   # Port 8028
│   ├── data/gameserver.properties        # serverId=99, httpPort=8084, tcatPort=8093
│   ├── data/morningGlory_data.xml        # DB: myh5_kuafu
│   └── setup_kuafu_db.sql               # Run once to create myh5_kuafu DB
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

**Color code fix (`|C:` tags):**
Broken hex color codes had spaces injected (e.g. `|C:0 xB 6281 A` instead of `|C:0xB6281A`),
causing the text color parser to fail and render text as black (0x000000).
Fix: regex remove all spaces within `|C:0x...` hex values. 1099 codes fixed.

**Space around `|C:` and `|T:` tags:**
Missing spaces before/after color/text tags caused concatenation when rendered.
E.g. `Equipment|C:0xB6281A&T:Radiant` rendered as "EquipmentRadiant",
`at|C:0xEDC839&T:Divine` rendered as "atDivine".
Fix: insert space before `|C:` and around `|T:` when adjacent to letters. ~11,000 fixes.

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

---

## server.jar Chinese String Translation

All Chinese strings in `server.jar` were translated to English using in-place byte patching of CONSTANT_Utf8 entries in Java `.class` files.

- **2041 strings** patched across **359 class files**
- Strategy: Chinese chars = 3 UTF-8 bytes each, English = 1 byte. Translations always fit; remaining bytes padded with spaces (0x20). Length prefix unchanged, no bytecode/offset changes.
- **3 strings intentionally kept Chinese**: regex patterns for Chinese character detection (`^[一-龥]{1}$`), number obfuscation filter, and spam filter — these MUST contain Chinese to function.
- Translation map saved at `/tmp/translation_map.json`
- Patcher script at `/tmp/patch_jar.py`
- Deployed to `my_s1/server.jar`, `my_s2/server.jar`, `my_s3/server.jar`

### Rebuild procedure
```bash
rm -rf /tmp/jar_check && mkdir /tmp/jar_check && cd /tmp/jar_check
jar xf /path/to/original/server.jar
python3 /tmp/patch_jar.py   # applies translation_map.json
jar cfm /tmp/server_translated.jar META-INF/MANIFEST.MF .
cp /tmp/server_translated.jar MYH5/my_s{1,2,3}/server.jar
```

---

## itemWay Source Labels (config.nncc)

The `itemWay` section in `config.nncc` contains 614 item acquisition source descriptions.

**Changes applied:**
- Removed "Source:", "— Source:", "Obtain:" prefixes
- Shortened common words (Equipment→Equip, Personal Boss→PBoss, World Boss→WBoss, etc.)
- Truncated all entries to **9 chars + ".."** when too long
- Examples: `Gold — Source: Personal Boss` → `Gold:PBos..`, `EXPObtain: Field Battle` → `XP:PVP`

Also removed `Src:` prefix from server.jar `MGAlarmHandler.class` (3 strings: `;Src:`, `\nSrc:`, `,Src:`).

---

## Divine Gear Panel — Equipment Name Truncation & Full Name Label

### Problem
Equipment item names (e.g. "Radiant Dragon Holy Barrier Defense") were too long, wrapping to 2 lines on the equipment slot boxes in the Divine Gear (神装降世) panel.

### Skin: DeityEquiptBoxSkin (`default.thm_11d2a764.js`)
`labName_i`: `t.maxLines=1;t.size=18;t.width=130` — single line, original font size.

### JS Truncation (`main.min_39fbca0f.js`)
Three truncation points in `DeityEquiptBox.dataChange()`:
- **Activated items**: `this.labName.text=H.name.length>12?H.name.substring(0,10)+"..":H.name`
- **Non-activated items (textFlow)**: `J.des.length>12?J.des.substring(0,10)+"..":J.des`
- **Info panel**: `Q.name` and `f.name` also truncated same way

### Full Name Label (dynamic)
When clicking an equipment item, a dynamically created `eui.Label` (`this._fullNameLab`) shows the **full untruncated item name** below the combat power (战力) number:
- **Position**: `y=100`, `horizontalCenter=0`, `width=500`
- **Style**: `size=20`, `stroke=1`, color = `TypeQuality.getQualityColor(item.quality)` (matches item rarity color)
- Applied in both `RoleDeityEquipUpAlert` (upgrade panel, uses `f.name`/`f.quality`) and `RoleDeityEquipDialog` (overview panel, uses `Q.name`/`Q.quality`)
- Tooltip/tip classes still read full name from the original VO object, unaffected by truncation.

---

## Tab Button Widening (all skins)

### Problem
After translating Chinese labels to English, tab buttons across the game had text cut off because English labels are longer than Chinese (2-4 chars → 8-18 chars).

### Fix Applied
- **TabButtonDefaultSkin** `labelDisplay`: font size restored to **22** (was accidentally changed to 18)
- **104 ToggleButton instances** across 30+ skins: set explicit `width` and repositioned `x` values
- Width calculated: `~11-13px per char + 24px padding` at font size 22
- Groups exceeding 600px parent width were compressed proportionally
- `CopyFightBossSkin` already had a `Scroller > Group(HorizontalLayout)` — just set widths
- Python script used for bulk changes: finds all `TabButtonDefaultSkin` buttons, groups by parent skin class, calculates widths, generates replacements

### Key Skins Modified
AchievementDialogSkin, BagSkin, CopyFightBossSkin, CopyMaterialSkin, CrossServerSkin, CrossWarKingRankSkin, ForgingMainSkin, MallSceneSkin, PetHatchSkin, PetMainSkin, RoleDeityEquipDialogSkin, RoleGemDialogSkin, RoleMainSkin, TreasureMainSkin, LegionWarRankSkin, KingBattlefieldRankSkin, and others.

### Grouping by Y position
Buttons at different y-values belong to different tab bars. The script sub-groups by y to avoid mixing tab bars within one skin.

---

## Total Price Icon Overlap Fix

### Problem
"Total Price:" label, gem/crystal icon, and price value overlapped in buy popups.

### Fix Applied
Rearranged layout to: **label → value → icon** (icon moved AFTER the number):

| Skin | Label x | Value x | Icon x |
|------|---------|---------|--------|
| PropOfSource | 100 | 245 | 355 |
| MallBuyPopSkin | 135 | 280 | 385 |
| TradingSellBuyTipSkin | 135 | 280 | 385 |
| UplevelBaoJiSkin | 135 | — | 385 |

### Finding the right skin
The "Obtain Materials" popup is `PropOfSource` (NOT `MallBuyPopSkin`). It has a `buyGroup` at y=232 containing the price elements with relative coordinates.

---

## itemWay Descriptions Expanded

### Problem
All 614 itemWay descriptions in `config.nncc` were truncated to 9 chars + ".." (e.g. "XO PBst E.."), making them unreadable in the "Obtain via" list.

### Fix Applied
Restored from git history (`e1c29c7c^`), cleaned up but NOT truncated:
- Removed verbose prefixes: "— Source:", "Obtain:"
- Shortened common words: Personal Boss→PBoss, World Boss→WBoss, Celestial Ladder→Ladder, etc.
- Fixed extra spaces (" : " → ": ")
- Example: "XO PBst E.." → "XO Phantom Beast Egg: Material"

### Cross-Server (KuaFu) System — Complete Implementation

Server.jar originally had NO kuafu code. Full cross-server now implemented via decompile/recompile/inject.

**Dedicated kuafu server (my_kuafu):** Separate server instance on port 8028 with its own DB (myh5_kuafu). Home server syncs player data to kuafu DB before redirecting. Client disconnects, reconnects to kuafu server with `C2G_KuaFuLogin` (10018), kuafu server authenticates + character login in one step.

#### Server-side classes (injected into all 3 server.jar):

| Class | Purpose |
|---|---|
| `sophia.mmorpg.proto.C2G_KuaFu_SyncData` (16304) | Client requests cross-server entry |
| `sophia.mmorpg.proto.G2C_KuaFu_NotifySyncDataDone` (16305) | Server responds with IP/port |
| `sophia.mmorpg.proto.C2G_KuaFuLogin` (10018) | Client login to cross-server (auth+charLogin combined) |
| `newbee.morningGlory.mmorpg.player.kuafu.KuaFuComponent` | Handles 16304, reads kuafu config, responds 16305 |
| `newbee.morningGlory.mmorpg.player.kuafu.CrossCityScene` | Scene type 303, extends MGBattleScene, 4 born positions |
| `newbee.morningGlory.mmorpg.player.scene.SceneType` | Added CrossBoss=301, CrossCity=303, CrossDemon=305; `isCrossServerScene()` method; `isBattleScene()` includes cross-server |
| `newbee.morningGlory.GameData` | Registers C2G_KuaFuLogin (10018) via MessageFactory; creates CrossCityScene(303) in `initScenes()` |
| `newbee.morningGlory.mmorpg.player.MGPlayerProvider` | Creates KuaFuComponent on each player |
| `sophia.game.plugIns.gateWay.GateWay` | Handles 10018: MD5 auth → kick existing → create AuthIdentity → attachSession → `CharacterLogin.characterLogin()` |

#### Cross-server login flow:
1. Client sends `C2G_KuaFu_SyncData` (16304) with GameType
2. Server `KuaFuComponent` reads config, responds with `G2C_KuaFu_NotifySyncDataDone` (16305) → Result=1, ServerIP, WsPort
3. Client disconnects from current server
4. Client connects to kuafu IP:port, sends `C2G_KuaFuLogin` (10018) — same fields as auth+reconnect
5. `GateWay.receivedActionEvent` catches actionId==10018 → `onKuaFuAuth()`
6. `onKuaFuAuth`: validates MD5 (`identityId + timeStamp + HttpCommunicationKey`), kicks any online player, creates AuthIdentity, attaches session, calls `CharacterLogin.characterLogin(identity, charId)`
7. CharacterLogin loads player from DB, enters world, sends `G2C_CharacterLogin` (10008) with full character detail

#### Config (gameserver.properties on s1/s2/s3):
```
newbee.morningGlory.kuafu.serverIP =          # empty = client keeps same IP
newbee.morningGlory.kuafu.wsPort = 8028       # kuafu server port
newbee.morningGlory.kuafu.wssPort = 8028
newbee.morningGlory.kuafu.database = myh5_kuafu
```

#### Server port mapping:
| Server | Game Port | HTTP | Tomcat | DB |
|--------|-----------|------|--------|----|
| s1 | 8025 | 8081 | 8090 | myh5_s1 |
| s2 | 8026 | 8082 | 8091 | myh5_s2 |
| s3 | 8027 | 8083 | 8092 | myh5_s3 |
| kuafu | 8028 | 8084 | 8093 | myh5_kuafu |

#### Setup kuafu DB:
```bash
mysql -u root -p123456 < MYH5/my_kuafu/setup_kuafu_db.sql
```

#### Player data sync:
KuaFuComponent on home server copies player data to kuafu DB before redirecting:
```sql
REPLACE INTO myh5_kuafu.player SELECT * FROM myh5_sX.player WHERE id = ?
REPLACE INTO myh5_kuafu.no_delay_player SELECT * FROM myh5_sX.no_delay_player WHERE id = ?
```
Source DB auto-detected from morningGlory_data.xml JDBC URL.

#### Client changes (main.min JS):
- `requestCrossServer`: handles Result=0 gracefully (shows error tip instead of hanging)
- `requestCrossServer`: if ServerIP is empty, keeps current IP (only changes port) — enables self-connect
- Original server.jar backed up as `server.jar.bak.pre_kuafu`

#### Server architecture (for future reference):
- Messages: `ActionEventBase` subclass with `packBody`/`unpackBody`, registered via `MessageFactory.addMessage(short id, Class)`
- Handlers: `ConcreteComponent<Player>`, override `handleActionEvent()`, register with `addActionEventListener(short id)` in `ready()`
- Auth messages: handled directly by `GateWay` (before player exists) — NOT via ConcreteComponent
- Responses: `MessageFactory.getConcreteMessage(id)` → set fields → `GameRoot.sendMessage(identity, msg)`
- Compile: `javac -source 8 -target 8 -cp server.jar:moyu_lib/mina-core-2.0.7.jar:moyu_lib/log4j-1.2.12.jar:moyu_lib/commons-lang3-3.1.jar:moyu_lib/guava-11.0.2.jar`
- Inject: `cd classes && jar uf server.jar path/to/Class.class`
- Source files: `scratchpad/kuafu_src/` (in session temp dir)

### Cross-Server Boss Info Panel (C2G_KuaFu_GetBossInfo / G2C_KuaFu_GetBossInfo)

The cross-server battlefield panel ("Fetching data..." fix) required changes at THREE levels:

#### 1. Proto message registration (ProtoEventManager bytecode patch)
Messages must be registered in `ProtoEventManager.registerActionEvents()` — this runs during framework init (ContextResolver phase), BEFORE the MINA protocol decoder is created. Registration anywhere else (GameData.initialize(), static blocks) is TOO LATE and causes either:
- `DemuxingProtocolDecoder.doDecode` crash (unregistered message ID)
- `IllegalArgumentException: commandId already mapped` (duplicate registration)

Patched via Python bytecode patcher (`scratchpad/patch_proto_event_mgr.py`):
- Adds 4 constant pool entries (Utf8 + Class for C2G_KuaFu_GetBossInfo and G2C_KuaFu_GetBossInfo)
- Inserts 18 bytes of bytecode (2× sipush + ldc_w + invokestatic) before the `return` instruction
- Updates `code_length` and Code attribute `attr_length`

Registered message IDs:
| ID | Class | Direction |
|----|-------|-----------|
| 16306 | `C2G_KuaFu_GetBossInfo` | Client → Server (empty body) |
| 16308 | `G2C_KuaFu_GetBossInfo` | Server → Client (boss data) |

#### 2. Server-side handler (KuaFuComponent)
`KuaFuComponent` listens for both 16304 (sync) and 16306 (boss info) in `ready()`.
`handleGetBossInfo()` builds response with 10 default bosses:
- 7 cross-server bosses: CopyIds 351001–351007, HP "5000000"
- 3 secret bosses: CopyIds 352001–352003, HP "5000000"
- All bosses: `ownerServerIds=[]`, `reliveTime=0`, `flagServerId=0`

Response protocol (G2C_KuaFu_GetBossInfo):
```
int LeftOwnerCount
int LeftAssistCount
short Bosses.length
for each boss (ProtoKuaFuBoss):
  int CopyId
  short hpBytes.length + byte[] bossHP (UTF-8 string)
  short maxBytes.length + byte[] maxBossHP (UTF-8 string)
  short ownerServerIds.length + int[] ownerServerIds
  int reliveTime
  int flagServerId
```

Source files: `scratchpad/kuafu_boss_src/`

#### 3. Client-side fixes (main.min_39fbca0f.js)

**Fix 1: Missing net.notify** — Client created the request message but never sent it:
```javascript
// BEFORE (broken): var L=n.MessagePool.from(n.C2G_KuaFu_GetBossInfo)}
// AFTER (fixed):   var L=n.MessagePool.from(n.C2G_KuaFu_GetBossInfo);n.net.notify(n.MessageMap.C2G_KUAFU_GETBOSSINFO,L)}
```

**Fix 2: Null check for _mineCrossVO** — When no boss has current server as owner (ownerServerIds empty), `_mineCrossVO` is undefined:
```javascript
// BEFORE: H.isinitialize&&K._mineCrossVO.occupyServerIds.indexOf(H)>=0
// AFTER:  H.isinitialize&&K._mineCrossVO&&K._mineCrossVO.occupyServerIds.indexOf(H)>=0
```

**Fix 3: SwordAddAlert labtips overflow** — Notice text overflowed outside dialog:
```javascript
// Added before textFlow assignment:
this.labtips.width=this.width>0?this.width-40:400,this.labtips.wordWrap=!0,this.labtips.lineSpacing=4
```

#### Server initialization order (critical for message registration):
```
ContextResolver (framework init)
  → ProtoEventManager.registerActionEvents()  ← messages MUST be registered here
  → DemuxingProtocolDecoder created (uses MessageFactory)
DataPlugIn → TaskManagerPlugIn → DataCheck
  → GameData.initialize()  ← TOO LATE for message registration
CommunicationService starts (accepts connections)
```

### Infinite Gauntlet "Get Records" Fix (messageId 17113)

Client sends `C2G_Glove_GetRecordInfo` (17113), server had no handler → disconnect.

**Fix:** Created proto classes + patched ProtoEventManager + added handler in KuaFuComponent:
- `C2G_Glove_GetRecordInfo` (17113) — empty body
- `G2C_Glove_GetRecordInfo` (17114) — responds with `infoCount=0`
- KuaFuComponent listens for 17113, responds with empty record list

Patcher: `scratchpad/patch_glove_proto.py`

### World Boss Provoke Stickers Fix (messageId 15360)

Two issues fixed:

**Issue 1: Server disconnect** — Client sends `C2G_Scene_ShowWords` (15360), server had no handler.
- Created `C2G_Scene_ShowWords` (15360): fields `int showType, int showId, String showContent`
- Created `G2C_Scene_NotifyShowWords` (15361): fields `String objectId, int showType, int showId, String showContent`
- Patched ProtoEventManager to register both
- KuaFuComponent handles 15360: echoes back as 15361 with player's objectId

Patcher: `scratchpad/patch_showwords_proto.py`

**Issue 2: Sticker animation not appearing** — After fixing disconnect, clicking stickers still showed nothing.

Root cause: `sendProvoke()` in BossProvokeRender uses `request()` (request-response pattern) for EveryBoss/CrossBoss scenes. The `request()` callback consumed the G2C_SCENE_NOTIFYSHOWWORDS response before `onRoute` could fire, so `_receiveProvokeHandler` → `provokeInfo.show()` never ran.

**Issue 3: Broadcast to all players** — Server was only echoing the sticker back to the sender. Updated `handleShowWords` to iterate `scene.getPlayers()` and send `G2C_Scene_NotifyShowWords` to every `Player` in the same scene. Other players receive it via `onRoute(G2C_SCENE_NOTIFYSHOWWORDS)` → `_receiveProvokeHandler` → `provokeInfo.show(E)`.

```java
Scene scene = (Scene) player.getCurrentScene();
if (scene != null) {
    List<AIFightPlayer> players = scene.getPlayers();
    for (AIFightPlayer aip : players) {
        if (aip instanceof Player) {
            GameRoot.sendMessage(((Player) aip).getIdentity(), response);
        }
    }
}
```
Note: `Scene.broadcastMsg()` is `protected`, so we iterate manually using public `getPlayers()` + `instanceof Player` check (same pattern used internally by `broadcastMsg`).

Additionally, `show(H, G)` checks `G>0` to call `tweenAnimtion(G)` — if sticker index is 0 (first sticker), `G>0` is false and animation skips.

Fix in `main.min_39fbca0f.js` (`sendProvoke` function):
```javascript
// Added provokeInfo.show({ShowId:J}) in the request callback (EveryBoss/CrossBoss path):
this._battleScene.requestSendProvoke(1,J,"",this,function(){
    ...cooldown timer...,
    copy.CopyMainView.instance.provokeInfo.show({ShowId:J})  // ← ADDED
})

// Also fixed the else branch (other scenes):
// OLD: provokeInfo.show(null,J)  — fails for index 0
// NEW: provokeInfo.show({ShowId:J})  — always works
```

Using `{ShowId:J}` instead of `(null, J)` ensures `show()` takes the `H.ShowId` path (always works) instead of the `G>0` path (fails for index 0).

### Cache Busting
- `version_config: 1.11` (for config.nncc)
- `version_assetscript: 15.08` (for main.min JS)

---

## Phantom Maze City (幻界迷城) Dungeon Panel — UI Fixes

### Overview
Fixed multiple overlapping/positioning issues in the Phantom Maze City floor list panel.

### Key Discovery: Correct Skin Identification
The floor list items are **NOT** `FloorItemSkin` — that skin is for a different dungeon (Animal Pagoda / Lock Demon). The actual skin is:

- **`CopyHuanJieCellSkin`** (`renderer.CopyHuanJieCellSkin`) in `default.thm_11d2a765.js`
- **Component**: `renderer.CopyHuanJieCell` extends `ui.CopyHuanJieCellSkin` in `main.min_39fbca0f.js`

### CopyHuanJieCellSkin Layout (height=170)

| Element | ID | Type | Purpose | Original Position | Fixed Position |
|---|---|---|---|---|---|
| Background | _Image1 | Image | `img_huanJie_listBg_png` | verticalCenter=0 | unchanged |
| Floor text | _Image2 | Image | `explore_json.img_huanJie_ceng` | x=64, y=27 | horizontalCenter=-185, verticalCenter=-20 |
| Floor number | blabCell | BitmapLabel | Font: `huanJie_font_fnt` | x=86, y=29, w=30 | horizontalCenter=-180, verticalCenter=20, w=40 |
| Item 1 | drop0 | RewardItemBox | `components.ItemBoxSkin` (90×110) | x=148, y=33 | scaleX/Y=0.8, x=148, verticalCenter=0 |
| Item 2 | drop1 | RewardItemBox | `components.ItemBoxSkin` (90×110) | x=268, y=33 | scaleX/Y=0.8, x=248, verticalCenter=0 |
| 3-Star Normal | _Image3 | Image | `explore_json.img_huanJie_tg` | x=281, y=42 | scaleX/Y=0.8, x=252, y=40 |
| Star 0/1/2 | star0/1/2 | Image | `explore_json.img_huanJie_star` | x=373/422/467, y=75 | x=380/425/470, y=65 |
| Collected icon | imgLingqu | Image | `rankings_json.img_get` | x=260, y=47 | x=240, verticalCenter=0 |

### Floor Number Text (blabCell)
Set in `dataChanged()` in `main.min_39fbca0f.js`:
```javascript
this.blabCell.text=""+I.step
```

### Ranking Header (CopyMaterialSkin huanJie state)

| Element | Purpose | Original | Fixed |
|---|---|---|---|
| `labLink` (text="Ranking") | "View Rankings" link | x=498, y=230 | x=440, y=240 |
| `cell` in CopyHuanJieRankItemSkin | Floor number in ranking | width=37 | width=80 |

Floor ranking text format changed in `main.min_39fbca0f.js`:
```
OLD: this.cell.text=I+Language.Z_CENG     → "2Floor"
NEW: this.cell.text=Language.Z_CENG+" "+I  → "Floor 2"
```
(`Language.Z_CENG = "Floor"`)

### Important Lessons Learned
1. **`FloorItemSkin` is NOT the Phantom Maze floor skin** — it's for Animal Pagoda / Lock Demon dungeons
2. **`default.thm` compiled JS changes DO work** for `CopyHuanJieCellSkin` (unlike FloorItemSkin which was unresponsive)
3. **`main.min_39fbca0f.js` MUST remain single-line** — literal newlines in the file break game login completely
4. **EXML files are NOT read at runtime** — only the compiled JS in `default.thm_*.js` matters
5. The file was renamed from `default.thm_11d2a764.js` to `default.thm_11d2a765.js` during earlier work; `v1.1.9.1/manifest.json` references the new name

### Files Modified
- `v1.1.9.1/js/default.thm_11d2a765.js` — Skin layout changes
- `v1.1.9.1/js/main.min_39fbca0f.js` — Floor text format change

---

## Cross-Server Boss Battle Fixes

### Overview
Fixed multiple issues with cross-server boss battles (TypeGame.CROSS_BOSS = 301):

### Issue 1: Boss Selection Mismatch (wrong boss spawns)

**Root cause:** `ModelSceneCrossBoss.enterGame(I, J, L, K)` passed copyVO object directly to `GameModels.scene.enterGame(I, J, ...)`. The base `scene.enterGame` does `M.EnterParam = N ? N : ""` — since N is an object, it became `"[object Object]"`. Server `Integer.parseInt("[object Object]")` failed → always spawned default boss (index 0).

**Fix (client JS):** Changed `ModelSceneCrossBoss.enterGame` to convert `J.id.toString()`:
```javascript
// BEFORE: GameModels.scene.enterGame(I, J, this, ...)
// AFTER:  GameModels.scene.enterGame(I, J&&J.id?J.id.toString():"", this, ...)
```

Other scene models (PublicBoss, etc.) already did `J.id.toString()` — this was the only one passing raw object.

### Issue 2: Boss Owner Always "None"

**Root cause:** `CrossCityScene` had NO ownership tracking. `PublicBossScene` delegates to `PublicBoss` class which tracks ownership via `onObjectLockTarget` (boss targets player → player becomes owner) and broadcasts `G2C_Public_Boss_Notify_Boss_Owner` (13508).

**Fix (server CrossCityScene.java):**
- Added `ownerPlayerId`/`ownerPlayerName` fields
- Added `onObjectLockTarget()` override: when boss targets a player, that player becomes owner; broadcasts `G2C_Public_Boss_Notify_Boss_Owner` (13508) to all players
- Added `onPlayerEnter()` override: sends `G2C_Public_Boss_Notify_Copy_Info` (13539) with current boss/owner info
- Owner resets when owner player dies
- `onGameEnd` passes `ownerPlayerId` as EndParam for reward distinction

**Key protocol messages:**
| ID | Class | Purpose |
|---|---|---|
| 13508 | `G2C_Public_Boss_Notify_Boss_Owner` | setCopyId, setOwnerId, setOwnerName |
| 13539 | `G2C_Public_Boss_Notify_Copy_Info` | setBossUniqueId, setBossHP, setBossRefId, setOwnerId, setOwnerName, shield fields |

**Ownership mechanism:** Based on boss **lock target** (same as PublicBoss), NOT damage dealt. When boss switches aggro to a new player → new owner. When owner dies → owner resets to None.

### Issue 3: No Reward Notification on Boss Kill (FIXED)

**Root cause (three bugs):**
1. Client `ModelSceneCrossBoss` had no route for `G2C_SCENE_NOTIFY_GAMEEND` — only listened for `G2C_SCENE_NOTIFY_GAMERESULT`
2. Server `CrossCityScene.onObjectDeath()` passed `null` for Items param in `onGameEnd()`. `MGScene.onGameEnd` skips `setItems()` when null → client receives `H.Items = undefined` → `vo.parseProtoItems(undefined)` crashes → entire GameEnd handler fails silently
3. **Route overwrite race condition:** `ModelSceneCrossBoss.addRoutes()` registers `G2C_SCENE_NOTIFY_GAMEEND` first, but `ModelScene.initialize()` re-registers the same route later → overwrites `_gameRewardHandler` path. GameEnd goes through `ModelScene.gameEndHandler` → `_gameOverHandler` → `GameCrossBoss.endHandler` → `end()` → `_endHandlers`, but `_endHandlers` was never set (code used `onGameReawrd` instead of `onEndOnce`)

**Fix (server CrossCityScene.java):**
- Uses `MGDropLibFacade.dropByCopyBoss(bossRefId)` to generate drop items from config
- Calls `MGDropLibFacade.pickupItems(player, dropItems, 70)` to give items to player
- Converts via `MGDropLibFacade.genProtoDropItems(dropItems)` for GameEnd display
- Passes actual items list (not null) to `onGameEnd()`

**Fix (client JS):**
1. Added `G2C_SCENE_NOTIFY_GAMEEND` route in `ModelSceneCrossBoss.addRoutes()` with null guard `H.Items||[]`
2. Added `O.getGameCrossBoss().onEndOnce()` in `enterCrossEveryOneBoss` — same mechanism as EveryBoss — so rewards show via `_endHandlers` path regardless of which route handler wins

**Boss drop items (configured in `otherMonster.json` FixDrop):**

| Boss (RefID) | Item 1 (Unique) | Item 2 | Item 3 | Item 4 |
|---|---|---|---|---|
| Blazing Queen (3510019) | Lucky Dudu (262501) | Beast Soul Shard (210201) | Starlight Stone (214601) | Phantom Beast Egg (214701) |
| Demon Overlord (3510029) | Lucky Lulu (262502) | Beast Soul Shard | Starlight Stone | Phantom Beast Egg |
| Blazing Knight (3510039) | Taurus Star Yar (262503) | Beast Soul Shard | Starlight Stone | Phantom Beast Egg |
| Flame Demon Overlord (3510049) | Protector Lia (262504) | Beast Soul Shard | Starlight Stone | Phantom Beast Egg |
| Bloodthirst Lord (3510059) | Bestower Aiden (262505) | Beast Soul Shard | Starlight Stone | Phantom Beast Egg |
| Lava Lizard King (3510069) | Phantom Cat Kadath (262506) | Beast Soul Shard | Starlight Stone | Phantom Beast Egg |
| Rage Flame Demon King (3510079) | Starlight Bracelet (221505) | Starlight Necklace (221504) | Beast Soul Shard | Starlight Stone |

**Temporary test change:** Boss HP reduced to 1,000,000 (from 5,000,000,000) in both `otherMonster.json` and `KuaFuComponent.java` `BOSS_MAX_HP`. **Restore after testing.**

### Issue 4: Exit Dungeon Causes Disconnect (FIXED)

**Root cause:** Multiple issues in the exit flow:
1. `closeConnect()` triggered socket close event → `socketCloseHandler` showed "Connection failed" before new connection
2. `C2G_Reconnect` (10010) rejected by main server — player session cleaned up when they left for kuafu
3. Using `connectCrossHandler` (C2G_KuaFuLogin) left CrossServer's socket handlers active instead of Login's

**Fix (client JS):** `exitCrossServer` now:
1. `offSocketAll()` — removes ALL socket handlers (prevents close/error events from firing during disconnect)
2. `close(!0)` — cleanly closes kuafu connection
3. `connectCrossHandler(_curHost)` — connects to main server and sends `C2G_KuaFuLogin` (10018) which works as a fresh login via `GateWay.onKuaFuAuth` on all servers
4. On success callback: `offSocketAll()` again (removes CrossServer handlers) → registers Login's `socketCloseHandler` and `socketErrorHandler` → calls `enterGame` success callback

```javascript
exitCrossServer=function(I,J,K){
  var Q=this, R=GameModels.login._curHost;
  this._isCross=!1;
  this._errorHandler&&(this._errorHandler.recover(),this._errorHandler=null);
  n.net.offSocketAll();
  n.net.close(!0);
  this.connectCrossHandler(R, this, function(){
    n.net.offSocketAll();
    n.net.onSocketClose(GameModels.login, GameModels.login.socketCloseHandler);
    n.net.onSocketError(GameModels.login, GameModels.login.socketErrorHandler);
    J&&J.call(I)
  }, K)
}
```

**Why C2G_KuaFuLogin works but C2G_Reconnect doesn't:**
- `C2G_Reconnect` (10010) → `GateWay.onReconnect()` — needs existing player session; main server already cleaned up when player left
- `C2G_KuaFuLogin` (10018) → `GateWay.onKuaFuAuth()` — creates fresh session (MD5 auth → kick existing → create AuthIdentity → CharacterLogin); works on ALL servers

**Key objects:**
- `GameModels.crossServer` — `ModelCrossServer`, has `_isCross`, `exitCrossServer()`, `connectGame()`, `connectCrossHandler()`
- `GameModels.login` — `ModelLogin`, has `_curHost` (main server), `_gameHost`, `connectGameHandler()`, `closeConnect()`
- `_curHost` is set to `_gameHost` on init and NOT changed by cross-server connect — always points to main server

### Server-side Boss Data (otherMonster.json)

Boss data loaded from `my_kuafu/conf/copy/otherMonster.json` via `MGCopyBossConfigLoader("otherMonster")` → `MGCopyBossDataRef.getRefKey(String.valueOf(refId))` → returns `"{refId}_CopyBossProperty"`.

7 cross-server bosses added:
| copyId | refId | Name | Level | HP | resId |
|--------|-------|------|-------|----|-------|
| 351001 | 3510019 | Cross-server Blazing Queen | 150 | 5B | 3018 |
| 351002 | 3510029 | Cross-server Blazing Knight | 150 | 5B | 3018 |
| 351003 | 3510039 | Cross-server Abyss Lord | 150 | 5B | 3017 |
| 351004 | 3510049 | Cross-server Dark Overlord | 150 | 5B | 3022 |
| 351005 | 3510059 | Cross-server Bloodthirst Lord | 150 | 5B | 3023 |
| 351006 | 3510069 | Cross-server Shadow Monarch | 150 | 5B | 3009 |
| 351007 | 3510079 | Cross-server Rage Flame Demon King | 150 | 5B | 3020 |

**Client model availability:** resId must reference existing sprites in `resource_other/actor/`. Model 3019 has 0 sprites → changed to 3020.

### Files Modified
- `my_kuafu/server.jar` — CrossCityScene.class (Java 8 target)
- `my_kuafu/conf/copy/otherMonster.json` — Boss data entries
- `my_web/myh5_cilent/v1.1.9.1/js/main.min_39fbca0f.js` — All client fixes
- `my_web/myh5_cilent/v1.1.9.1/js/main.min_39fbca0f2.js` — Cache-bust copy
- `my_web/myh5_cilent/v1.1.9.1/js/main.min_39fbca0f3.js` — Cache-bust copy
- `my_web/myh5_cilent/v1.1.9.1/manifest.json` — Updated JS filename

### CrossCityScene.java & KuaFuComponent.java Source
Source at: `scratchpad/kuafu_boss_src/newbee/morningGlory/mmorpg/player/kuafu/`

Compile: `javac -source 1.8 -target 1.8 -cp server.jar -d classes CrossCityScene.java KuaFuComponent.java`
Inject: `jar uf server.jar newbee/morningGlory/mmorpg/player/kuafu/CrossCityScene.class newbee/morningGlory/mmorpg/player/kuafu/KuaFuComponent.class`

---

## Fix 4: Boss 30-Minute Respawn Timer

### Problem
After killing a boss, it respawns immediately when re-entering the scene. All 7 bosses should have independent 30-minute cooldowns after being killed.

### Solution

**Key insight**: Main server (my_s1) and kuafu server (my_kuafu) run in separate JVMs — cannot share static memory. Solution: shared file via `System.getProperty("java.io.tmpdir") + "/cross_boss_kills.properties"` (cross-platform, works on Windows).

**Server-side (CrossCityScene.java)** — runs on kuafu server:
- Static `ConcurrentHashMap<Integer, Long> killTimestamps` + `killPlayerNames` — in-memory cache
- `onObjectDeath()` — records kill timestamp + killer name + calls `saveKillTimestamps()` to write file
- File format: `351001=1719612345678` (timestamp) + `351001.name=Emma` (killer name)
- `spawnBoss()` / `prePlayerEnter()` — check `isBossOnCooldown()` before spawning
- Constant `RESPAWN_TIME_MS = 30 * 60 * 1000L` (30 minutes)

**Server-side (KuaFuComponent.java)** — runs on main server:
- `readKillTimestamps()` + `readKillPlayerNames()` — reads shared file on each `handleGetBossInfo()` call
- If `remainSec > 0`: sends `BossHP="0"`, `ReliveTime=remainSec`, `MaxBossHP="1000000|KillerName"`
- If `remainSec == 0`: sends `BossHP=maxHP`, `ReliveTime=0`, `MaxBossHP="1000000"`
- **IMPORTANT**: Both `my_kuafu/server.jar` AND `my_s1/server.jar` (+ s2, s3) must be updated

**Client-side** (already built-in, no changes needed):
- `CrossServerVO._reliveTime` is set from server's `ReliveTime` field
- `lastTime` getter: `_reliveTime - elapsed_seconds` — counts down automatically
- When `lastTime > 0`: boss dead, shows countdown timer, hides red dot
- When `lastTime <= 0`: boss alive, shows red dot, allows attack

### Note
- Kill timestamps persist via file — survive kuafu server restart but not OS reboot
- Each boss has independent cooldown tracked by copyId
- Both servers (main + kuafu) must have updated server.jar
- File path uses `System.getProperty("java.io.tmpdir")` for Windows compatibility

---

## Fix 5: Boss Panel UI Improvements

### Problem
1. "Divine-5 Unlocked" and "BOSS Refreshed" text wrapping badly (label width=100 too narrow)
2. Sword icon overlapping text
3. "None" displayed where killer name should be

### Solution

**Theme file** (`default.thm_11d2a765.js`):
- All CrossServerSkin boss labels (labLevel, labTime, labName 1-7): width 100 → 140, x adjusted -20 to keep center
- All sword icons (imgSword 2-7): x shifted left by 5px

**Killer name display** — creative protocol encoding:
- Server encodes killer name in `MaxBossHP` field: `"1000000|KillerName"` (only when boss is dead)
- Client parses `MaxBossHP.split("|")` → `_hpMax = parts[0]`, `_killerName = parts[1]`
- `getServerName()` returns `_killerName` if available, otherwise falls back to original logic
- `reset()` clears `_killerName`

### Files Modified
- `default.thm_11d2a765.js` — 26 label/icon position changes
- `main.min_39fbca0f*.js` (all 3 copies) — CrossServerVO initialize/getServerName/reset
- `server.jar` (all 4: kuafu, s1, s2, s3) — killer name storage and transmission

---

## Fix 6: Boss Panel UI Polish

### Changes
1. **Label widths increased further**: 140 → 180 for all boss labels (labLevel, labTime, labName 1-7) to prevent "Divine-5 Unlocked" from wrapping
2. **Sword icons moved further left**: shifted -20px from original (was -5px)
3. **Killer name gold color**: labName labels changed `textColor` to `0xEDC839` (gold) to highlight killer name
4. **"BOSS Ownership Attempts" text**: width increased to 280, `textAlign=left`, x=170; count label `labTimesGuiShu` x=440
5. **"Assist Attempts" text**: width increased to 220, `textAlign=left`, x=195; count label `labTimesXieZhu` x=400

### Files Modified
- `default.thm_11d2a765.js` — CrossServerSkin label/icon adjustments

---

## Fix 7: Battle Scene UI Adjustments

### Changes
1. **Owner name position**: `belongName` x moved from 127 → 165 to avoid overlapping with "Owner" title text
2. **My Reward button**: `btnReward` x moved from 24 → -2 (and state overrides 28 → -2) to center under boss icon

### Files Modified
- `default.thm_11d2a765.js` — CopyMainViewSkin belongName/btnReward position changes

---

## Fix 8: Boss HP Restored to 4 Billion + 1M EXP Reward

### Changes
1. **Boss HP**: Restored from test value 1,000,000 back to 4,000,000,000 (4B) in both:
   - `KuaFuComponent.java` — `BOSS_MAX_HP` and `SECRET_MAX_HP` arrays
   - `otherMonster.json` — all 7 boss entries `maxHp` field
2. **EXP reward**: Added `dropExp: 1000000` (1M EXP) to all 7 bosses in `otherMonster.json`

### Files Modified
- `server.jar` (all 4: kuafu, s1, s2, s3) — KuaFuComponent with 4B HP
- `my_kuafu/conf/copy/otherMonster.json` — HP + EXP changes

---

## Fix 9: Boss Kill Server-Wide Announcement Broadcast

### Problem
When a player kills a cross-server boss, no one else on any server knows about it.

### Solution
When a boss dies in `CrossCityScene.onObjectDeath()`, broadcast a scrolling marquee message to ALL online players across ALL servers.

**Two broadcast paths:**

1. **Kuafu server (direct):** Calls `SystemPromptHelper.sendSystemPromptToWorld(msg, 3, 1)` — type=3 (SYS channel), ifsend=1 (marquee/scrolling). This reaches all players currently on the kuafu server (i.e., all cross-server boss fighters).

2. **Main servers s1/s2/s3 (HTTP):** Background thread POSTs to each server's Tomcat ChatService endpoint:
   - URL: `http://127.0.0.1:{port}/game/services`
   - Params: `action=scrollNotice&isScroll=1&sendSys=1&content={msg}&sign={md5}`
   - Ports: 8090 (s1), 8091 (s2), 8092 (s3)
   - Sign: `MD5(isScroll + sendSys + HttpCommunicationKey)` → `MD5("11ABC123")` uppercase hex
   - If Tomcat isn't running on a server, the call silently fails (logged as warning)

**Message format (using game's `|C:&T:` color tags):**
```
|C:0xEDC839&T:PlayerName|T: has slain |C:0xFF4444&T:BossName|T: in the Cross-Server Battlefield!
```
- Player name in gold (`0xEDC839`)
- Boss name in red (`0xFF4444`)

**Key discovery — ChatService routing:**
- Tomcat `ServicesServlet` routes `action=scrollNotice` to `ChatService.doPost()`
- `ChatService` params: `isScroll` (int), `sendSys` (int), `content` (URL-encoded string), `sign` (MD5)
- When `isScroll==1`, calls `SystemPromptFacade.gmSendSystemPrompt(content)` → `SystemPromptHelper.sendSystemPromptToWorld(msg, 3, 1)`
- `sendSystemPromptToWorld` creates `G2C_Chat_Notify_Msg` (11910) with `Type=3`, `IsPaoMaDeng=1`, broadcasts via `ActionEventFacade.sendMessageToWorld()`

**Client-side handling (already built-in):**
- `G2C_Chat_Notify_Msg` received → `ChatVO.initialize()` → `_isHorstLamp = IsPaoMaDeng ? true : false`
- When `isHorstLamp==true` → `_horseLampHandler.runWith(chatVO)` → scrolling marquee text appears across screen
- Color tags `|C:0xEDC839&T:text|T:` parsed by `TextFlowMaker.generateTextFlow()` for colored inline text

**Boss names array (matches BOSS_COPY_IDS order):**
```java
private static final String[] BOSS_NAMES = {
    "Blazing Queen", "Demon Overlord", "Blazing Knight",
    "Flame Demon Overlord", "Bloodthirst Lord", "Lava Lizard King", "Rage Flame Demon King"
};
```

**Anonymous inner class:** Compilation generates `CrossCityScene$1.class` (the `new Runnable()` for HTTP thread). This MUST be injected into server.jar alongside `CrossCityScene.class`.

### Files Modified
- `server.jar` (all 4: kuafu, s1, s2, s3) — CrossCityScene with broadcast + CrossCityScene$1 inner class
- Source: `scratchpad/kuafu_boss_src/newbee/morningGlory/mmorpg/player/kuafu/CrossCityScene.java`

### Inject command
```bash
cd classes && jar uf server.jar \
  newbee/morningGlory/mmorpg/player/kuafu/CrossCityScene.class \
  newbee/morningGlory/mmorpg/player/kuafu/CrossCityScene\$1.class \
  newbee/morningGlory/mmorpg/player/kuafu/KuaFuComponent.class
```

---

## Fix 10: Item Name Truncation in TipIcon (Phantom Maze City floors)

### Problem
Item names like "Blue Holy Relic Reward" displayed full-length in CopyHuanJieCell floor items, overlapping/wrapping.

### Root Cause
Previous truncation in `RewardItemBox.dataChange` didn't work for HuanJie cells because they set items via `this._rwards[H].dataSource=J[H]` which flows through **TipIcon's `dataChanged`** path (not RewardItemBox).

### Fix
In TipIcon's switch statement where `labName.text=M.name`:
```javascript
// BEFORE: this.labName.text=M.name
// AFTER:  this.labName.text=M.name.length>11?M.name.substring(0,10)+"..":M.name
```
Limit: 11 chars (based on "Life SoulEXP" which fits correctly). Longer names show 10 chars + "..".

### Files Modified
- `main.min_39fbca0f3.js` — TipIcon dataChanged truncation

---

## Fix 11: Cultivation Exchange Panel (Obtain Materials) UI Fix

### Problem
1. "Can still exchange today5" — text and number merged/overflowed right edge
2. Item description "Pure Divine Power Essence" text overlapping with Exchange button area

### Fix

**Language string** (`main.min_39fbca0f3.js`):
```
OLD: E_JRHKDH1C="Can still exchange today<font color='#37DB31'>{1}</font>Times"
NEW: E_JRHKDH1C="Can still exchange: <font color='#37DB31'>{1}</font>"
```

**Skin layout** (`default.thm_11d2a765.js`):
Two skins affected: `RoleGodhoodExchangeAlertSkin$Skin269` and `RoleXiuShenAlertSkin$Skin276`

`labLimit` (exchange count label):
```
OLD: t.left=393;t.size=18;t.textAlign="right";t.y=14
NEW: t.size=16;t.textAlign="right";t.width=250;t.right=5;t.y=4
```

`labdesc` (item gain description): Added `t.width=260;t.maxLines=1`
`labName` (item cost description): Added `t.width=260;t.maxLines=1`

### Files Modified
- `main.min_39fbca0f3.js` — Language.E_JRHKDH1C text change
- `default.thm_11d2a765.js` — labLimit/labdesc/labName layout in 2 exchange item skins

---

## Fix 12: Optimistic Version-Lock for Player Save (prevents level/data rollback on reconnect)

### Problem
A player's level dropped from 90 to 87 after several quick reconnects. Player data
(level, items, etc.) intermittently rolled back to an older state after reconnecting.

### Root Cause
There's a race between two independent, decoupled subsystems:

1. **Kick-then-relogin flow** (cross-server/kuafu login, `GateWay.onKuaFuAuth()`,
   and ordinary reconnects): when a player logs in while their old session is
   still considered online, the server kicks the existing session via
   `PlayerManager.kickoutPlayerCharacterAsyn()` → `closeSession()`. This is
   **asynchronous** — the actual cleanup and save (`PlayerManager.leaveWorld()`
   → `savePlayerData()` → `PlayerPeriodSaveService.saveImmediateData()`) happens
   later, on its own schedule, decoupled from the kick call itself.
2. **Periodic save service** (`PlayerPeriodSaveService`, see
   `scratchpad/decompiled/sophia/mmorpg/player/persistence/PlayerPeriodSaveService.java`):
   snapshots and saves all online players' state every 15 seconds
   (`Save_Interval_Time = 15000L`), independent of any kick/relogin event.

If a player reconnects quickly after being kicked, the **new** session can load
fresh data and start progressing (gaining levels) **before** the **old**
session's queued/in-flight save (a stale snapshot captured before the
disconnect) actually reaches the DB. When that stale save finally executes, it
overwrites the newer in-memory state the new session had already produced —
silently rolling the player back to an older level/state.

### Chosen Fix: DB-Level Optimistic Version-Lock (not a timing fix)
Per explicit decision, this fix does **not** attempt to fix the async kick/relogin
timing race itself (out of scope). Instead it adds a general-purpose safety net at
the save layer: a stale save can structurally never overwrite a newer save, no
matter what timing bug causes it to be attempted.

**Save call chain (confirmed by reading the decompiled sources):**
```
PlayerManager.leaveWorld() ─┐
                             ├─→ PlayerPeriodSaveService.saveImmediateData()/handlePlayerSaveActionEvent()
PlayerPeriodSaveService     │     → doSave()/doPeriodSave() → save(SaveMode, PlayerSaveComponent)
  (every 15s, scheduled)   ─┘     → ObjectManager.save(...) → PlayerSaveSlaver.doSave()
                                       → PlayerDAO.getInstance().batchUpdate(updateCollection)
```
Both the `leaveWorld()`-triggered save and the periodic save converge on the
single chokepoint `PlayerSaveSlaver.doSave()` → `PlayerDAO.batchUpdate()` — this
is where the version-lock is enforced, so both paths are protected by the same code.

### What Changed

**1. SQL schema (`MYH5/环境/sql/myh5_s1.sql`, `MYH5/my_kuafu/setup_kuafu_db.sql`):**
- Added `player.version BIGINT NOT NULL DEFAULT 0` column to `CREATE TABLE player`.
- Added a commented `ALTER TABLE player ADD COLUMN version BIGINT NOT NULL DEFAULT 0;`
  migration statement next to the table definition, for upgrading an existing
  production DB that already has a `player` table (the `CREATE TABLE`/`CREATE
  TABLE IF NOT EXISTS` only takes effect on a brand-new DB).
- `newPlayer(...)`: now inserts literal `0` for the new `version` column on row creation.
- `updatePlayer(...)`: added `IN expectedVersion BIGINT` and `OUT affectedRows INT`
  parameters. The `UPDATE` now sets `version = version + 1` and adds
  `AND player.version = expectedVersion` to the `WHERE` clause; `affectedRows`
  is set to `ROW_COUNT()` right after. If the row's version had already moved
  on (because a newer save won the race), the `WHERE` matches 0 rows, the
  stale data is never written, and `affectedRows = 0` tells the Java caller this happened.

**2. Java (decompiled sources under
`scratchpad/decompiled/sophia/mmorpg/player/` — see note on compilation below):**
- `Player.java`: added an `AtomicLong dbVersion` field (`getDbVersion()`/
  `setDbVersion()`/`incrementAndGetDbVersion()`), mirroring the DB
  `player.version` column. Starts at 0 for both freshly-created and freshly
  DB-loaded players.
- `PlayerDAO.getPlayerFromDB()`: reads the `version` column from the result set
  and calls `player.setDbVersion(...)` when hydrating a `Player` from a DB row.
- `PlayerSaveableObject`: added `expectedVersion` (the version this save attempt
  expects the row to currently be at) and an `owningPlayer` back-reference, so
  the DAO can propagate a successful save's bumped version back to the live
  `Player` object without needing a separate DB round-trip.
- `PlayerSaveComponent.snapshot()`: before each save, copies
  `player.getDbVersion()` into the save object's `expectedVersion` and sets
  `owningPlayer`.
- `PlayerDAO.getUpdateSql()`: extended the `{call updatePlayer(...)}` JDBC call
  string with two more `?` placeholders for `expectedVersion` (IN) and
  `affectedRows` (OUT).
- `PlayerDAO`: overrode `batchUpdate()`/`update()` (previously delegated to the
  generic `ObjectDAO.modifyBatch()`, which uses JDBC `addBatch()`/
  `executeBatch()` and cannot retrieve a per-row OUT parameter) with a new
  `updateOneWithVersionLock()` that executes each player's update individually,
  sets `expectedVersion`, registers `affectedRows` as an OUT parameter, and
  after execution:
  - `affectedRows == 0` → logs
    `"Stale save detected for player - version mismatch (expectedVersion=...), save skipped to avoid overwriting newer data"`
    and returns without applying any further side effects. Does not crash.
  - `affectedRows > 0` → bumps `expectedVersion` by 1 on both the saveable
    object and the owning `Player` (mirroring `version = version + 1` in SQL),
    so the next save in this process uses the correct expected version without
    re-reading from the DB.
- Insert path (`newPlayer`) needed no Java parameter-list change — `version`
  is set server-side to a literal `0`, and a freshly created `Player` already
  defaults `dbVersion` to 0.

### Compilation Status — COMPLETED (full build + jar injection)
A follow-up session finished the build end to end. The only real blocker was
**local to `PlayerDAO.java` itself**, not `ObjectDAO.java`/`DependencyManager.java`/
`PropertiesWrapper.java`/`DaoConfig.java` as originally suspected — those files
were never actually in the compile dependency chain for `PlayerDAO`. The CFR
decompiler had mistyped three `Connection.prepareCall(sql)`/`prepareStatement(sql)`
result variables in `PlayerDAO.java` as the base `Statement` interface instead of
`PreparedStatement`/`CallableStatement`, which hid `setObject`/`setString`/
no-arg `executeUpdate()`. Fixed in place (decompiler bug fix, not a behavior
change):
- `deletePlayer()` (~line 354) and `deletePlayers()` (~line 414): `Statement pstat` → `PreparedStatement pstat` (both call `conn.prepareStatement(sql)`).
- `UpdatePlayerName()` (~line 983): `Statement callableStatement` → `CallableStatement callableStatement` (calls `conn.prepareCall(sql)`).

With those three fixed, `javac -source 8 -target 8 -cp server.jar:moyu_lib/*.jar`
compiled all 4 modified files (`Player.java`, `PlayerDAO.java`,
`PlayerSaveableObject.java`, `PlayerSaveComponent.java`) **with zero errors**
against `MYH5/my_s1/server.jar` + `MYH5/my_s1/moyu_lib/*.jar` as classpath. No
anonymous/inner classes were generated (no `$1`-style classes for this fix).

**Jar injection — done for all 4 servers.** Each original `server.jar` was
backed up first (`server.jar.bak.pre_fix12`, mirroring the existing
`.bak.pre_kuafu` convention), then patched via:
```bash
cd classes && jar uf server.jar \
  sophia/mmorpg/player/Player.class \
  sophia/mmorpg/player/persistence/PlayerDAO.class \
  sophia/mmorpg/player/persistence/PlayerSaveableObject.class \
  sophia/mmorpg/player/persistence/PlayerSaveComponent.class
```
Verified post-injection by extracting each class from each of the 4 jars and
comparing md5sum against the freshly compiled `.class` files — all 4 jars
(`MYH5/my_s1/server.jar`, `MYH5/my_s2/server.jar`, `MYH5/my_s3/server.jar`,
`MYH5/my_kuafu/server.jar`) contain the identical, correctly compiled Fix 12
classes.

Modified Java sources are kept at
`scratchpad/fix12_src/sophia/mmorpg/player/{Player.java,persistence/PlayerDAO.java,persistence/PlayerSaveableObject.java,persistence/PlayerSaveComponent.java}`
(now including the three `Statement`→`PreparedStatement`/`CallableStatement`
decompiler-bug fixes above) for reference.

### Migration SQL for existing production databases
`MYH5/环境/sql/fix12_version_lock_migration.sql` is a standalone, idempotent
migration script (guards the `ALTER TABLE` via `information_schema`, uses
`DROP PROCEDURE IF EXISTS` before each `CREATE PROCEDURE`) that brings an
**existing** `player` table up to date — the `CREATE TABLE`/`CREATE TABLE IF
NOT EXISTS` statements in `myh5_s1.sql`/`setup_kuafu_db.sql` only take effect
on a brand-new database. This ONE script must be run against **all four**
databases (`myh5_s1`, `myh5_s2`, `myh5_s3`, `myh5_kuafu` — confirmed there is
only one shared `player` schema across all 3 main servers plus kuafu; see
`MYH5/my_s{1,2,3}/data/morningGlory_data.xml` and
`MYH5/my_kuafu/data/morningGlory_data.xml` connection strings):
```bash
mysql -u root -p123456 myh5_s1    < MYH5/环境/sql/fix12_version_lock_migration.sql
mysql -u root -p123456 myh5_s2    < MYH5/环境/sql/fix12_version_lock_migration.sql
mysql -u root -p123456 myh5_s3    < MYH5/环境/sql/fix12_version_lock_migration.sql
mysql -u root -p123456 myh5_kuafu < MYH5/环境/sql/fix12_version_lock_migration.sql
```

### Deployment Note — CORRECTED (previous version of this note was wrong/unsafe)
A previous draft of this note claimed the SQL migration was "safe to deploy on
its own" before the Java change, on the theory that the new
`expectedVersion`/`affectedRows` parameters "only take effect once Java passes
them." **That claim was incorrect and dangerous.** `PlayerDAO.getUpdateSql()`
builds a fixed JDBC `CallableStatement` string — `{call updatePlayer(?, ?, ...)}`
with a hardcoded `?` count (31 before this fix, 33 after). MySQL stored
procedure calls validate the parameter count at the JDBC/server layer
independent of what Java "does" with the values — if the deployed
`updatePlayer` procedure expects 33 parameters but the running server.jar's
`CallableStatement` only supplies 31 (old jar, new SQL) — or vice versa (new
jar, old SQL: 33 supplied against a 31-parameter procedure) — **every single
player save fails immediately** with
`Incorrect number of arguments for PROCEDURE updatePlayer; expected 33, got 31`
(or the reverse). This is worse than the original bug: instead of an
occasional rollback, no player's data saves at all until both sides are back
in sync.

**The SQL and the patched server.jar MUST be deployed together, in the same
maintenance window, never independently.** Verified parameter counts (31 for
`newPlayer`, 33 for `updatePlayer`) match exactly between
`PlayerDAO.getInsertSql()`/`getUpdateSql()`'s `?` placeholders and the stored
procedure `IN`/`OUT` parameter lists in both `myh5_s1.sql` and
`fix12_version_lock_migration.sql`.

**Deployment procedure (all 4 servers/DBs together):**
1. Stop all 4 servers (s1, s2, s3, kuafu).
2. Back up all 4 databases (`mysqldump` or equivalent) — in addition to the
   `server.jar.bak.pre_fix12` backups already taken of each original jar.
3. Run `fix12_version_lock_migration.sql` against all 4 databases (commands
   above).
4. Copy the patched `server.jar` into all 4 server directories (`MYH5/my_s1`,
   `MYH5/my_s2`, `MYH5/my_s3`, `MYH5/my_kuafu`) — already done in this repo
   checkout; for a separate production deployment, copy the patched jar from
   this repo to the production server directories.
5. Start all 4 servers.

### Files Modified
- `MYH5/环境/sql/myh5_s1.sql` — `player` table `version` column + migration
  comment, `newPlayer`/`updatePlayer` procedure changes
- `MYH5/my_kuafu/setup_kuafu_db.sql` — same changes for the kuafu DB
- `MYH5/环境/sql/fix12_version_lock_migration.sql` — new standalone, idempotent
  migration script for existing production DBs (all 4)
- `scratchpad/decompiled/sophia/mmorpg/player/Player.java` — `dbVersion` field/accessors
- `scratchpad/decompiled/sophia/mmorpg/player/persistence/PlayerDAO.java` — updated SQL strings, `getPlayerFromDB()`, new `updateOneWithVersionLock()`, plus 3 decompiler `Statement`→`PreparedStatement`/`CallableStatement` typing fixes
- `scratchpad/decompiled/sophia/mmorpg/player/persistence/PlayerSaveableObject.java` — `expectedVersion`/`owningPlayer` fields
- `scratchpad/decompiled/sophia/mmorpg/player/persistence/PlayerSaveComponent.java` — `snapshot()` populates `expectedVersion`/`owningPlayer`
- `MYH5/my_s1/server.jar`, `MYH5/my_s2/server.jar`, `MYH5/my_s3/server.jar`,
  `MYH5/my_kuafu/server.jar` — patched with the compiled Fix 12 classes
  (originals preserved as `server.jar.bak.pre_fix12`)

### Final Status (verified 2026-06-30)
- **Repo state**: fully done and pushed — commit `d9b739b3` on `claude/relaxed-hypatia-ktouu7`.
  Verified directly (not just trusting agent reports): all 4 `server.jar`
  (`my_s1`, `my_s2`, `my_s3`, `my_kuafu`) contain the identical patched
  `PlayerDAO.class` (md5 `f47d973dd316a0f7ec5c025908ab96b1`), each with an
  original backup at `server.jar.bak.pre_fix12`. Migration SQL file exists at
  `MYH5/环境/sql/fix12_version_lock_migration.sql`.
- **NOT yet done**: actually running the migration SQL against live/production
  MySQL (no MySQL client/instance was available in the sandbox — verified by
  manual SQL review only, not execution), and the actual maintenance-window
  deploy (stop servers → backup DBs → run SQL on all 4 DBs → restart). This
  repo checkout's jars are already patched; only the live DB schema migration
  + live server restart remain, and those require manual production access.
- **If asked to investigate player data loss again in the future**: read this
  Fix 12 section first — the version-lock should already prevent the
  stale-save-overwrite class of bug (level rollback) at the DB layer, *once
  the migration SQL has actually been run against production*. If data loss
  still occurs after the production migration is applied, suspect either (a)
  the migration was never actually run on production, (b) a different root
  cause unrelated to the save race, or (c) the original async kick/relogin
  timing bug itself (intentionally NOT fixed by Fix 12 — see "Chosen Fix"
  above) is now surfacing as outright failed-save warnings ("Stale save
  detected...") instead of silent rollback — check server logs for that
  message to confirm Fix 12 is catching it correctly.

## Trade / Marketplace Feature — implemented 2026-06-30

Full player-to-player item marketplace ("TRADE" panel / Auction House),
covering listing items for sale, browsing/buying the market, cancelling a
listing, claiming returned/unsold items, viewing sell/buy history, and
gold<->moshi exchange. Originally the panel always showed "No tradeable
items" because the client model's three list-query methods
(`requestTradingSellMyItem`/`requestTradingSellList`/`requestTradingSellRecord`)
were empty stubs and the server had no query messages for them — only
sell/buy/cancel/pickup actions existed. This has been fully built out
end-to-end (server handlers + new protocol messages + client wiring).

### Follow-up fix (verified via real in-game screenshots, 2026-06-30)
After deploying the above, the user tested in-game and the embedded "Trade"
sub-tab inside the **Bag** panel (`BagDialog`, tabs Equipment/Item/Soul
Stone/Synthesize/Trade — note this is a SEPARATE UI surface from the
standalone `TradingSellSkin` dialog opened via `btnAuction`) still showed
"No items for trade." Root cause: `BagDialog.onSelectChange`'s tab switch
only handled `case 0`-`case 3` (Equipment/Item/Soul Stone/Synthesize) —
**`case 4` (the Trade tab) was completely missing**, so selecting that tab
never called `requestTradingSellList()` and `tradingSellListVO` stayed
permanently empty regardless of server data. A correct, unused method
`showTradingSellView()` already existed (calls `requestTradingSellList`
and binds `listTrade.dataProvider`) but was never invoked from anywhere.
Fix: added `case 4:this.showTradingSellView();break` to the switch in
`main.min_39fbca0f3.js` (backup: `main.min_39fbca0f3.js.bak.pre_trade_tab4`).

Also noted but NOT yet fixed: `G2C_TRADE_NOTIFYDROPITEMS` (the push
notification meant to tell the client "you just picked up a tradeable
item from a boss kill", per the in-game help tooltip listing 5 boss
sources) has no client-side handler registered in `main.min_39fbca0f3.js`
at all — it's a dead/unhandled message. This doesn't block browsing the
market (covered by the case-4 fix above), but the "fly-over" notification
when you loot a tradeable item won't show. If the user reports that boss
loot never visually announces itself as tradeable, wire this up next.

### Second follow-up fix: market browse was wired to the wrong handler/wire-shape (2026-06-30)
After the case-4 fix above, the user confirmed full redeploy (jar+JS+SQL+
restart) but the Trade tab still showed "No items for trade." Direct
decompilation of the live `server.jar` (CFR) found the real root cause,
two layered bugs from the original implementation:

1. **Wrong server data source.** Client's `requestTradingSellList()`
   (used by `BagDialog.showTradingSellView()`, i.e. the Trade tab the user
   was testing) called `C2G_TRADE_GETSTORAGEINFO` (17405). Server's
   `handleGetStorageInfo` answered with `TradeMgr.getStorageInfo(player)`
   — the player's OWN expired/returned listings only (`status in (2,3)`),
   which is legitimately empty for any player who has never sold
   anything. The actual "browse what everyone is selling" data lives in
   `TradeMgr.getMarketList(int,int)` → `TradeDao.getMarketList()`
   (`select * from game_auction where status=0 ... limit`), confirmed
   correctly implemented but never called by ANY protocol handler.
2. **Wrong wire shape even if the data source were fixed.** Decompiling
   `protos.min_462eb740.js` showed `G2C_Trade_GetStorageInfo`'s wire
   format only carries `ItemId/Count/BagType` (`ProtoTradeStorageItem`) —
   no price/seller/order fields. But the client's `TradingSellListVO`
   (which `BagDialog`'s `listTrade` renders, and whose `onBuyClick` logic
   inspects `E.playerId`/`E.orderId`/`E.price` to decide buy-vs-cancel)
   decodes `OrderId/PlayerId/PlayerName/ItemId/Count/Price/EndTime` —
   only `G2C_Trade_GetSellInfo`'s wire format (`ProtoTradeSellItem`, used
   for message 17409/17410) actually carries those fields. So even with
   correct data, message 17405/17406 could never deliver a renderable
   market row — the two proto shapes are incompatible at the byte level.

Fix (both sides changed together, no SQL/schema change needed):
- **Client** (`main.min_39fbca0f3.js`, backup
  `main.min_39fbca0f3.js.bak.pre_trade_market`): `requestTradingSellList`
  now sends `C2G_TRADE_GETSELLINFO` (17409) instead of
  `C2G_TRADE_GETSTORAGEINFO` (17405), and reads the response's
  `SellItemList` field instead of `ItemList` — matching the wire shape
  `TradingSellListVO.decode` actually expects.
- **Server** (`PlayerTradeComponent.handleGetSellInfo`, recompiled from
  the original implementation agent's surviving `.java` source under
  `scratchpad/trade_build/src/`, patched into all 4 `server.jar`):
  changed `TradeMgr.getSellInfo(this.self())` (self-only listings) to
  `TradeMgr.getMarketList(0, 50)` (all active listings, any seller) —
  matching what the client's `onBuyClick` (compares `E.playerId` against
  `GameModels.user.player.uid` to offer Cancel for your own rows or Buy
  for others') actually needs. This also changes the standalone
  `TradingSellSkin`/"My Item" panel (`requestTradingSellMyItem`, same
  17409 message) to show the full market rather than self-only — verified
  intentional: that panel's UI flow (tap row → `TradingSellBuyTip` →
  `requestBuyShop`) only makes sense for a market-browse list, not a
  self-only list.
- Verified: `javac` recompile clean (no errors), CFR decompile of the
  rebuilt class confirms `handleGetSellInfo` now calls
  `TradeMgr.getMarketList(0, 50)`, `node --check` clean on the patched
  JS, and `unzip -p server.jar sophia/mmorpg/Trade/PlayerTradeComponent.class
  | md5sum` identical (`86663f83...`) across all 4 server jars.
- **NOT yet verified in-game** — needs fresh jar+JS deploy and restart
  (same as before; no new SQL migration required this time) before the
  Trade tab can be confirmed fixed live.

### DB schema
`game_auction` (existing table, redesigned) — one row per listing:
`id` (orderId, PK varchar(36)), `playerId`, `sellerName`, `itemId`, `count`,
`price`, `status` (0=ACTIVE,1=SOLD,2=CANCELLED,3=EXPIRED), `startTime`,
`endTime` (epoch ms), `item` (nullable byte[], reserved for future complex
item instances). Indexes: `idx_auction_playerId`, `idx_auction_status_endTime`.
New table `game_trade_record` — one row per completed purchase: `id`,
`orderId`, `buyPlayerId`, `buyPlayerName`, `sellPlayerId`, `sellPlayerName`,
`itemId`, `count`, `price`, `buyTime`.
Applied (idempotently) to all 4 DBs' schema sources:
`MYH5/环境/sql/myh5_s1.sql` (covers my_s1/my_s2/my_s3, which share one master
schema) and `MYH5/my_kuafu/setup_kuafu_db.sql`. Standalone migration script
for already-deployed databases: `MYH5/环境/sql/trade_migration.sql`
(mirrors `fix12_version_lock_migration.sql`'s
information_schema-guarded ALTER TABLE pattern — safe to re-run).

### Defaults / design decisions
- Listing duration: fixed 7 days, enforced server-side (`TradeMgr.LISTING_DURATION_MS`),
  not DB-level.
- Trade currency: Gold. MoShi is a separate currency, only convertible via
  the dedicated `ExchangeMoShi` action (fixed placeholder 1:1 gold<->moshi
  rate — no real exchange-rate precedent exists anywhere in the decompiled
  source, so this is clearly marked as a placeholder pending real design
  input).
- No tax/fee on sale — full price credited to seller.
- Seller gold credit on a successful buy is best-effort, online-only
  (`MMORPGContext.getPlayerComponent().getPlayerManager().getOnlinePlayer`).
  **Known limitation**: if the seller is offline at sale time, gold credit
  is skipped (logged as a warning) — no cross-player mail/pending-gold
  mechanism exists for this yet.
- Cancelled/expired listings are NOT pushed back into the seller's live bag
  (could be full / seller offline). Instead the `game_auction` row is left
  with status CANCELLED/EXPIRED; `GetStorageInfo`/`PickUpStorageItem` expose
  and consume it. Row deletion on pickup == "claimed" (no extra column
  needed) — see `TradeDao`'s class-level DESIGN NOTE.
- Market list capped at 50 rows per request (`TradeDao.MARKET_LIMIT_CAP`).

### Server-side files (new)
- `sophia.mmorpg.Trade.Trade` — `game_auction` row model.
- `sophia.mmorpg.Trade.TradeRecord` — `game_trade_record` row model.
- `sophia.mmorpg.Trade.TradeMgr` — static manager: `sellItem`, `buyItem`,
  `cancelSell`, `pickUpStorageItem`, `exchangeMoShi`, `expireOverdueListings`,
  `getSellInfo`, `getStorageInfo`, `getRecordList`, `getMarketList`.
- `sophia.mmorpg.Trade.persistence.TradeDao` — singleton DAO, raw hand-rolled
  SQL (mirrors `MailDao`'s convention).
- `sophia.mmorpg.Trade.PlayerTradeComponent` — per-player component
  (mirrors `PlayerMailComponent`), registers the 8 `C2G_Trade_*` action
  listeners, dispatches to `TradeMgr`, sends `G2C_Trade_*` responses.
- 20 new proto message classes under `sophia.mmorpg.proto`: 3 structs
  (`ProtoTradeStorageItem`, `ProtoTradeSellItem`, `ProtoTradeRecord`) + 8
  C2G/G2C action pairs (GetSellInfo, GetStorageInfo, GetRecordList already
  existed as queries that were missing — now added; SellItem, BuyItem,
  CancelSell, PickUpStorageItem, ExchangeMoShi already existed and are
  unchanged) + `G2C_Trade_NotifyDropItems` (already existed, unchanged).
  `ProtoDropItems` (ID 10901) is a pre-existing, unrelated struct reused
  as-is by `G2C_Trade_NotifyDropItems` — NOT re-registered.

### Modified existing classes
- `sophia.mmorpg.player.Player` — added `playerTradeComponent` field +
  `getPlayerTradeComponent()` getter, wired into `registComponents()`.
- `sophia.mmorpg.proto.ProtoEventManager` — registered message IDs
  17400-17419 (`registerActionEvents()`): 17400-17402 are the 3 structs,
  17403-17419 are the 8 C2G/G2C pairs + the notify push, matching the
  client's `protos.min_462eb740.js` `MessageMap.TRADE_*`/`PROTOTRADE*`
  constants exactly.

### Client-side files (modified)
- `my_web/myh5_cilent/v1.1.9.1/js/main.min_39fbca0f3.js` — `mo.ModelTradingSell`'s
  three previously-empty stub methods now send real requests and populate
  the corresponding VO lists on response, mirroring the existing
  `requestSellShop`/`requestCancelSell` pattern:
  - `requestTradingSellMyItem` → `C2G_TRADE_GETSELLINFO` → `initTradingSellMyItem(SellItemList)`, `_leftSellCount = LeftCount`.
  - `requestTradingSellList` → `C2G_TRADE_GETSTORAGEINFO` → `initTradingSellList(ItemList)`.
  - `requestTradingSellRecord` → `C2G_TRADE_GETRECORDLIST` → `initTradingSellRecord(RecordList)`.
  Backed up first as `main.min_39fbca0f3.js.bak.pre_trade`. `node --check`
  confirmed syntactically valid after the edit.

### Compilation & jar-patch verification (commands actually run)
All new/modified Java compiled clean (`javac -source 8 -target 8`, only an
unrelated "unchecked operations" note, zero errors) against
`my_s1/server.jar:my_s1/moyu_lib/*`. All 26 Trade-related `.class` files
(5 new Trade/* classes + 20 new proto classes + modified `Player.class` +
modified `ProtoEventManager.class`) were injected into all 4 server jars
(`my_s1`, `my_s2`, `my_s3`, `my_kuafu`) via `jar uf`, each jar backed up
first as `server.jar.bak.pre_trade`. Verified via `md5sum` that every one
of the 26 classes is byte-identical across all 4 patched jars, and that
`Player.class`/`ProtoEventManager.class` (decompiled with `javap`) actually
contain the new `playerTradeComponent` field/getter and the 17400-17419
`MessageFactory.addMessage` registrations respectively.

### NOT yet done
- The SQL migration (`trade_migration.sql` / updated master schema files)
  has NOT been executed against any live database — this requires
  production DB access and should be run with servers stopped, per the
  ordering notes inside `trade_migration.sql`.
- No in-game/live testing has been performed (sell/buy/cancel/pickup/browse
  flow, gold deduction/credit, item delivery) — only static compilation and
  byte-for-byte jar-injection verification.

### Third follow-up fix: "Tradeable Item" screen showed nothing (2026-06-30)

**Symptom:** the standalone "Tradeable Item" dialog (`dialog.trading.TradingSellSkin`,
opened via the bag's "Tradeable Item" button) always showed "No tradeable
items.", even after the market-browse fix. The user clarified the intended
design: items dropped from 5 specific boss-kill sources (Divine Fallen Eagle,
Cross-server Secret Realm BOSS, World Boss, Lost Demon Realm, Phantom Realm
Forbidden Zone) should be sellable via this screen.

**Root causes found (three, compounding):**
1. **Wrong wire message, client-side bug.** The client's
   `requestTradingSellMyItem` (called by `TradingSellSkin.enter()`) sent
   `C2G_Trade_GetSellInfo` — the *exact same, parameterless* message already
   used by the market-browse screen (`requestTradingSellList`). Both
   functions are byte-for-byte indistinguishable requests, so the server had
   no way to tell which screen was asking; it always answered with the full
   market list (`ProtoTradeSellItem` shape: OrderId/PlayerId/.../Price/
   EndTime). The "Tradeable Item" screen's VO (`TradingSellMyItemVO.decode`)
   expects `ProtoTradeStorageItem` shape (ItemId/Count/BagType) — a field
   mismatch that left the screen empty.
2. **No trade-eligibility data anywhere server-side.** The `ITEMTRADE`
   template (`templates.Map.ITEMTRADE`, client key `"itemTrade"`) that the
   sell-confirmation popup (`TradingSellShangJiaTip`) reads price/priceMin/
   priceMax from had no server-side equivalent at all.
3. **No bag-query code path** populated "my eligible-to-sell bag items" —
   `handleGetStorageInfo` queried the (separate, legitimate) cancelled/
   expired-listing claim table, not the player's live bag.

**Key discovery that simplified the fix:** the client's own bundled data
file (`resource/data/config.nncc` / `config1.nncc`, both contain an
already-fully-populated `"itemTrade"` JSON array — 47 itemIds with
price/priceMin/priceMax/pool fields) turns out to **already encode the
intended whitelist** — these are exactly the boss-drop items the game design
intends to be tradeable. No new item list had to be invented; it was
extracted verbatim from this existing client data and mirrored server-side.

Also discovered: `JSONDataManager.load()` (server) indexes **every** `*.json`
file under `conf/` by filename, regardless of whether a loader is registered
in `ConcreteGameRefObjetLoaderRegister` — so a brand-new template type can be
read via `JSONDataManagerContext.get("itemTrade")` directly from `TradeMgr`
without needing to touch that large, shared ~100-entry registry class at all
(avoids the highest-risk part of the originally-considered approach).

Also discovered: `C2G_Trade_GetStorageInfo` / `requestPickupShop` (pickup-
storage) was **already wired by the client to refresh the same
`TradingSellMyItemVO` list** the "Tradeable Item" screen renders
(`initTradingSellMyItem(E.ItemList)`), and no client code currently sends
`C2G_Trade_GetStorageInfo` at all — confirming this message is safe to
fully repurpose for "player's own tradeable bag items" with no risk to any
existing feature.

**Fix:**
- `TradeMgr` (new): lazily loads `conf/.../itemTrade.json` (read by filename
  via `JSONDataManagerContext.get("itemTrade")`, no registry changes) into
  an `itemId -> ItemTradeRule{price,priceMin,priceMax}` map. New
  `getTradeableBagItems(Player)` enumerates the player's live bag
  (`getItemBagComponent().getItemBag().getItemBagCollection()`) and returns
  `Trade`-shaped (itemId/count) entries for any item whose id is in the
  whitelist.
- `TradeMgr.sellItem` now also validates `itemId` is in the whitelist and
  `price` is within `[priceMin, priceMax]` before allowing a listing
  (previously had no such checks).
- `PlayerTradeComponent.handleGetStorageInfo` / `handlePickUpStorageItem`
  now build their response from `TradeMgr.getTradeableBagItems(player)`
  instead of the legacy claim-table query.
- `itemTrade.json` (new, 47 entries, identical values to the client's
  `config.nncc`/`config1.nncc` `"itemTrade"` array) added under
  `conf/item/` in all 4 server instances (`my_s1`, `my_s2`, `my_s3`,
  `my_kuafu`).
- **One client JS edit** (`main.min_39fbca0f3.js`): `requestTradingSellMyItem`
  now sends `C2G_Trade_GetStorageInfo` / reads `E.ItemList`/`E.LeftSellCount`
  instead of colliding with the market-browse message — this was a genuine
  pre-existing bug in the client bundle (the function name says
  "MyItem" but was wired to the wrong message), not new client behavior
  being invented.

**Files modified:**
- `sophia/mmorpg/Trade/TradeMgr.java` (whitelist load + `getTradeableBagItems`
  + `sellItem` validation)
- `sophia/mmorpg/Trade/ItemTradeRule.java` (new, plain bean)
- `sophia/mmorpg/Trade/PlayerTradeComponent.java` (`handleGetStorageInfo`,
  `handlePickUpStorageItem` data source swap)
- `conf/item/itemTrade.json` (new, all 4 server instances)
- `js/main.min_39fbca0f3.js` (`requestTradingSellMyItem`, 1 function body)

**Compilation & jar-patch verification:** `TradeMgr`, `ItemTradeRule`,
`PlayerTradeComponent`, `Trade`, `TradeRecord` compiled clean (`javac
-source 8 -target 8`) and injected into all 4 server jars via `jar uf`
(each backed up first as `server.jar.bak.pre_trade_whitelist`). Verified via
`md5sum` that `TradeMgr.class` is byte-identical across all 4 patched jars.

**NOT yet done:** no in-game/live testing of the "Tradeable Item" → list →
buy flow has been performed; the actual boss-kill drop tables were not
audited to confirm itemId-to-boss-source attribution (the implementation is
intentionally pull-based / sell-time whitelist validation, so it does not
depend on tracking which boss an item came from — only whether the item id
is on the whitelist and currently in the player's bag).

---

## Exchange Gems (ExchangeMoShi) — Bug History & Root Cause

### CRITICAL: Item 201 (Magic Stone) = MoShi Currency

**DO NOT** call `MGRewardUtil.reward(player, "201_N", ...)` inside `exchangeMoShi`.

**Why this breaks everything:**
- `propsItem.json` item 201 has `"itemType": 0` and `"isNonPropertyItem": 1`
- `MGDropLibFacade.pickupItems` for itemType=0 routes to `MGResourceUtil.addResource(player, 201, N, source)`
- `MGResourceUtil.addResource` with id=201 calls `addMoShi(N)` because `CurrencyUnit.MoShi = 201`
- Net result: `setMoShi(current - N)` deducts N, then `addMoShi(N)` adds N back → **zero change**
- Client sees `E.LeftCount = original_balance` (unchanged) and ♦ counter never moves

**Attempted approaches that FAILED (do not retry):**

1. ❌ `subUnbindGold(count, source)` — returned true, gave items, but getMoShi() returned old value in response. Root cause: subUnbindGold internally calls setMoShiImpl → setMoShi + notifyProperty, but THEN reward("201_N") called addMoShi undoing it.
2. ❌ `money.setMoShi(current - count) + money.notifyProperty() + MGRewardUtil.reward("201_count")` — same net-zero problem. setMoShi worked but reward("201_N") = addMoShi(N) restoring original value.

**Correct fix (commit c6b7030c):**
```java
money.setMoShi(current - count);
money.notifyProperty();
// NO reward call — item 201 IS MoShi, rewarding it would undo the deduction
return RuntimeResult.OK();
```
MoShi decreases by `count`. `remainingMagicStones(player)` = `getMoShi()` after deduction = correct LeftCount.

### Key facts to remember
- `CurrencyUnit.Gold = 101`, `CurrencyUnit.MoShi = 201`, `CurrencyUnit.Exp = 301`
- These correspond to item refIds 101/201/301 in propsItem.json (all `itemType=0, isNonPropertyItem=1`)
- `MGResourceUtil.addResource(player, 201, N, source)` = `addMoShi(N)` 
- `MGResourceUtil.addResource(player, 101, N, source)` = `addGold(N)`
- Rewarding "currency items" = modifying the player's property, NOT adding to bag
- `setMoShi()` and `getMoShi()` both use `MGPropertyAccesser` on `player.getProperty()` — same dictionary, consistent reads/writes
- `PlayerMoneyComponent.notifyProperty()` builds a separate PropertyDictionary, reads current getMoShi() value, sends to client — correct as long as called AFTER setMoShi


### Fourth follow-up: Exchange Gems redesign — Gold→♦ direction (2026-07-01)

**Finding:** MoShi (♦, property 1007) and Magic Gem (item 201) ARE THE SAME currency.
- Both use property 1007 (TypeProperty.UnbindedGold)
- `player.mojing` = `player.diamonds` = `player.getProperty(1007)`
- Item 201: `itemType=0, isNonPropertyItem=1` → addResource(201,N) = addMoShi(N) = property 1007
- This is correct by design — they are one unified currency shown in two places

**Previous broken design (do not revert to):**
- Exchange spent ♦ → no reward (just a sink, user loses ♦ for nothing)
- User tested: "MoShi increases/decreases with Magic Gem" — confirmed same currency

**Correct design (commit a99f62b4):**
- Exchange Gems = spend Gold → receive ♦ (players TOP UP their trade balance with Gold)
- ♦ increases after exchange (not decreases)
- Dialog shows Gold balance and Gold icon (not ♦/diamond)

**Client JS changes (DimensityExchangeAlert):**
- `initData`: `vo.fromPool(vo.ItemVO, 101)` (Gold icon instead of 201)
- `showMoJing`: `player.gold` in lblTatolPrice0, `player.mojing` in labLimit0
- Property listener: `TypeProperty.Gold` (fires when Gold changes after spending)
- offPropertyChange: also changed to `TypeProperty.Gold`

**Client skin changes (DimensityExchange in default.thm_11d2a765.js):**
- `_Label2` text: "Owned" → "Gold:"
- `imgTatolPayType0` source: `trading_json.img_crystal_little` → `common_json.img_gold_png`
- `imgPayType` source (unit price icon): diamond → gold (`common_json.img_gold_png`)

**TypeProperty IDs (for reference):**
- `TypeProperty.Gold = 1005` (Gold Coins)
- `TypeProperty.UnbindedGold = 1007` (♦ MoShi = Magic Gems = same thing)
- `player.gold` = `getProperty(1005)`
- `player.mojing` = `player.diamonds` = `getProperty(1007)`


### ⚠️ CRITICAL: Always compile Java with `-source 8 -target 8`

Server runs Java 8. Compiling without explicit target produces Java 21 bytecode (class version 65).
Java 8 JVM throws `UnsupportedClassVersionError` on load → **server crashes silently, WebSocket accepts connection but sends no data → "can't enter server"**.

**ALWAYS use:**
```bash
javac -source 8 -target 8 -cp "$CP" -d out MyClass.java
```

**Verify before injecting:**
```python
data = open('MyClass.class','rb').read()
assert data[7] == 52, f"Wrong Java version: {data[7]} (need 52=Java8)"
```

This mistake broke the server in commit 8b8d3051 (TradeMgr EXCHANGE_RATE change) — fixed in f6c312be.

### ⚠️ CRITICAL: Edit the correct JS file

The manifest at `v1.1.9.1/manifest.json` loads:
- `js/main.min_39fbca0f4.js`  ← **THIS is the active game logic file**
- `js/default.thm_11d2a765.js` ← **THIS is the active skin file**

Files `main.min_39fbca0f.js`, `main.min_39fbca0f2.js`, `main.min_39fbca0f3.js` are OLD/UNUSED copies.
Editing those has NO effect on the running game.

---

## Fix 13: Demon Realm Expedition (MOJIE) — prevent disconnect on kuafu

### Problem
Clicking the "Demon Realm Expedition" tab in the Cross-Server Battlefield screen caused "Connection failed" disconnect when on the kuafu server (port 8028).

### Root Cause
`CrossDemonDialog.enter()` auto-calls `ModelSceneDemon.getDemonInfo()` which sends `C2G_MOJIE_GETINFO` (17703) immediately. This ID was NOT registered in `ProtoEventManager` → `DemuxingProtocolDecoder.doDecode` crashed → WebSocket closed → disconnect.

### Fix
- **ProtoEventManager** patched (via `patch_mojie_proto.py`): registered 18 MOJIE message IDs (17703-17746 range) so the decoder never crashes on any MOJIE message
- **18 new proto classes** added to all 4 server.jar files:
  - `C2G_MoJie_GetInfo` (17703), `G2C_MoJie_GetInfo` (17704) — core GetInfo pair
  - `G2C_MoJie_BuyCount` (17722), `G2C_MoJie_GetDropRecord` (17746) — response stubs
  - 14 C2G stub classes for all other MOJIE client messages (17705-17745 range)
- **KuaFuComponent** updated with MOJIE handlers:
  - `handleMoJieGetInfo` (17703) → responds `G2C_MoJie_GetInfo` with LeftChallengeCount=2, BuyCount=0
  - `handleMoJieBuyCount` (17721) → stub response (feature not fully implemented)
  - `handleMoJieGetDropRecord` (17745) → empty record list response
  - All other MOJIE C2G IDs → logged and silently ignored (no crash, no response)

### Message IDs registered
C2G: 17703, 17705, 17707, 17709, 17711, 17712, 17714, 17715, 17721, 17726, 17729, 17730, 17733, 17734, 17745
G2C: 17704, 17722, 17746

### Files Modified
- `server.jar` (all 4: my_s1, my_s2, my_s3, my_kuafu) — 18 new MOJIE proto classes + patched ProtoEventManager + updated KuaFuComponent
- `main.min_39fbca0f4.js` — reverted wrong previous fix (remove `_isCross` block that disabled the Demon tab)

### Patcher script
`scratchpad/patch_mojie_proto.py` — same pattern as `patch_glove_proto.py`

### Source files
`scratchpad/mojie_src/` — all 18 proto classes + updated KuaFuComponent.java

### Status (commit a8b662fa → updated)
- Tab opens without disconnect ✓
- "Today left: 2" displays correctly ✓
- Time restriction "Daily 13:00-21:00 opens" bypassed → `config.nncc` dataSetting 1402002 changed from `"13:00-21:00"` to `"0:00-23:59"` (always open for testing)
- Co-op button click now works: `C2G_MOJIE_CREATEROOM` (17705) → server responds with `G2C_MOJIE_CREATEROOM` (17706) containing a 1-player room with the requester
- After room creation, Start button (C2G_MOJIE_START=17714) is silently ignored — dungeon scene entry is NOT implemented (requires CrossDemonScene=305 and full combat loop)

### ⚠️ CRITICAL: ProtoEventManager patcher must run on ORIGINAL class
When re-patching ProtoEventManager, ALWAYS start from the original pre-mojie backup:
`jar xf server.jar.bak.pre_mojie sophia/mmorpg/proto/ProtoEventManager.class`
NOT from the already-patched version — otherwise all IDs get double-registered → `IllegalArgumentException: commandId already mapped` on server startup.

### config.nncc time field mapping
`dataSetting` section, row `[id, groupId, type, name, description, value]`:
- ID 1402002 → value = open time range string "H:MM-H:MM"
- Used by `CrossDemonDialog.enter()` to display "Daily{value} opens" and by `checkRedFunction()` to determine red dot

### Known issues / next steps
- Dungeon gameplay (CrossDemonScene type 305) not implemented
- Invite/Join other players not implemented (stubs)
- Buy count (spend items for extra attempts) stub only
