const state = {
  data: [], filtered: [], page: 1, perPage: 12, tags: [],
  query: '', category: '', expac: '', patch: '', sort: 'latest',
};
const grid = document.getElementById('grid');
const pager = document.getElementById('pager');
const resultCount = document.getElementById('resultCount');
const q = document.getElementById('q');
const category = document.getElementById('category');
/* === 推薦影片設定 === */
const featuredVideo = {
  ytId: "dQw4w9WgXcQ", // ⭐ 改成你要推薦的影片 ID
  title: {
    EN: "⭐ Featured: A New Dawn",
    JP: "⭐ おすすめ：新たな夜明け",
    ZH: "⭐ 推薦影片：新的黎明"
  }
};
const expac = document.getElementById('expac');
const patch = document.getElementById('patch');
const clearBtn = document.getElementById('clear');
const sortSel = document.getElementById('sort');
const activeTags = document.getElementById('activeTags');
const themeToggle = document.getElementById('themeToggle');
document.getElementById('year').textContent = new Date().getFullYear();

const THEME_KEY = 'ffxiv-lib-theme';

// === Theme toggle (light / dark) ===
function applyTheme(mode){
  if(mode === 'dark'){
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.textContent = '☀️'; // 深色 → 顯示太陽
  }else{
    document.documentElement.removeAttribute('data-theme'); // 預設 light
    if (themeToggle) themeToggle.textContent = '🌙'; // 淺色 → 顯示月亮
  }
}

// 初始化：讀 localStorage，預設 light
applyTheme(localStorage.getItem(THEME_KEY) || 'light');

