# 📘 Quest Page Template · BELAUG · FFXIV Library（含 Comments 分頁）

這份文件是 **Quest 類頁面（MSQ / Side / Role / Job / Allied Society）** 的官方模板與實作指南。  
✅ 已內建三語切換  
✅ 內建 **Comments／コメント／留言** 分頁（使用 Giscus）  
✅ 留言串會依語言分流（同一頁 URL，不同語言各自獨立討論串）

---

## 🧱 檔名與位置

- HTML 放在：`/guides/quests/`
- 檔名：`[slug].html`
- （可選）對應 JSON：`/data/[slug].json`

**範例**

/guides/quests/we-come-in-peace.html
/data/we-come-in-peace.json

---

## 🧩 標準 HTML 範本（含註解 & Comments 分頁）

> 直接複製整段，替換中括號內容即可（如 `[EN Title]`、`[ytId]`）。

```html
<!doctype html>
<html lang="zh-Hant">
<head>
  <!-- 🔹 Meta -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- 🔹 Title / Description -->
  <title>[EN Title] | BELAUG · FFXIV Library</title>
  <meta name="description" content="FFXIV [Expac] Quest — [EN Title]：故事概要、任務需求、解鎖內容與後續任務，附影片。">

  <link rel="icon" href="../img/favicon.ico" />

  <!-- 🔹 Base Styles（維持你現有的鵝黃色系） -->
  <style>
    :root { --bg:#fff8e6; --card:#fff; --fg:#222; --muted:#666; --border:#e5e1d8; --accent:#e11d48; }
    *{box-sizing:border-box}
    body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Inter,"Noto Sans TC","Noto Sans JP",Arial,sans-serif;background:var(--bg);color:var(--fg)}
    .container{max-width:1080px;margin:0 auto;padding:0 16px}
    .site-header{border-bottom:1px solid var(--border);background:#fff9edb3;backdrop-filter:saturate(120%) blur(6px);position:sticky;top:0;z-index:10}
    .nav{display:flex;align-items:center;justify-content:space-between;height:60px}
    .home{border:1px solid var(--border);background:#fff;padding:4px 8px;border-radius:8px;text-decoration:none;color:var(--fg);font-weight:800}
    .home:hover{background:#fffef8}
    .icon-btn{background:none;border:none;cursor:pointer;font-size:14px;padding:6px 10px;border-radius:8px}
    .icon-btn:hover{background:#fff;border:1px solid var(--border)}
    .main{padding:20px 0 40px}
    .grid{display:grid;grid-template-columns:1.1fr 1fr;gap:20px;align-items:start}
    @media (max-width:900px){
      .grid{grid-template-columns:1fr}
      .video-wrap{position:relative;padding-top:56.25%}
      .video-wrap iframe{position:absolute;inset:0;width:100%;height:100%}
    }
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
  <!-- 🌐 Header -->
  <header class="site-header">
    <nav class="container nav">
      <a class="home" href="../index.html">🏠 Home</a>
      <button id="langToggle" class="icon-btn" aria-label="切換語言">🌐 EN</button>
    </nav>
  </header>

  <!-- 🧭 Main -->
  <main class="container main">
    <div class="grid">

      <!-- 🎥 Left: YouTube -->
      <section class="card video-card">
        <div class="bd">
          <div class="video-wrap">
            <!-- ⚠️ 替換 [ytId] -->
            <iframe id="ytFrame" src="https://www.youtube.com/embed/[ytId]" title="[EN Title]" allowfullscreen></iframe>
          </div>
        </div>
      </section>

      <!-- 📑 Right: Tabs -->
      <section class="card">
        <div class="hd" id="pageTitle">[EN Title]</div>

        <!-- 🔸 Tab buttons：最後一顆為 Comments -->
        <div class="tabs" role="tablist">
          <button class="tab-btn" role="tab" aria-selected="true"  data-tab="story">Story</button>
          <button class="tab-btn" role="tab" aria-selected="false" data-tab="acq">Acquisition</button>
          <button class="tab-btn" role="tab" aria-selected="false" data-tab="req">Requirements</button>
          <button class="tab-btn" role="tab" aria-selected="false" data-tab="unlock">Unlocks</button>
          <button class="tab-btn" role="tab" aria-selected="false" data-tab="comments">Comments</button>
        </div>

        <!-- 🔸 Panels：最下面多一個 Comments 容器 -->
        <div class="bd">
          <div id="panel-story"    class="tab-panel active"></div>
          <div id="panel-acq"      class="tab-panel"></div>
          <div id="panel-req"      class="tab-panel"></div>
          <div id="panel-unlock"   class="tab-panel"></div>

          <!-- 💬 Comments 面板：只放容器，由 JS 動態載入 giscus -->
          <div id="panel-comments" class="tab-panel">
            <div id="giscus_container" style="min-height:320px;"></div>
          </div>
        </div>
      </section>
    </div>
  </main>

  <!-- ⚙️ i18n + Tab + Giscus（留言） -->
  <script>
    const LANG_KEY = 'ffxiv-guide-lang';

    /* 🔤 三語文案：只在 tabs 裡加 comments 的標籤，不要添加 comments 內容 */
    const i18n = {
      EN:{
        langLabel:'EN',
        pageTitle:'[EN Title]',
        tabs:{ story:'Story', acq:'Acquisition', req:'Requirements', unlock:'Unlocks', comments:'Comments' },
        story:`<p>[Full English Story]</p>`,
        acq:`<div class="stack"><div class="row"><b>Quest Giver:</b> [Name], [Location] (X: , Y: )</div></div>`,
        req:`<div class="stack"><div class="row"><b>Preceding Quest:</b> <a class="link" href="#">[Quest Name]</a></div></div>`,
        unlock:`<div class="stack"><div class="row"><b>Follow-Up Quest:</b> <a class="link" href="#">[Quest Name]</a></div></div>`
      },
      JP:{
        langLabel:'JP',
        pageTitle:'[JP Title]',
        tabs:{ story:'ストーリー', acq:'入手方法', req:'前提条件', unlock:'開放内容', comments:'コメント' },
        story:`<p>[日本語ストーリー本文]</p>`,
        acq:`<div class="stack"><div class="row"><b>依頼人：</b>[JP Name]　[JP Location] (X: , Y: )</div></div>`,
        req:`<div class="stack"><div class="row"><b>前提クエスト：</b><a class="link" href="#">[JP Quest]</a></div></div>`,
        unlock:`<div class="stack"><div class="row"><b>開放クエスト：</b><a class="link" href="#">[JP Quest]</a></div></div>`
      },
      ZH:{
        langLabel:'ZH',
        pageTitle:'[ZH Title]',
        tabs:{ story:'故事概要', acq:'取得方式', req:'需求條件', unlock:'解鎖內容', comments:'留言' },
        story:`<p>[繁體中文故事內容]</p>`,
        acq:`<div class="stack"><div class="row"><b>任務發布者：</b>[Name]，[Location] (X: , Y: )</div></div>`,
        req:`<div class="stack"><div class="row"><b>前置任務：</b><a class="link" href="#">[Quest Name]</a></div></div>`,
        unlock:`<div class="stack"><div class="row"><b>後續任務：</b><a class="link" href="#">[Quest Name]</a></div></div>`
      }
    };

    /* 🧠 通用 Tab / 語言切換 */
    const langToggle = document.getElementById('langToggle');
    const pageTitle  = document.getElementById('pageTitle');
    const tabBtns    = [...document.querySelectorAll('.tab-btn')];
    const panels = {
      story   : document.getElementById('panel-story'),
      acq     : document.getElementById('panel-acq'),
      req     : document.getElementById('panel-req'),
      unlock  : document.getElementById('panel-unlock'),
      comments: document.getElementById('panel-comments') // 新增
    };

    function getLang(){ return localStorage.getItem(LANG_KEY) || 'EN'; }
    function uiLang(code){ return code==='JP' ? 'ja' : (code==='ZH' ? 'zh-TW' : 'en'); }

    function applyLang(lang){
      const t = i18n[lang] || i18n.EN;
      pageTitle.textContent = t.pageTitle;
      langToggle.textContent = `🌐 ${t.langLabel}`;
      tabBtns.forEach(btn => { btn.textContent = t.tabs[btn.dataset.tab]; });
      const activeBtn = tabBtns.find(b=>b.getAttribute('aria-selected')==='true') || tabBtns[0];
      renderPanel(activeBtn.dataset.tab, lang);

      // 若目前停在留言分頁，切語言後重載 giscus
      if (activeBtn && activeBtn.dataset.tab === 'comments') loadGiscusForCurrentLang();
    }

    function renderPanel(key, lang){
      const t = i18n[lang] || i18n.EN;
      Object.keys(panels).forEach(k => panels[k].classList.remove('active'));
      panels[key].classList.add('active');

      if (key !== 'comments') {
        panels[key].innerHTML = t[key];
      } else {
        loadGiscusForCurrentLang();
      }
    }

    tabBtns.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        tabBtns.forEach(b=>b.setAttribute('aria-selected','false'));
        btn.setAttribute('aria-selected','true');
        renderPanel(btn.dataset.tab, getLang());
      });
    });

    langToggle.addEventListener('click', ()=>{
      const cur = getLang();
      const next = cur==='EN' ? 'JP' : (cur==='JP' ? 'ZH' : 'EN');
      localStorage.setItem(LANG_KEY, next);
      applyLang(next);
    });

    /* 💬 Giscus：依語言分流的留言串 */
    const GISCUS_CFG = {
      // 👉 把下面四個值換成你的實際值（giscus.app 產生）
      repo:      'belaug-ffxiv/FFXIV_Library',
      repoId:    'REPO_ID_HERE',
      category:  'General',
      categoryId:'CATEGORY_ID_HERE',
      // 留言配色：固定亮色以符合目前頁面色調；若要跟隨系統改 'preferred_color_scheme'
      theme:     'light'
    };

    function loadGiscusForCurrentLang(){
      const mount = document.getElementById('giscus_container');
      if (!mount) return;
      mount.innerHTML = ''; // 清掉舊的 iframe/script

      const langCode = getLang(); // EN / JP / ZH
      const s = document.createElement('script');
      s.src = 'https://giscus.app/client.js';
      s.setAttribute('data-repo', GISCUS_CFG.repo);
      s.setAttribute('data-repo-id', GISCUS_CFG.repoId);
      s.setAttribute('data-category', GISCUS_CFG.category);
      s.setAttribute('data-category-id', GISCUS_CFG.categoryId);

      // 用 'specific' + term，把「同一頁、不同語言」分成不同串
      s.setAttribute('data-mapping', 'specific');
      s.setAttribute('data-term', location.pathname + '｜' + langCode);

      s.setAttribute('data-reactions-enabled', '1');
      s.setAttribute('data-emit-metadata', '0');
      s.setAttribute('data-input-position', 'bottom');
      s.setAttribute('data-lang', uiLang(langCode));
      s.setAttribute('data-theme', GISCUS_CFG.theme);
      s.setAttribute('crossorigin', 'anonymous');
      s.async = true;

      mount.appendChild(s);
    }

    // 初始
    applyLang(getLang());
  </script>
</body>
</html>


⸻

🗂 分頁鍵一覽（Quest）

Tab ID	EN	JP	ZH-TW	用途
story	Story	ストーリー	故事概要	任務敘事（多段 <p>）
acq	Acquisition	入手方法	取得方式	任務發布者與座標
req	Requirements	前提条件	需求條件	前置任務、等級、職業
unlock	Unlocks	開放内容	解鎖內容	後續任務或功能
comments	Comments	コメント	留言	Giscus 留言面板（語言分流）


⸻

🧾（可選）對應 JSON 範例

{
  "ytId": "dz0Nj-TMlcI",
  "slug": "we-come-in-peace",
  "title": { "EN": "We Come in Peace", "JP": "蜜の道を辿って", "ZH": "沿著蜜徑而來" },
  "category": "MSQ",
  "expac": "ARR",
  "patch": "2.0",
  "tags": ["ARR", "MSQ", "Quest"],
  "playlistUrl": "https://www.youtube.com/playlist?list=PLtC2r5occXAlrJCM-l4Vn8O-29uqbMYSt"
}


⸻

✅ 開發注意
	•	不要在 i18n 裡增加 comments: 內容（只需要 tabs.comments 的文字）。
	•	renderPanel() 內 comments 面板不可覆寫 innerHTML；改用 loadGiscusForCurrentLang()。
	•	語言切換時若停在留言分頁，要重載 giscus（範本已處理）。
	•	若你的站點之後有全站主題切換（暗/亮），把 GISCUS_CFG.theme 換成 'preferred_color_scheme'。
	•	連結未建好時，暫時用 href="#"；建好後再改。
	•	檔名一律小寫、使用連字號（we-come-in-peace.html）。

⸻


