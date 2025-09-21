/* =========================
   基本狀態 & DOM 參照
   ========================= */
const state = {
  data: [],
  filtered: [],
  page: 1,
  perPage: 12,
  tags: [],
  query: '',
  category: '',
  expac: '',
  patch: '',
  sort: 'newest', // 🔄 改用 UI 控制（newest/oldest/titleAZ/titleZA）
};

const grid         = document.getElementById('grid');
const pager        = document.getElementById('pager');
const resultCount  = document.getElementById('resultCount');
const q            = document.getElementById('q');
const categorySel  = document.getElementById('category');
const expacSel     = document.getElementById('expac');
const patchSel     = document.getElementById('patch');
const clearBtnEl   = document.getElementById('clear');
const sortSel      = document.getElementById('sort');   // ✅ 新增：排序下拉
const activeTags   = document.getElementById('activeTags');
const themeToggle  = document.getElementById('themeToggle');
const langToggle   = document.getElementById('langToggle');

/* =========================
   推薦影片設定
   ========================= */
const featuredVideo = {
  ytId: "rSE9mxzvSg8",
  title: {
    EN: "⭐ Featured: Relax at Sunset in Shirogane",
    JP: "⭐ おすすめ：シロガネの夕暮れでくつろいで",
    ZH: "⭐ 推薦影片：在 Shirogane 靜謐的海岸邊，迎接寧靜的夜晚"
  }
};

/* =========================
   主題切換（亮/暗）
   ========================= */
const THEME_KEY = 'ffxiv-lib-theme';

function applyTheme(mode){
  if(mode === 'dark'){
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.textContent = '☀️';
  }else{
    document.documentElement.removeAttribute('data-theme');
    if (themeToggle) themeToggle.textContent = '🌙';
  }
}
applyTheme(localStorage.getItem(THEME_KEY) || 'light');

themeToggle?.addEventListener('click', ()=>{
  const cur = localStorage.getItem(THEME_KEY) || 'light';
  const next = (cur === 'dark') ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

/* =========================
   載入資料
   ========================= */
fetch('data/library.json')
  .then(r => r.json())
  .then(json => {
    state.data = (json.items || []).map(deriveFields);
    applyFilters();
    renderFeatured();
  })
  .catch(err => {
    grid.innerHTML = `<p>載入資料失敗：${err?.message || err}</p>`;
  });

function deriveFields(it){
  const patchNum = parseFloat((it.patch || '0').replace(/[^\d.]/g,'') || 0);
  const dateNum  = it.date ? +new Date(it.date) : 0;
  return {...it, _patchNum: patchNum, _dateNum: dateNum};
}

/* =========================
   篩選 / 排序 / 分頁
   ========================= */
function applyFilters(){
  const qstr = state.query.trim().toLowerCase();

  let arr = state.data.filter(it => {
    const byCat  = state.category ? it.category === state.category : true;
    const byExp  = state.expac ? it.expac === state.expac : true;

    // Patch 篩選：支援 7.x 這種大版本
    let byPatch = true;
    if (state.patch) {
      const itemPatch = (it.patch || '');
      if (state.patch.endsWith('.x')) {
        const major = state.patch.split('.')[0];
        byPatch = itemPatch.startsWith(major + '.');
      } else {
        byPatch = itemPatch === state.patch || itemPatch.startsWith(state.patch);
      }
    }

    const byTags = state.tags.length ? state.tags.every(t => it.tags?.includes(t)) : true;

    const byQuery = qstr ? [
      it.title?.EN, it.title?.JP, it.title?.ZH,
      it.series, it.category, it.expac, it.patch, ...(it.tags||[])
    ].filter(Boolean).join(' ').toLowerCase().includes(qstr) : true;

    const visible = !(it.hidden === true || it.publish === false);

    return byCat && byExp && byPatch && byTags && byQuery && visible;
  });

  // ✅ 依 UI 選擇排序
  arr = sortArray(arr, state.sort);

  state.filtered = arr;
  state.page = 1;
  render();
}

// 共用排序：newest/oldest 用 patch；titleAZ/titleZA 用目前語言的標題
function sortArray(arr, mode){
  const lang = getLang();
  return arr.slice().sort((a,b)=>{
    if(mode === 'oldest') return (a._patchNum||0) - (b._patchNum||0) || (b._dateNum - a._dateNum);
    if(mode === 'titleAZ'){
      const ta = (a.title?.[lang] || a.title?.EN || '').toLowerCase();
      const tb = (b.title?.[lang] || b.title?.EN || '').toLowerCase();
      return ta.localeCompare(tb) || (b._dateNum - a._dateNum);
    }
    if(mode === 'titleZA'){
      const ta = (a.title?.[lang] || a.title?.EN || '').toLowerCase();
      const tb = (b.title?.[lang] || b.title?.EN || '').toLowerCase();
      return tb.localeCompare(ta) || (b._dateNum - a._dateNum);
    }
    // default: newest
    return (b._patchNum||0) - (a._patchNum||0) || (b._dateNum - a._dateNum);
  });
}

function render(){
  resultCount.textContent = state.filtered.length;

  const start = (state.page - 1) * state.perPage;
  const view  = state.filtered.slice(start, start + state.perPage);

  grid.innerHTML = view.map(cardHTML).join('') || `<p>沒有符合的內容。</p>`;

  const pages = Math.ceil(state.filtered.length / state.perPage);
  pager.innerHTML = pages > 1
    ? Array.from({length: pages}, (_,i)=>{
        const p = i+1;
        return `<button class="pagebtn ${p===state.page?'active':''}" data-page="${p}">${p}</button>`;
      }).join('')
    : '';

  // ▶ 播放按鈕（同時送 GA 事件，若 gtag 存在）
  grid.querySelectorAll('[data-play]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const ytId  = btn.dataset.play;
      const title = btn.dataset.title;
      openPlayer(ytId, title);

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'play_button_click', {
          event_category: 'Video',
          event_label: title,
          video_id: ytId
        });
      }
    });
  });

  // Tag 點擊
  grid.querySelectorAll('[data-tag]').forEach(t =>
    t.addEventListener('click', ()=> addTag(t.dataset.tag))
  );

  // 分頁
  pager.querySelectorAll('[data-page]').forEach(b =>
    b.addEventListener('click', ()=>{
      state.page = +b.dataset.page;
      render();
    })
  );

  renderActiveTags();
}

