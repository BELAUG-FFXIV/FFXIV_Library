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
  sort: 'addedDesc', // 預設：新增順序（新 → 舊）
};

const grid         = document.getElementById('grid');
const pager        = document.getElementById('pager');
const resultCount  = document.getElementById('resultCount');
const q            = document.getElementById('q');
const categorySel  = document.getElementById('category');
const expacSel     = document.getElementById('expac');
const patchSel     = document.getElementById('patch');
const sortSel      = document.getElementById('sort');
const clearBtnEl   = document.getElementById('clear');
const activeTags   = document.getElementById('activeTags');
const themeToggle  = document.getElementById('themeToggle');
const langToggle   = document.getElementById('langToggle');
const subscribeCta = document.getElementById('subscribeCta');

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

function applyTheme(mode) {
  if (mode === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (themeToggle) themeToggle.textContent = '🌙';
  }
}
applyTheme(localStorage.getItem(THEME_KEY) || 'light');

themeToggle?.addEventListener('click', () => {
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
    state.data = (json.items || []).map((it, idx) => deriveFields({ ...it, _addedIndex: idx }));

    if (sortSel && sortSel.value) state.sort = sortSel.value;

    applyFilters();
    renderFeatured();

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  })
  .catch(err => {
    grid.innerHTML = `<p>載入資料失敗：${err?.message || err}</p>`;
  });

function deriveFields(it) {
  const patchNum = parseFloat((it.patch || '0').replace(/[^\d.]/g, '') || 0);
  const dateNum  = it.date ? +new Date(it.date) : 0;
  const addedIdx = Number.isFinite(it._addedIndex) ? it._addedIndex : 0;
  return { ...it, _patchNum: patchNum, _dateNum: dateNum, _addedIndex: addedIdx };
}

/* =========================
   篩選 / 排序 / 分頁
   ========================= */
function applyFilters() {
  const qstr = state.query.trim().toLowerCase();

  let arr = state.data.filter(it => {
    const byCat = state.category ? it.category === state.category : true;
    const byExp = state.expac ? it.expac === state.expac : true;

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
      it.series, it.category, it.expac, it.patch, ...(it.tags || [])
    ].filter(Boolean).join(' ').toLowerCase().includes(qstr) : true;

    const visible = !(it.hidden === true || it.publish === false);

    return byCat && byExp && byPatch && byTags && byQuery && visible;
  });

  switch (state.sort) {
    case 'addedAsc':
      arr.sort((a, b) => a._addedIndex - b._addedIndex);
      break;

    case 'addedDesc':
      arr.sort((a, b) => b._addedIndex - a._addedIndex);
      break;

    case 'dateAsc':
      arr.sort((a, b) => {
        const ad = a._dateNum || Number.POSITIVE_INFINITY;
        const bd = b._dateNum || Number.POSITIVE_INFINITY;
        return ad - bd || (a._addedIndex - b._addedIndex);
      });
      break;

    case 'dateDesc':
    default:
      arr.sort((a, b) => {
        const ad = a._dateNum || 0;
        const bd = b._dateNum || 0;
        return bd - ad || (b._addedIndex - a._addedIndex);
      });
      break;
  }

  state.filtered = arr;
  state.page = 1;
  render();
}

/* =========================
   Pagination helpers
   ========================= */
function getPagerDelta() {
  return window.matchMedia("(max-width: 520px)").matches ? 1 : 2;
}

function getPaginationItems(current, total, delta) {
  if (total <= 1) return [1];

  const items = [];
  const left  = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  items.push(1);

  if (left > 2) items.push("…");
  for (let i = left; i <= right; i++) items.push(i);
  if (right < total - 1) items.push("…");

  items.push(total);
  return items;
}

