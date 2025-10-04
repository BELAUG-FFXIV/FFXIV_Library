完美 👍 那我幫你升級成「正式開發指南版 Quest Template」，
也就是可以直接放進 /docs/quest-template.html.md 當開發文件用，
裡面會包含：

✅ 全結構範例
✅ 各區段完整註解（HTML comment）
✅ JSON 對應說明
✅ tab 說明表
✅ 語言切換邏輯
✅ 開發時注意事項（包括 link 未建立時使用 #、YouTube iframe、翻譯欄位等）

⸻

以下是最終正式版（可直接整份貼進 repo）👇

⸻


# 📘 Quest Page Template · BELAUG · FFXIV Library

This document defines the **official HTML structure and implementation guide** for all Quest-type pages in the BELAUG · FFXIV Library.  
It applies to **Main Story (MSQ), Side Quests, Role Quests, Job Quests, and Allied Society Quests.**

---

## 🧱 File Naming & Location

- **Path:** `/guides/quests/`
- **File Format:** `.html`
- **JSON Data (optional):** `/data/[slug].json`

**Example**

/guides/quests/we-come-in-peace.html
/data/we-come-in-peace.json

---

## 🧩 HTML Structure (With Comments)

Below is the **standard HTML template** for Quest pages.  
Every section includes inline developer comments (`<!-- ... -->`) describing its purpose.