/* =========================
   工具：產生單頁連結
   ========================= */
function getPageHref(it){
  if (it.slug) return `guides/${it.slug}.html`;
  if (it.pageUrl) return it.pageUrl;
  return '';
}

/* =========================
   卡片 HTML（標題隨語言切換）
   ========================= */
function cardHTML(it){
  const thumb = it.thumb || `https://i.ytimg.com/vi/${it.ytId}/hqdefault.jpg`;
  const lang  = getLang();
  const safe = s => (s||'').replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
  const title = it.title?.[lang] || it.title?.EN || it.title?.JP || it.title?.ZH || 'Untitled';

  const metaL = [
    it.expac   && `<span class="badge">${it.expac}</span>`,
    it.patch   && `<span class="badge">${it.patch}</span>`,
    it.category&& `<span class="badge">${it.category}</span>`,
  ].filter(Boolean).join('');

  const tags = (it.tags||[]).slice(0,6)
    .map(t => `<span class="tag" data-tag="${t}">#${t}</span>`).join('');

  const detailHref = it.slug ? `guides/${it.slug}.html` : it.pageUrl;

  const playBtn = it.ytId
    ? `<button class="btn play" data-play="${it.ytId}" data-title="${safe(title)}">Play</button>`
    : '';

  const detailBtn = detailHref
    ? `<a class="btn btn-detail" href="${detailHref}" rel="noopener">Detail</a>`
    : '';

  const playlistBtn = it.playlistUrl
    ? `<a class="btn ghost" href="${it.playlistUrl}" target="_blank" rel="noopener">Playlist</a>`
    : '';

  const youtubeBtn = it.videoUrl
    ? `<a class="btn ghost yt-only" href="${it.videoUrl}" target="_blank" rel="noopener" aria-label="YouTube">
         <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" class="yt-icon">
           <path d="M23.5 6.2s-.2-1.7-.8-2.5c-.8-.9-1.7-.9-2.1-1-3-.2-7.6-.2-7.6-.2h-.1s-4.6 0-7.6.2c-.4 0-1.3 0-2.1-1-.6.8-.8 2.5-.8 2.5S2 8.1 2 10v1.9c0 1.9.2 3.8.2 3.8s.2 1.7.8 2.5c.8.9 1.9.9 2.4 1 1.7.2 7.2.2 7.2.2s4.6 0 7.6-.2c.4 0 1.3 0 2.1-1 .6-.8.8-2.5.8-2.5s.2-1.9.2-3.8V10c0-1.9-.2-3.8-.2-3.8zM9.8 13.6V8.4l5.9 2.6-5.9 2.6z"/>
         </svg>
       </a>`
    : '';

  // ✅ 把目前語言的標題與 patch 寫進 data-*，給排序/DOM 使用
  return `
  <article class="card" data-title="${safe(title)}" data-patch="${safe(it.patch || '')}">
    <img class="thumb" src="${thumb}" alt="${safe(title)}" loading="lazy">
    <div class="body">
      <h3 class="title">${safe(title)}</h3>
      <div class="meta">${metaL}</div>
      ${it.series ? `<div class="meta">系列：${safe(it.series)}</div>` : ''}
      <div class="actions">
        ${playBtn}
        ${detailBtn}
        ${playlistBtn}
        ${youtubeBtn}
      </div>
      <div class="tags" style="margin-top:8px">${tags}</div>
    </div>
  </article>`;
}