// 點擊切換
themeToggle?.addEventListener('click', ()=>{
  const cur = localStorage.getItem(THEME_KEY) || 'light';
  const next = cur === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

fetch('data/library.json')
  .then(r => r.json())
  .then(json => { state.data = json.items.map(deriveFields); applyFilters(); })
  .catch(err => { grid.innerHTML = `<p>載入資料失敗：${err?.message || err}</p>`; });

function deriveFields(it){
  const patchNum = parseFloat((it.patch || '0').replace(/[^\d.]/g,'') || 0);
  const dateNum = it.date ? +new Date(it.date) : 0;
  return {...it, _patchNum: patchNum, _dateNum: dateNum};
}

function applyFilters(){
  const qstr = state.query.trim().toLowerCase();
  let arr = state.data.filter(it => {
    const byCat = state.category ? it.category === state.category : true;
    const byExp = state.expac ? it.expac === state.expac : true;
    const byPatch = state.patch ? (it.patch || '').startsWith(state.patch) : true;
    const byTags = state.tags.length ? state.tags.every(t => it.tags?.includes(t)) : true;
    const byQuery = qstr ? [
      it.title?.en, it.title?.jp, it.title?.zh,
      it.series, it.category, it.expac, it.patch, ...(it.tags||[])
    ].filter(Boolean).join(' ').toLowerCase().includes(qstr) : true;
    return byCat && byExp && byPatch && byTags && byQuery;
  });
  arr.sort((a,b)=>{
    if(state.sort === 'latest') return b._dateNum - a._dateNum;
    if(state.sort === 'title') return (a.title?.en || '').localeCompare(b.title?.en || '');
    if(state.sort === 'patch') return b._patchNum - a._patchNum;
    return 0;
  });
  state.filtered = arr; state.page = 1; render();
}

function render(){
  resultCount.textContent = state.filtered.length;
  const start = (state.page - 1) * state.perPage;
  const view = state.filtered.slice(start, start + state.perPage);
  grid.innerHTML = view.map(cardHTML).join('') || `<p>沒有符合的內容。</p>`;
  const pages = Math.ceil(state.filtered.length / state.perPage);
  pager.innerHTML = pages > 1 ? Array.from({length: pages}, (_,i)=>{
    const p = i+1; return `<button class="pagebtn ${p===state.page?'active':''}" data-page="${p}">${p}</button>`;
  }).join('') : '';
  grid.querySelectorAll('[data-play]').forEach(btn=>{
    btn.addEventListener('click', ()=> openPlayer(btn.dataset.play, btn.dataset.title));
  });
  grid.querySelectorAll('[data-tag]').forEach(t=> t.addEventListener('click', ()=> addTag(t.dataset.tag)));
  pager.querySelectorAll('[data-page]').forEach(b=> b.addEventListener('click', ()=>{ state.page = +b.dataset.page; render(); }));
  renderActiveTags();
}

function cardHTML(it){
  const thumb = it.thumb || `https://i.ytimg.com/vi/${it.ytId}/hqdefault.jpg`;
  const title = it.title?.en || it.title?.jp || it.title?.zh || 'Untitled';

  const metaL = [
    it.expac && `<span class="badge">${it.expac}</span>`,
    it.patch && `<span class="badge">${it.patch}</span>`,
    it.category && `<span class="badge">${it.category}</span>`,
  ].filter(Boolean).join('');

  const tags = (it.tags||[]).slice(0,6).map(t => `<span class="tag" data-tag="${t}">#${t}</span>`).join('');

  // --- 新：三顆按鈕（Play / Playlist / YouTube-icon） ---
  const safe = s => (s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  const playBtn = it.ytId
    ? `<button class="btn play" data-play="${it.ytId}" data-title="${safe(title)}">Play</button>`
    : '';

  const playlistBtn = it.playlistUrl
    ? `<a class="btn ghost" href="${it.playlistUrl}" target="_blank" rel="noopener">Playlist</a>`
    : '';

  const youtubeBtn = it.videoUrl
    ? `<a class="btn ghost yt-only" href="${it.videoUrl}" target="_blank" rel="noopener" aria-label="YouTube">
         <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" class="yt-icon">
           <path d="M23.5 6.2s-.2-1.7-.8-2.5c-.8-.9-1.7-.9-2.1-1-3-.2-7.6-.2-7.6-.2h-.1s-4.6 0-7.6.2c-.4 0-1.3 0-2.1 1-.6.8-.8 2.5-.8 2.5S2 8.1 2 10v1.9c0 1.9.2 3.8.2 3.8s.2 1.7.8 2.5c.8.9 1.9.9 2.4 1 1.7.2 7.2.2 7.2.2s4.6 0 7.6-.2c.4 0 1.3 0 2.1-1 .6-.8.8-2.5.8-2.5s.2-1.9.2-3.8V10c0-1.9-.2-3.8-.2-3.8zM9.8 13.6V8.4l5.9 2.6-5.9 2.6z"/>
         </svg>
       </a>`
    : '';

  return `
  <article class="card">
    <img class="thumb" src="${thumb}" alt="${safe(title)}" loading="lazy">
    <div class="body">
      <h3 class="title">${safe(title)}</h3>
      <div class="meta">${metaL}</div>
      ${it.series ? `<div class="meta">系列：${safe(it.series)}</div>` : ''}
      <div class="actions">
        ${playBtn}
        ${playlistBtn}
        ${youtubeBtn}
      </div>
      <div class="tags" style="margin-top:8px">${tags}</div>
    </div>
  </article>`;
}

const modal = document.getElementById('playerModal');
const modalTitle = document.getElementById('modalTitle');
const ytFrame = document.getElementById('ytFrame');
document.getElementById('modalClose').addEventListener('click', closePlayer);
modal.addEventListener('close', ()=>{ ytFrame.src=''; });
function openPlayer(ytId, title){
  modalTitle.textContent = title || '播放中…';
  ytFrame.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
  modal.showModal();
}
function closePlayer(){ modal.close(); }

function addTag(tag){ if(!state.tags.includes(tag)){ state.tags.push(tag); applyFilters(); } }
function removeTag(tag){ state.tags = state.tags.filter(t => t !== tag); applyFilters(); }
function renderActiveTags(){
  activeTags.innerHTML = state.tags.map(t => `<span class="tag">#${t}<span class="x" data-rm="${t}">×</span></span>`).join('');
  activeTags.querySelectorAll('[data-rm]').forEach(x => x.addEventListener('click', ()=>removeTag(x.dataset.rm)));
}

q.addEventListener('input', e => { state.query = e.target.value; applyFilters(); });
category.addEventListener('change', e => { state.category = e.target.value; applyFilters(); });
expac.addEventListener('change', e => { state.expac = e.target.value; applyFilters(); });
patch.addEventListener('change', e => { state.patch = e.target.value; applyFilters(); });
sortSel.addEventListener('change', e => { state.sort = e.target.value; applyFilters(); });
clearBtn.addEventListener('click', () => {
  state.query=''; state.category=''; state.expac=''; state.patch=''; state.tags=[]; state.sort='latest';
  q.value=''; category.value=''; expac.value=''; patch.value=''; sortSel.value='latest';
  applyFilters();
});

/* =========================
   I18N + LANGUAGE SWITCH
   ========================= */

const LANG_KEY = 'ffxiv-lib-lang';
const langToggle = document.getElementById('langToggle');
const taglineEl   = document.getElementById('tagline');     // 若沒有可忽略
const searchEl    = document.getElementById('q');
const sortLabelEl = document.querySelector('.toolbar label');
const itemsSuffixEl = document.getElementById('itemsSuffix'); // 若沒有可忽略
const categorySel = document.getElementById('category');
const expacSel    = document.getElementById('expac');

/** 三語資料（含：分類 & 資料片） **/
const i18n = {
  EN: {
    langLabel: 'EN',
    tagline: 'Organized by series: Main Story, Raids, BGM, Jobs/Events, Tools & Collections. Supports search, tags, and quick play.',
    searchPH: 'Search title, series, tags, chapter…',
    sort: 'Sort:',
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
    ]
  },

  JP: {
    langLabel: 'JP',
    tagline: 'シリーズ別に整理：メインストーリー、レイド、BGM、ジョブ/イベント、ツール＆コレクション。検索・タグ・クイック再生に対応。',
    searchPH: 'タイトル・シリーズ・タグ・章… を検索',
    sort: '並び替え：',
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
    ]
  },

  ZH: {
    langLabel: 'ZH',
    tagline: '以系列為主軸整理：主線、團本、BGM、職業/活動、工具與蒐集。支援搜尋、標籤與快速播放。',
    searchPH: '搜尋標題、系列、標籤、章節…',
    sort: '排序：',
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
      { value: 'SideFeature',    label: '支線 / 解除任務' },
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
      { value: 'ARR', label: '重生之境' },
      { value: 'HW',  label: '蒼天之伊修加德' },
      { value: 'SB',  label: '紅蓮之解放者' },
      { value: 'SHB', label: '漆黑的反叛者' },
      { value: 'EW',  label: '曉月之終途' },
      { value: 'DT',  label: '黃金的遺產' },
    ]
  }
};