function renderPagerUI(totalPages) {
  pager.innerHTML = '';
  if (totalPages <= 1) return;

  const delta = getPagerDelta();

  const makeBtn = (label, page, { disabled = false, active = false, ellipsis = false, ariaLabel = '' } = {}) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `pagebtn${active ? ' active' : ''}${ellipsis ? ' ellipsis' : ''}`;
    b.textContent = label;
    if (ariaLabel) b.setAttribute('aria-label', ariaLabel);

    if (disabled || ellipsis) {
      b.disabled = true;
    } else {
      b.dataset.page = String(page);
      b.addEventListener('click', () => {
        state.page = page;
        render();
        grid?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    return b;
  };

  pager.appendChild(makeBtn('«', 1, { disabled: state.page === 1, ariaLabel: 'First page' }));
  pager.appendChild(makeBtn('‹', Math.max(1, state.page - 1), { disabled: state.page === 1, ariaLabel: 'Previous page' }));

  const items = getPaginationItems(state.page, totalPages, delta);
  for (const it of items) {
    if (it === "…") {
      pager.appendChild(makeBtn('…', 0, { ellipsis: true }));
    } else {
      pager.appendChild(makeBtn(String(it), it, { active: it === state.page }));
    }
  }

  pager.appendChild(makeBtn('›', Math.min(totalPages, state.page + 1), { disabled: state.page === totalPages, ariaLabel: 'Next page' }));
  pager.appendChild(makeBtn('»', totalPages, { disabled: state.page === totalPages, ariaLabel: 'Last page' }));
}

function render() {
  resultCount.textContent = state.filtered.length;

  const start = (state.page - 1) * state.perPage;
  const view  = state.filtered.slice(start, start + state.perPage);

  grid.innerHTML = view.map(cardHTML).join('') || `<p>沒有符合的內容。</p>`;

  const pages = Math.ceil(state.filtered.length / state.perPage);
  renderPagerUI(pages);

  grid.querySelectorAll('[data-play]').forEach(btn => {
    btn.addEventListener('click', () => {
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

  grid.querySelectorAll('[data-tag]').forEach(t =>
    t.addEventListener('click', () => addTag(t.dataset.tag))
  );

  renderActiveTags();
}

/* =========================
   卡片 HTML
   ========================= */
function cardHTML(it) {
  const thumb = it.thumb || `https://i.ytimg.com/vi/${it.ytId}/hqdefault.jpg`;
  const lang  = getLang();
  const safe = s => (s || '').replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
  const title = it.title?.[lang] || it.title?.EN || it.title?.JP || it.title?.ZH || 'Untitled';

  const metaL = [
    it.expac    && `<span class="badge">${it.expac}</span>`,
    it.patch    && `<span class="badge">${it.patch}</span>`,
    it.category && `<span class="badge">${it.category}</span>`,
  ].filter(Boolean).join('');

  const tags = (it.tags || []).slice(0, 6)
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
        ${detailBtn}
        ${playlistBtn}
        ${youtubeBtn}
      </div>
      <div class="tags" style="margin-top:8px">${tags}</div>
    </div>
  </article>`;
}

/* =========================
   推薦影片渲染
   ========================= */
function renderFeatured() {
  const box = document.getElementById('featured');
  if (!box || !featuredVideo) return;

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
modal?.addEventListener('close', () => { ytFrame.src = ''; });

function openPlayer(ytId, title) {
  if (modalTitle) modalTitle.textContent = title || '播放中…';
  if (ytFrame) ytFrame.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
  modal?.showModal();
}
function closePlayer() {
  modal?.close();
}

/* =========================
   Tag 操作
   ========================= */
function addTag(tag) {
  if (!state.tags.includes(tag)) {
    state.tags.push(tag);
    applyFilters();
  }
}
function removeTag(tag) {
  state.tags = state.tags.filter(t => t !== tag);
  applyFilters();
}
function renderActiveTags() {
  activeTags.innerHTML = state.tags
    .map(t => `<span class="tag">#${t}<span class="x" data-rm="${t}">×</span></span>`)
    .join('');

  activeTags.querySelectorAll('[data-rm]').forEach(x =>
    x.addEventListener('click', () => removeTag(x.dataset.rm))
  );
}

/* =========================
   事件綁定
   ========================= */
q?.addEventListener('input', e => {
  state.query = e.target.value;
  applyFilters();
});

categorySel?.addEventListener('change', e => {
  state.category = e.target.value;
  applyFilters();
});

expacSel?.addEventListener('change', e => {
  state.expac = e.target.value;
  applyFilters();
});

patchSel?.addEventListener('change', e => {
  state.patch = e.target.value;
  applyFilters();
});

sortSel?.addEventListener('change', e => {
  state.sort = e.target.value || 'addedDesc';
  applyFilters();
});

clearBtnEl?.addEventListener('click', () => {
  state.query = '';
  state.category = '';
  state.expac = '';
  state.patch = '';
  state.tags = [];
  state.sort = 'addedDesc';

  if (q) q.value = '';
  if (categorySel) categorySel.value = '';
  if (expacSel) expacSel.value = '';
  if (patchSel) patchSel.value = '';
  if (sortSel) sortSel.value = state.sort;

  applyFilters();
});

/* =========================
   I18N + LANGUAGE SWITCH
   ========================= */
const LANG_KEY = 'ffxiv-lib-lang';
const taglineEl     = document.getElementById('tagline');
const itemsSuffixEl = document.getElementById('itemsSuffix');

const i18n = {
  EN: {
    langLabel: 'EN',
    subscribeCta: '🔔 Subscribe',
    tagline: `<b>FFXIV Library</b> is an extension of my YouTube channel.<br>
Here you’ll find additional story details — quest records, background notes, and elements that couldn’t be fully shown in each video.<br>
Every entry also has a message board where you can share your thoughts and connect with fellow travelers.`,
    searchPH: 'Search title, series, tags, chapter…',
    itemsSuffix: 'items',
    sortOptions: [
      { value: 'addedDesc', label: 'Added order (New → Old)' },
      { value: 'addedAsc',  label: 'Added order (Old → New)' },
      { value: 'dateDesc',  label: 'Date: Newest' },
      { value: 'dateAsc',   label: 'Date: Oldest' },
    ],
    categories: [
      { value: '',               label: 'All Categories' },
      { value: 'MSQ',            label: 'Main Story (MSQ)' },
      { value: 'AllianceRaid24', label: 'Alliance Raid (24-player)' },
      { value: 'Raid8',          label: 'Raid (8-player)' },
      { value: 'Dungeon',        label: 'Dungeon' },
      { value: 'Trial',          label: 'Trial' },
      { value: 'JobQuests',      label: 'Job Quests' },
      { value: 'RoleQuests',     label: 'Role Quests' },
      { value: 'DoHDoL',         label: 'DoH & DoL Quests' },
      { value: 'AlliedSociety',  label: 'Allied Society Quests' },
      { value: 'SideFeature',    label: 'Side / Feature Quests' },
      { value: 'BlueMage',       label: 'Blue Mage' }, 
      { value: 'Hildibrand',     label: 'Hildibrand Adventures' },
      { value: 'Seasonal',       label: 'Seasonal / Special Events' },
      { value: 'GoldSaucer',     label: 'Gold Saucer' },
      { value: 'BGM',            label: 'BGM' },
      { value: 'TreasureHunt',   label: 'Treasure Hunt' }
      { value: 'CollMount',      label: 'Collection (Mount)' },
      { value: 'CollWeapon',     label: 'Collection (Weapon)' },
      { value: 'CollTool',       label: 'Collection (Crafting/Gathering Tools)' },
      { value: 'HighDiff',       label: 'High-difficulty Content' },
      { value: 'RelaxingBGM',    label: 'Relaxing Background Vibes' },
      { value: 'PVP',            label: 'PvP' },
    ],
    expansions: [
      { value: '',    label: 'All Expansions' },
      { value: 'ARR', label: 'A Realm Reborn (ARR)' },
      { value: 'HW',  label: 'Heavensward (HW)' },
      { value: 'SB',  label: 'Stormblood (SB)' },
      { value: 'SHB', label: 'Shadowbringers (SHB)' },
      { value: 'EW',  label: 'Endwalker (EW)' },
      { value: 'DT',  label: 'Dawntrail (DT)' },
    ],
    patches: [
      { value: '',    label: 'All Patches' },
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
    subscribeCta: '🔔 チャンネル登録',
    tagline: `<b>FFXIV Library</b> は、私の YouTube チャンネルを補完する資料館です。<br>
映像だけでは伝えきれない物語の細部──クエスト記録や背景設定などをここに収めています。<br>
各ページにはメッセージボードもあり、感じたことを旅人同士で共有できます。`,
    searchPH: 'タイトル・シリーズ・タグ・章… を検索',
    itemsSuffix: '件',
    sortOptions: [
      { value: 'addedDesc', label: '追加順（新 → 古）' },
      { value: 'addedAsc',  label: '追加順（古 → 新）' },
      { value: 'dateDesc',  label: '日付：新しい順' },
      { value: 'dateAsc',   label: '日付：古い順' },
    ],
    categories: [
      { value: '',               label: 'すべての分類' },
      { value: 'MSQ',            label: 'メインクエスト（MSQ）' },
      { value: 'AllianceRaid24', label: 'アライアンスレイド（24人）' },
      { value: 'Raid8',          label: 'レイド（8人）' },
      { value: 'Dungeon',        label: 'ダンジョン' },
      { value: 'Trial',          label: '討伐・討滅戦' },
      { value: 'JobQuests',      label: 'ジョブクエスト' },
      { value: 'RoleQuests',     label: 'ロールクエスト' },
      { value: 'DoHDoL',         label: 'クラフター・ギャザラークエスト' },
      { value: 'AlliedSociety',  label: '友好部族クエスト' },
      { value: 'SideFeature',    label: 'サブクエスト／コンテンツ開放' },
      { value: 'BlueMage',       label: '青魔道士' }, 
      { value: 'Hildibrand',     label: '事件屋ヒルディブランド' },
      { value: 'Seasonal',       label: 'シーズナル／スペシャルイベント' },
      { value: 'GoldSaucer',     label: 'ゴールドソーサー' },
      { value: 'BGM',            label: 'BGM' },
      { value: 'TreasureHunt',   label: 'トレジャーハント' }
      { value: 'CollMount',      label: 'コレクション（マウント）' },
      { value: 'CollWeapon',     label: 'コレクション（武器）' },
      { value: 'CollTool',       label: 'コレクション（クラフター／ギャザラーツール）' },
      { value: 'HighDiff',       label: '高難易度コンテンツ' },
      { value: 'RelaxingBGM',    label: 'リラックスBGM・風景' },
      { value: 'PVP',            label: 'PvP' },
    ],
    expansions: [
      { value: '',    label: 'すべての拡張' },
      { value: 'ARR', label: '新生エオルゼア（ARR）' },
      { value: 'HW',  label: '蒼天のイシュガルド（HW）' },
      { value: 'SB',  label: '紅蓮のリベレーター（SB）' },
      { value: 'SHB', label: '漆黒のヴィランズ（SHB）' },
      { value: 'EW',  label: '暁月のフィナーレ（EW）' },
      { value: 'DT',  label: '黄金のレガシー（DT）' },
    ],
    patches: [
      { value: '',    label: 'すべてのパッチ' },
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
    subscribeCta: '🔔 訂閱頻道',
    tagline: `<b>FFXIV Library</b> 是我 YouTube 頻道的延伸資料館。<br>
這裡收錄了更多在影片中無法完整呈現的內容──任務紀錄、背景資料與細節補充。<br>
每部影片下方也設有留言板，歡迎留下你的想法與感受，與其他旅人一同分享。`,
    searchPH: '搜尋標題、系列、標籤、章節…',
    itemsSuffix: '項內容',
    sortOptions: [
      { value: 'addedDesc', label: '新增順序（新 → 舊）' },
      { value: 'addedAsc',  label: '新增順序（舊 → 新）' },
      { value: 'dateDesc',  label: '日期：最新' },
      { value: 'dateAsc',   label: '日期：最舊' },
    ],
    categories: [
      { value: '',               label: '全部分類' },
      { value: 'MSQ',            label: '主線任務（MSQ）' },
      { value: 'AllianceRaid24', label: '聯盟副本（24人）' },
      { value: 'Raid8',          label: '團本（8人）' },
      { value: 'Dungeon',        label: '副本（Dungeon）' },
      { value: 'Trial',          label: '討伐戰（Trial）' },
      { value: 'JobQuests',      label: '職業任務（Job）' },
      { value: 'RoleQuests',     label: '角色任務（Role）' },
      { value: 'DoHDoL',         label: '生產／採集職任務' },
      { value: 'AlliedSociety',  label: '友好部族任務' },
      { value: 'SideFeature',    label: '支線／功能開放任務' },
      { value: 'BlueMage',       label: '青魔法' },
      { value: 'Hildibrand',     label: '希爾迪布蘭德奇譚' },
      { value: 'Seasonal',       label: '季節／特別活動' },
      { value: 'GoldSaucer',     label: '金碟遊樂場' },
      { value: 'BGM',            label: 'BGM' },
      { value: 'TreasureHunt',   label: '藏寶圖' }
      { value: 'CollMount',      label: '蒐集（坐騎）' },
      { value: 'CollWeapon',     label: '蒐集（武器）' },
      { value: 'CollTool',       label: '蒐集（製作／採集工具）' },
      { value: 'HighDiff',       label: '高難度內容' },
      { value: 'RelaxingBGM',    label: '放鬆背景音樂' },
      { value: 'PVP',            label: 'PVP' },
    ],
    expansions: [
      { value: '',    label: '全部資料片' },
      { value: 'ARR', label: '新生艾奧傑亞（ARR）' },
      { value: 'HW',  label: '蒼天伊修加爾德（HW）' },
      { value: 'SB',  label: '紅蓮解放者（SB）' },
      { value: 'SHB', label: '漆黑反叛者（SHB）' },
      { value: 'EW',  label: '曉月之終途（EW）' },
      { value: 'DT',  label: '黃金遺產（DT）' },
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

function refillSelect(selectEl, options, keepValue = true) {
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
  if (taglineEl) taglineEl.innerHTML = dict.tagline;
  if (q) q.placeholder = dict.searchPH;
  if (itemsSuffixEl && dict.itemsSuffix) itemsSuffixEl.textContent = ` ${dict.itemsSuffix}`;
  if (subscribeCta && dict.subscribeCta) subscribeCta.textContent = dict.subscribeCta;

  refillSelect(categorySel, dict.categories, true);
  refillSelect(expacSel, dict.expansions, true);
  refillSelect(patchSel, dict.patches, true);

  if (dict.sortOptions) refillSelect(sortSel, dict.sortOptions, true);

  if (sortSel && sortSel.value) state.sort = sortSel.value;
  if (clearBtnEl) clearBtnEl.textContent = dict.clear;
}

function getLang() {
  return localStorage.getItem(LANG_KEY) || 'EN';
}

function cycleLang() {
  const cur = getLang();
  const next = cur === 'EN' ? 'JP' : (cur === 'JP' ? 'ZH' : 'EN');
  localStorage.setItem(LANG_KEY, next);
  applyLangUI(next);
  renderFeatured();
  render();
}

langToggle?.addEventListener('click', cycleLang);
applyLangUI(getLang());

/* =========================
   視窗寬度變化時，重新渲染分頁
   ========================= */
window.addEventListener('resize', () => {
  const pages = Math.ceil(state.filtered.length / state.perPage);
  renderPagerUI(pages);
});