/* =========================
   推薦影片渲染（跟語言同步）
   ========================= */
function renderFeatured(){
  const box = document.getElementById('featured');
  if(!box || !featuredVideo) return;

  const lang  = getLang();
  const title = featuredVideo.title?.[lang] || featuredVideo.title?.EN || '⭐ Featured';

  box.innerHTML = `
    <div class="featured-card">
      <h2 class="section-title">${title}</h2>
      <div class="video-wrapper">
        <iframe
          src="https://www.youtube.com/embed/${featuredVideo.ytId}"
          title="${title}" width="100%" height="315" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen></iframe>
      </div>
    </div>
  `;
}

/* =========================
   播放器 Modal
   ========================= */
const modal      = document.getElementById('playerModal');
const modalTitle = document.getElementById('modalTitle');
const ytFrame    = document.getElementById('ytFrame');
document.getElementById('modalClose')?.addEventListener('click', closePlayer);
modal?.addEventListener('close', ()=>{ ytFrame.src=''; });

function openPlayer(ytId, title){
  if (modalTitle) modalTitle.textContent = title || '播放中…';
  if (ytFrame) ytFrame.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
  modal?.showModal();
}
function closePlayer(){ modal?.close(); }

/* =========================
   Tag 操作
   ========================= */
function addTag(tag){
  if(!state.tags.includes(tag)){
    state.tags.push(tag);
    applyFilters();
  }
}
function removeTag(tag){
  state.tags = state.tags.filter(t => t !== tag);
  applyFilters();
}
function renderActiveTags(){
  activeTags.innerHTML = state.tags.map(t => `<span class="tag">#${t}<span class="x" data-rm="${t}">×</span></span>`).join('');
  activeTags.querySelectorAll('[data-rm]').forEach(x =>
    x.addEventListener('click', ()=>removeTag(x.dataset.rm))
  );
}

/* =========================
   事件綁定
   ========================= */
q?.addEventListener('input', e => { state.query = e.target.value; applyFilters(); });
categorySel?.addEventListener('change', e => { state.category = e.target.value; applyFilters(); });
expacSel?.addEventListener('change', e => { state.expac = e.target.value; applyFilters(); });
patchSel?.addEventListener('change', e => { state.patch = e.target.value; applyFilters(); });

// ✅ 排序選單事件
sortSel?.addEventListener('change', e => {
  state.sort = e.target.value || 'newest';
  // 只改排序、保留目前的 filter/page；這裡重排 filtered 再 re-render
  state.filtered = sortArray(state.filtered, state.sort);
  state.page = 1;
  render();
});

clearBtnEl?.addEventListener('click', () => {
  state.query=''; state.category=''; state.expac=''; state.patch='';
  state.tags=[];
  if(q) q.value=''; if(categorySel) categorySel.value='';
  if(expacSel) expacSel.value=''; if(patchSel) patchSel.value='';
  // 清除後維持目前的排序選項
  applyFilters();
});

/* =========================
   I18N + LANGUAGE SWITCH
   ========================= */
const LANG_KEY = 'ffxiv-lib-lang';
const taglineEl    = document.getElementById('tagline');
const itemsSuffixEl= document.getElementById('itemsSuffix');