/** 將陣列注入 <select>，並盡量保留舊值 **/
function refillSelect(selectEl, options, keepValue=true) {
  if (!selectEl) return;
  const prev = keepValue ? selectEl.value : '';
  selectEl.innerHTML = options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
  // 若舊值仍存在就還原；不在則回到第一個（通常是「全部…」）
  const exists = options.some(o => String(o.value) === String(prev));
  selectEl.value = exists ? prev : options[0]?.value ?? '';
}

/** 套用語言到 UI **/
function applyLangUI(lang) {
  const dict = i18n[lang];
  if (!dict) return;

  // 🌐 按鈕
  if (langToggle) langToggle.textContent = `🌐 ${dict.langLabel}`;

  // 文案
  if (taglineEl)   taglineEl.textContent = dict.tagline;
  if (searchEl)    searchEl.placeholder  = dict.searchPH;
  if (sortLabelEl) sortLabelEl.textContent = dict.sort;
  if (itemsSuffixEl && dict.itemsSuffix) itemsSuffixEl.textContent = ` ${dict.itemsSuffix}`;

  // 下拉：分類 & 資料片
  refillSelect(categorySel, dict.categories, true);
  refillSelect(expacSel,    dict.expansions, true);
}

/** 語言切換：EN → JP → ZH → EN **/
function cycleLang() {
  const cur = localStorage.getItem(LANG_KEY) || 'EN';
  const next = cur === 'EN' ? 'JP' : cur === 'JP' ? 'ZH' : 'EN';
  localStorage.setItem(LANG_KEY, next);
  applyLangUI(next);
  // 如果你的篩選是即時的，這裡可觸發一次重新渲染：
  // applyFilters?.();
}

// 綁定按鈕
langToggle?.addEventListener('click', cycleLang);

// 初始化
const BOOT_LANG = localStorage.getItem(LANG_KEY) || 'EN';
applyLangUI(BOOT_LANG);
