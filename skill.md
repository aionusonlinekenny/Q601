# Dịch Thuật Conf JSON (Tiếng Trung → Tiếng Anh)

## Tổng Quan

Dịch toàn bộ chuỗi tiếng Trung trong các file JSON cấu hình game tại `MYH5/my_s1/conf/` (và đồng bộ sang `my_s2/`, `my_s3/`), nhắm vào các trường user-visible. Kết quả được commit lên branch `claude/game-server-setup-docs-Lf1ZF`.

---

## Phương Pháp

### Pipeline dịch

1. **Phát hiện ký tự Hán** — regex `[一-鿿㐀-䶿]` kiểm tra từng giá trị string/dict/list
2. **Áp dụng phrase dictionary** — sắp xếp theo độ dài giảm dần (longest-first) để tránh conflict substring
3. **Xử lý color tag** — format `|C:0xXXXXXX&T:text|T:` được split an toàn, chỉ dịch phần `text` bên trong
4. **Dịch nested dict/list** — đệ quy vào `property`, `configData`, `questData`, v.v.
5. **Dịch Python string literal** — regex `r"(?<=:\s)'([^'\\]*(?:\\.[^'\\]*)*)'"`  cho các field lưu dạng dict repr
6. **Mirror sang s2/s3** — sau khi ghi my_s1, `shutil.copy2` tự động copy sang my_s2 và my_s3

### Script thực thi

Các script `/tmp/translate_conf_batch*.py` được chạy tuần tự:

| Batch | Nội dung chính |
|-------|---------------|
| 1–7   | Chapters, monsters, skills, pets, achievements, UI labels, activities |
| 8     | Wing/mount evolution, wing skills, pets, mounts, shengHun, relics |
| 9a–9f | NPCs, VIP, gameVip, lifeSoul, ladder, taskDay, legion, gameRecharge |
| 10    | Wing equip, heroDragon, petEvolve, NPC full, lostTemple, systemPrompt, quest |
| 10b   | petMysteryEgg, npc property.name, relicChapter, systemPromptConfig labels |
| 10c   | taskNewbie (101 rows), skill names+descs (76 rows), plotQuest property |
| 10d   | taskNewbie 2 remaining, skill desc fragments |
| 10e   | skill.json 8 remaining rows (names + desc edge cases) |

---

## Kết Quả

### Files đã dịch xong (0 Chinese rows)

| Nhóm | File |
|------|------|
| Activity | activityManage, activitySetting, activityReward, holidaySeting, holidayBuy, holidayReward |
| Hefu | mergeSeting, mergeBuy |
| GameInstance | Ins_1 – Ins_9, Ins_pk1 – Ins_pk5 |
| NPC | npc/npc.json |
| Pet | petMysteryEgg |
| Quest | dailyQuest |
| Skill | skill/skill.json |
| Task | taskDay, taskNewbie |
| VIP | gameVip, viplottery |
| Union | legionTask, legionManor |
| WorldBoss | worldBoss |
| Ladder | ladder |
| LifeSoul | lifeSoulLine |
| GameRecharge | gameRecharge |
| LostTemple | relicChapter, relicMonster |
| SystemPromptConfig | systemPromptConfig, unionSystemChat |
| PlotQuest | plotQuest (property.name + property.description) |
| Wing | wing, heroWingEquip, heroWingSkill |
| Mount | heroRide |
| Dragon | heroDragon |
| ... | 200+ file khác |

### Files còn Chinese (intentionally skipped)

| File | Rows | Lý do |
|------|------|-------|
| `copy/otherChapter.json` | 2,567 | Story content — NPC dialogue toàn bộ |
| `dataSetting/dataSetting.json` | 1,163 | Internal game config parameters |
| `robot/robotName.json` | 499 | Tên NPC robot — không user-visible |
| `alarm/itemAlarm.json` | 342 | Item alarm strings |
| `symbol.json` | 101 | Schema documentation nội bộ (developer-facing) |
| `quest/plotQuest.json` | 95 | NPC talkContent trong Python string literal (property.name/desc đã dịch) |

---

## Các Pattern Đặc Biệt

### Regex transform (không dùng phrase dict)

```python
# Tên heroDragon: "帝龙三阶·5星" → "Emperor Dragon Tier 3 · 5 Stars"
TIER_MAP = {'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8}
re.match(r'^帝龙([一二三四五六七八])阶·(\d+)星', name)

# Tên heroWingEquip: "飞羽3阶" → "Flying Feather Tier 3"
WING_EQUIP_MAP = {'飞羽':'Flying Feather','纤羽':'Slim Feather','绒羽':'Fluffy Feather','翎羽':'Plume Feather'}
re.match(r'^([飞纤绒翎]羽)(\d+)阶', name)

# Mô tả petEvolve: "3阶可开启第2天赋槽位" → "Tier 3 unlocks Talent Slot 2"
re.match(r'^(\d+)阶可开启第(\d+)天赋槽位', des)

# Tên relic: "XXX3阶" → "XXX Tier 3"
re.match(r'^(.*?)(\d+)阶', name)
```

### NPC sight mapping

```python
SIGHT_MAP = {
    '福': 'Welfare', '镇': 'Tower', '勋': 'Medal', '药': 'Pharmacy',
    '活': 'Event', '传': 'Teleport', '武': 'Weapon', '衣': 'Clothing',
    '饰': 'Accessory', '杂': 'General', '仓': 'Storage',
}
```

### Xử lý color tag an toàn

```python
def translate_ct(s):
    if '|C:' not in s:
        return apply_phrases(s)
    def replace_tag(m):
        col, txt = m.group(1), m.group(2)
        return f"|C:{col}&T:{apply_phrases(txt)}|T:"
    result = re.sub(r'\|C:(0x[0-9A-Fa-f]+)&T:(.*?)\|T:', replace_tag, s)
    # Xử lý phần text ngoài tag
    parts = re.split(r'(\|C:.*?&T:.*?\|T:)', result)
    out = []
    for p in parts:
        if p.startswith('|C:') and '&T:' in p and p.endswith('|T:'):
            out.append(p)
        else:
            out.append(apply_phrases(p))
    return ''.join(out)
```

---

## Commit

```
da5e18e7  Translate conf: wings, mounts, NPCs, skills, quests, activities (batches 8-10)
029c657c  Translate conf: activity, skills, pets, achievements, UI labels (batches 2-7)
eacf30e6  Translate conf: chapters, monsters, skills, pets (batch 1)
```

Branch: `claude/game-server-setup-docs-Lf1ZF`