const i18n = {
  EN: {
    langLabel: 'EN',
    tagline: 'Organized by series: Main Story, Raids, BGM, Jobs/Events, Tools & Collections. Supports search, tags, and quick play.',
    searchPH: 'Search title, series, tags, chapter…',
    itemsSuffix: 'items',
    categories: [
      { value: '',               label: 'All Categories' },
      { value: 'MSQ',            label: 'Main Story (MSQ)' },
      { value: 'AllianceRaid24', label: 'Alliance Raid (24ppl)' },
      { value: 'Raid8',          label: 'Raid (8ppl)' },
      { value: 'Dungeon',        label: 'Dungeon' },
      { value: 'Trial',          label: 'Trial' },
      { value: 'JobQuests',      label: 'Job Quests' },
      { value: 'RoleQuests',     label: 'Role Quests' },
      { value: 'AlliedSociety',  label: 'Allied Society Quests' },
      { value: 'SideFeature',    label: 'Side / Feature Quests' },
      { value: 'Seasonal',       label: 'Seasonal / Special Events' },
      { value: 'GoldSaucer',     label: 'Gold Saucer' },
      { value: 'BGM',            label: 'BGM' },
      { value: 'CollMount',      label: 'Collection (Mount)' },
      { value: 'CollWeapon',     label: 'Collection (Weapon)' },
      { value: 'CollTool',       label: 'Collection (DOH/DOL Tool)' },
      { value: 'HighDiff',       label: 'High-difficulty Content' },
      { value: 'RelaxingBGM',    label: 'Relaxing Background Vibes' },
      { value: 'PVP',            label: 'PVP' },
    ],
    expansions: [
      { value: '',   label: 'All Expansions' },
      { value: 'ARR', label: 'A Realm Reborn (ARR)' },
      { value: 'HW',  label: 'Heavensward (HW)' },
      { value: 'SB',  label: 'Stormblood (SB)' },
      { value: 'SHB', label: 'Shadowbringers (SHB)' },
      { value: 'EW',  label: 'Endwalker (EW)' },
      { value: 'DT',  label: 'Dawntrail (DT)' },
    ],
    patches: [
      { value: '',    label: 'All Patch' },
      { value: '7.x', label: '7.x' },
      { value: '6.x', label: '6.x' },
      { value: '5.x', label: '5.x' },
      { value: '4.x', label: '4.x' },
      { value: '3.x', label: '3.x' },
      { value: '2.x', label: '2.x' },
    ],
    clear: 'Clear filters',
  },
  JP: {
    langLabel: 'JP',
    tagline: 'シリーズ別に整理：メインストーリー、レイド、BGM、ジョブ/イベント、ツール＆コレクション。検索・タグ・クイック再生に対応。',
    searchPH: 'タイトル・シリーズ・タグ・章… を検索',
    itemsSuffix: '件',
    categories: [
      { value: '',               label: '全ての分類' },
      { value: 'MSQ',            label: 'メインストーリー' },
      { value: 'AllianceRaid24', label: 'アライアンス（24人）' },
      { value: 'Raid8',          label: 'レイド（8人）' },
      { value: 'Dungeon',        label: 'ダンジョン' },
      { value: 'Trial',          label: '討伐・討滅戦' },
      { value: 'JobQuests',      label: 'ジョブクエスト' },
      { value: 'RoleQuests',     label: 'ロールクエスト' },
      { value: 'AlliedSociety',  label: '友好部族クエスト' },
      { value: 'SideFeature',    label: 'サブクエスト / コンテンツ開放クエスト' },
      { value: 'Seasonal',       label: 'シーズナルイベント / スペシャルイベント' },
      { value: 'GoldSaucer',     label: 'ゴールドソーサー' },
      { value: 'BGM',            label: 'BGM' },
      { value: 'CollMount',      label: 'マウントコレクション' },
      { value: 'CollWeapon',     label: '武器コレクション' },
      { value: 'CollTool',       label: 'クラフター/ギャザラーツールコレクション' },
      { value: 'HighDiff',       label: '高難度コンテンツ' },
      { value: 'RelaxingBGM',    label: 'リラックスできるFFXIVの風景と音楽' },
      { value: 'PVP',            label: 'PVP' },
    ],
    expansions: [
      { value: '',   label: '全ての資料片' },
      { value: 'ARR', label: '新生エオルゼア' },
      { value: 'HW',  label: '蒼天のイシュガルド' },
      { value: 'SB',  label: '紅蓮のリベレーター' },
      { value: 'SHB', label: '漆黒のヴィランズ' },
      { value: 'EW',  label: '暁月のフィナーレ' },
      { value: 'DT',  label: '黄金のレガシー' },
    ],
    patches: [
      { value: '',    label: '全てのPatch' },
      { value: '7.x', label: '7.x' },
      { value: '6.x', label: '6.x' },
      { value: '5.x', label: '5.x' },
      { value: '4.x', label: '4.x' },
      { value: '3.x', label: '3.x' },
      { value: '2.x', label: '2.x' },
    ],
    clear: '条件をクリア',
  },
  ZH: {
    langLabel: 'ZH',
    tagline: '以系列為主軸整理：主線、團本、BGM、職業/活動、工具與蒐集。支援搜尋、標籤與快速播放。',
    searchPH: '搜尋標題、系列、標籤、章節…',
    itemsSuffix: '項內容',
    categories: [
      { value: '',               label: '全部分類' },
      { value: 'MSQ',            label: '主線任務' },
      { value: 'AllianceRaid24', label: '聯盟戰（24人）' },
      { value: 'Raid8',          label: '團本（8人）' },
      { value: 'Dungeon',        label: '副本' },
      { value: 'Trial',          label: '討伐戰' },
      { value: 'JobQuests',      label: '職業任務' },
      { value: 'RoleQuests',     label: '角色職業任務' },
      { value: 'AlliedSociety',  label: '友好部族任務' },
      { value: 'SideFeature',    label: '支線 / 內容開放任務' },
      { value: 'Seasonal',       label: '季節 / 特別活動' },
      { value: 'GoldSaucer',     label: '金碟遊樂場' },
      { value: 'BGM',            label: 'BGM' },
      { value: 'CollMount',      label: '蒐集 - 坐騎' },
      { value: 'CollWeapon',     label: '蒐集 - 武器' },
      { value: 'CollTool',       label: '蒐集 - 製作/採集用工具' },
      { value: 'HighDiff',       label: '高難度內容' },
      { value: 'RelaxingBGM',    label: 'FFXIV 背景放鬆音樂' },
      { value: 'PVP',            label: 'PVP' },
    ],
    expansions: [
      { value: '',   label: '全部資料片' },
      { value: 'ARR', label: '新生艾奧傑亞' },
      { value: 'HW',  label: '蒼天的伊修加德' },
      { value: 'SB',  label: '紅蓮的解放者' },
      { value: 'SHB', label: '漆黑的反叛者' },
      { value: 'EW',  label: '曉月的終焉' },
      { value: 'DT',  label: '黃金的遺產' },
    ],
    patches: [
      { value: '',    label: '全部 Patch' },
      { value: '7.x', label: '7.x' },
      { value: '6.x', label: '6.x' },
      { value: '5.x', label: '5.x' },
      { value: '4.x', label: '4.x' },
      { value: '3.x', label: '3.x' },
      { value: '2.x', label: '2.x' },
    ],
    clear: '清除條件',
  }
};