```html
<!doctype html>
<html lang="zh-Hant">
<head>
  <!-- 🔹 Basic Meta -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- 🔹 Title & Description -->
  <title>[EN Title] | BELAUG · FFXIV Library</title>
  <meta name="description" content="FFXIV [Expac] Quest — [EN Title]：故事概要、任務需求、解鎖內容與後續任務，附影片。">

  <link rel="icon" href="../img/favicon.ico" />

  <!-- 🔹 Base Styling -->
  <style>
    :root { --bg:#fff8e6; --card:#fff; --fg:#222; --muted:#666; --border:#e5e1d8; --accent:#e11d48; }
    *{box-sizing:border-box}
    body{margin:0; font-family:system-ui,-apple-system,"Segoe UI",Roboto,Inter,"Noto Sans TC","Noto Sans JP",Arial,sans-serif;
         background:var(--bg); color:var(--fg)}
    .container{max-width:1080px;margin:0 auto;padding:0 16px}
    .site-header{border-bottom:1px solid var(--border);background:#fff9edb3;backdrop-filter:saturate(120%) blur(6px);position:sticky;top:0;z-index:10}
    .nav{display:flex;align-items:center;justify-content:space-between;height:60px}
    .home{border:1px solid var(--border);background:#fff;padding:4px 8px;border-radius:8px;text-decoration:none;color:var(--fg);font-weight:800}
    .home:hover{background:#fffef8}
    .icon-btn{background:none;border:none;cursor:pointer;font-size:14px;padding:6px 10px;border-radius:8px}
    .icon-btn:hover{background:#fff;border:1px solid var(--border)}
    .main{padding:20px 0 40px}
    .grid{display:grid;grid-template-columns:1.1fr 1fr;gap:20px;align-items:start}
    @media(max-width:900px){.grid{grid-template-columns:1fr}.video-wrap{position:relative;padding-top:56.25%}.video-wrap iframe{position:absolute;inset:0;width:100%;height:100%}}
    .card{background:var(--card);border:1px solid var(--border);border-radius:16px;box-shadow:0 4px 14px rgba(0,0,0,.05)}
    .card .hd{padding:14px 16px;border-bottom:1px solid var(--border);font-weight:700}
    .card .bd{padding:16px}
    .video-card .bd{padding:0}
    .video-card iframe{width:100%;height:420px;border:0;display:block;border-radius:16px}
    .tabs{display:flex;gap:8px;padding:12px 12px 0;flex-wrap:wrap}
    .tab-btn{background:#fff;border:1px solid var(--border);color:var(--fg);border-radius:999px;padding:8px 14px;cursor:pointer;font-weight:600}
    .tab-btn[aria-selected="true"]{border-color:var(--accent);color:#fff;background:var(--accent)}
    .tab-panel{display:none}
    .tab-panel.active{display:block}
    .stack{display:flex;flex-direction:column;gap:10px}
    .row{padding:12px 14px;border:1px dashed var(--border);border-radius:12px;background:#fffdf6}
    .muted{color:var(--muted)}
    .link{color:#0b60d8;text-decoration:none}
    .link:hover{text-decoration:underline}
  </style>
</head>

<body>

  <!-- 🌐 HEADER: Site Navigation -->
  <header class="site-header">
    <nav class="container nav">
      <a class="home" href="../index.html">🏠 Home</a>
      <button id="langToggle" class="icon-btn" aria-label="切換語言">🌐 EN</button>
    </nav>
  </header>

  <!-- 🧭 MAIN CONTENT AREA -->
  <main class="container main">
    <div class="grid">

      <!-- 🎥 LEFT COLUMN: YouTube Video -->
      <section class="card video-card">
        <div class="bd">
          <div class="video-wrap">
            <!-- ⚠️ Replace ytId with actual video ID -->
            <iframe id="ytFrame" src="https://www.youtube.com/embed/[ytId]" title="[EN Title]" allowfullscreen></iframe>
          </div>
        </div>
      </section>

      <!-- 📑 RIGHT COLUMN: Tabs & Content -->
      <section class="card">
        <div class="hd" id="pageTitle">[EN Title]</div>

        <!-- 🔸 TAB BUTTONS -->
        <div class="tabs" role="tablist">
          <button class="tab-btn" role="tab" aria-selected="true"  data-tab="story">Story</button>
          <button class="tab-btn" role="tab" aria-selected="false" data-tab="acq">Acquisition</button>
          <button class="tab-btn" role="tab" aria-selected="false" data-tab="req">Requirements</button>
          <button class="tab-btn" role="tab" aria-selected="false" data-tab="unlock">Unlocks</button>
        </div>

        <!-- 🔸 TAB PANELS -->
        <div class="bd">
          <div id="panel-story" class="tab-panel active"></div>
          <div id="panel-acq" class="tab-panel"></div>
          <div id="panel-req" class="tab-panel"></div>
          <div id="panel-unlock" class="tab-panel"></div>
        </div>
      </section>
    </div>
  </main>

  <!-- ⚙️ LANGUAGE SWITCH LOGIC -->
  <script>
    const LANG_KEY = 'ffxiv-guide-lang';
    const i18n = {
      EN:{
        langLabel:'EN',
        pageTitle:'[EN Title]',
        tabs:{ story:'Story', acq:'Acquisition', req:'Requirements', unlock:'Unlocks' },
        story:`<p>[Full English Story Text]</p>`,
        acq:`<div class="stack"><div class="row"><b>Quest Giver:</b> [Name], [Location] (X: , Y: )</div></div>`,
        req:`<div class="stack"><div class="row"><b>Preceding Quest:</b> <a class="link" href="#">[Quest Name]</a></div></div>`,
        unlock:`<div class="stack"><div class="row"><b>Follow-Up Quest:</b> <a class="link" href="#">[Quest Name]</a></div></div>`
      },
      JP:{
        langLabel:'JP',
        pageTitle:'[JP Title]',
        tabs:{ story:'ストーリー', acq:'入手方法', req:'前提条件', unlock:'開放内容' },
        story:`<p>[日本語ストーリー本文]</p>`,
        acq:`<div class="stack"><div class="row"><b>依頼人：</b>[JP Name]　[JP Location] (X: , Y: )</div></div>`,
        req:`<div class="stack"><div class="row"><b>前提クエスト：</b><a class="link" href="#">[JP Quest]</a></div></div>`,
        unlock:`<div class="stack"><div class="row"><b>開放クエスト：</b><a class="link" href="#">[JP Quest]</a></div></div>`
      },
      ZH:{
        langLabel:'ZH',
        pageTitle:'[ZH Title]',
        tabs:{ story:'故事概要', acq:'取得方式', req:'需求條件', unlock:'解鎖內容' },
        story:`<p>[繁體中文故事內容]</p>`,
        acq:`<div class="stack"><div class="row"><b>任務發布者：</b>[Name]，[Location] (X: , Y: )</div></div>`,
        req:`<div class="stack"><div class="row"><b>前置任務：</b><a class="link" href="#">[Quest Name]</a></div></div>`,
        unlock:`<div class="stack"><div class="row"><b>後續任務：</b><a class="link" href="#">[Quest Name]</a></div></div>`
      }
    };

    // 🔁 Common Language Switch Handler
    const langToggle = document.getElementById('langToggle');
    const pageTitle  = document.getElementById('pageTitle');
    const tabBtns    = [...document.querySelectorAll('.tab-btn')];
    const panels = { story:panel('story'), acq:panel('acq'), req:panel('req'), unlock:panel('unlock') };

    function panel(id){ return document.getElementById('panel-'+id); }
    function getLang(){ return localStorage.getItem(LANG_KEY)||'EN'; }
    function applyLang(lang){
      const t=i18n[lang]||i18n.EN;
      pageTitle.textContent=t.pageTitle;
      langToggle.textContent=`🌐 ${t.langLabel}`;
      tabBtns.forEach(b=>{ b.textContent=t.tabs[b.dataset.tab]; });
      const active=tabBtns.find(b=>b.getAttribute('aria-selected')==='true')||tabBtns[0];
      renderPanel(active.dataset.tab,lang);
    }
    function renderPanel(key,lang){
      const t=i18n[lang]||i18n.EN;
      Object.keys(panels).forEach(k=>panels[k].classList.remove('active'));
      panels[key].classList.add('active');
      panels[key].innerHTML=t[key];
    }
    tabBtns.forEach(btn=>{
      btn.addEventListener('click',()=>{
        tabBtns.forEach(b=>b.setAttribute('aria-selected','false'));
        btn.setAttribute('aria-selected','true');
        renderPanel(btn.dataset.tab,getLang());
      });
    });
    langToggle.addEventListener('click',()=>{
      const cur=getLang(); const next=cur==='EN'?'JP':(cur==='JP'?'ZH':'EN');
      localStorage.setItem(LANG_KEY,next); applyLang(next);
    });
    applyLang(getLang());
  </script>

</body>
</html>


⸻

🗂 Tab Definition Table

Tab ID	EN	JP	ZH-TW	Description
story	Story	ストーリー	故事概要	Full narrative (multi-paragraph)
acq	Acquisition	入手方法	取得方式	Quest giver and location
req	Requirements	前提条件	需求條件	Prerequisite quests or conditions
unlock	Unlocks	開放内容	解鎖內容	Follow-up quests or unlocks


⸻

🧾 JSON Structure Example

Each Quest HTML page can reference a JSON file (optional) for global indexing.

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


⸻

🧩 Development Notes
	•	Always use official English/Japanese quest titles.
	•	If the corresponding HTML does not exist, use href="#" temporarily.
	•	Use <p> for story paragraphs.
	•	Maintain consistent formatting across all expansions.
	•	Keep filenames lowercase with hyphens (-), never spaces.
	•	Match ytId in both HTML and JSON.

⸻

📄 File name: quest-template.html.md
📍 Location: /docs/quest-template.html.md

⸻

是否要我接著幫你寫同一套格式的 fight-template.html.md？
會同樣包含註解、tab 表、JSON 範例與開發說明。
