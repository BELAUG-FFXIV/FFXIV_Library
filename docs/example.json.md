# Example JSON Format for FFXIV Library

```json
{
  "ytId": "XXXXXXXXXXX",
  "slug": "quest-or-fight-slug",
  "title": {
    "EN": "English Title",
    "JP": "日本語タイトル",
    "ZH": "繁體中文標題"
  },
  "category": "MSQ | Fight | Mount | BGM",
  "expac": "ARR | HW | SB | SHB | EW | DT",
  "patch": "7.0",
  "tags": ["MSQ", "ARR", "Quest"],
  "playlistUrl": "https://www.youtube.com/playlist?list=XXXXXXX"
}


完美 ✅
這個應該要放在 example.json.md 的同一份指南裡，作為「category 對照表」
這樣未來你自己、或任何貢獻者在新增 JSON 時都知道該填什麼分類。

我幫你整合一份正式、乾淨、可直接放進 repo 的版本👇

⸻


# 📘 BELAUG · FFXIV Library JSON Format Guide

這份文件說明 FFXIV Library 網站各類內容（Quest、Fight、BGM、Mount 等）的 JSON 結構與分類對照表。  
所有 JSON 檔案均使用 UTF-8 編碼，統一放在 `/data/` 資料夾下。  

---

## 🧩 JSON Structure Example

```json
{
  "ytId": "dz0Nj-TMlcI",
  "slug": "we-come-in-peace",
  "title": {
    "EN": "We Come in Peace",
    "JP": "蜜の道を辿って",
    "ZH": "沿著蜜徑而來"
  },
  "category": "MSQ",
  "expac": "ARR",
  "patch": "2.0",
  "tags": ["ARR", "MSQ", "Quest"],
  "playlistUrl": "https://www.youtube.com/playlist?list=PLtC2r5occXAlrJCM-l4Vn8O-29uqbMYSt"
}

🔹 Field Descriptions

欄位	說明	範例
ytId	YouTube 影片 ID（只需 ID，不含完整網址）	"dz0Nj-TMlcI"
slug	對應 HTML 檔案的名稱（小寫英文、連字號）	"we-come-in-peace"
title.EN	英文標題	"We Come in Peace"
title.JP	日文標題	"蜜の道を辿って"
title.ZH	繁體中文標題	"沿著蜜徑而來"
category	類別（參見下方對照表）	"MSQ"
expac	所屬版本：ARR / HW / SB / SHB / EW / DT	"ARR"
patch	對應遊戲版本	"2.0"
tags	關鍵字陣列，用於搜尋或篩選	["ARR", "MSQ", "Quest"]
playlistUrl	對應播放清單網址	"https://www.youtube.com/playlist?list=..."


⸻

🗂 Category Reference

Key	說明
MSQ	Main Story (MSQ)
AllianceRaid24	24人聯盟戰 Raid（Alliance Raid）
Raid8	8人高難 Raid（Pandæmonium / Eden / Arcadion 等）
Dungeon	地下城（Dungeons）
Trial	討滅戰（Trials）
JobQuests	職業任務（Job Quests）
RoleQuests	職責任務（Role Quests）
AlliedSociety	友好部族任務（Allied Society Quests）
SideFeature	支線功能（Side Features）
Seasonal	季節活動（Seasonal Events）
GoldSaucer	金碟遊樂場（Gold Saucer）
BGM	音樂（BGM Entries）
CollMount	收藏：坐騎（Mount Collection）
CollWeapon	收藏：武器（Weapon Collection）
CollTool	收藏：工具（Skysteel / Stellar Tools 等）
HighDiff	高難戰鬥（Extreme / Savage / Ultimate）
RelaxingBGM	放鬆音樂系列（Relaxing / Scenic BGM）
PVP	對戰內容（PVP Modes）


⸻

💾 File Naming Convention
	•	所有 JSON 檔放在 /data/
	•	檔名與 HTML slug 一致，例如：

/data/we-come-in-peace.json
/guides/we-come-in-peace.html


⸻

🧱 Version Control Tips
	•	若同一影片會更新，維持相同 slug。
	•	若屬不同版本（例如 Remastered），可新增 slug 如：
	•	we-come-in-peace-remastered
	•	seekers-of-eternity-7_2

⸻

📄 File Name:
example.json.md

📍 Path Suggestion:
/docs/example.json.md

⸻

是否要我幫你加上「comment 區塊」或「多語 i18n 說明」的部分（例如頁面如何對應語言顯示）？這樣可以一起完成成為完整指南。
