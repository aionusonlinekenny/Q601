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

### 1. UI changes → edit `default.thm_11d2a764.js` only
The Egret engine reads the compiled JS bundle at runtime. EXML files are source-only — editing them has NO effect on the game.

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
GUI tool for replacing sprites in game atlas PNG files.

Import logic when source image ≠ slot size:
- If alpha bbox < 80% of source → crop to visible object, then resize to slot
- Else (solid/near-solid background from ChatGPT) → center cover-crop to slot aspect ratio

Tip: ask ChatGPT to generate with **transparent background** for best results.

### 5. Translation
All Chinese UI text in `default.thm_11d2a764.js` has been translated to English.
Only safe display-text patterns were targeted; protocol identifiers and config keys were not touched.