function refillSelect(selectEl, options, keepValue=true) {
  if (!selectEl) return;
  const prev = keepValue ? selectEl.value : '';
  selectEl.innerHTML = options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
  const exists = options.some(o => String(o.value) === String(prev));
  selectEl.value = exists ? prev : (options[0]?.value ?? '');
}

function applyLangUI(lang) {
  const dict = i18n[lang];
  if (!dict) return;

  if (langToggle) langToggle.textContent = `🌐 ${dict.langLabel}`;
  if (taglineEl)   taglineEl.textContent   = dict.tagline;
  if (q)           q.placeholder           = dict.searchPH;
  if (itemsSuffixEl && dict.itemsSuffix) itemsSuffixEl.textContent = ` ${dict.itemsSuffix}`;

  refillSelect(categorySel, dict.categories, true);
  refillSelect(expacSel,    dict.expansions, true);
  refillSelect(patchSel,    dict.patches,    true);

  if (clearBtnEl) clearBtnEl.textContent = dict.clear;
}

function getLang(){
  return localStorage.getItem(LANG_KEY) || 'EN';
}

function cycleLang() {
  const cur = getLang();
  const next = cur === 'EN' ? 'JP' : (cur === 'JP' ? 'ZH' : 'EN');
  localStorage.setItem(LANG_KEY, next);
  applyLangUI(next);
  renderFeatured();
  render(); // ✅ 切換語言後會重畫卡片（data-title 也更新），排序仍適用
}

langToggle?.addEventListener('click', cycleLang);

// 初始化語言
applyLangUI(getLang());
