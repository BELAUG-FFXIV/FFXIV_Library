/* =========================
   狀態 & DOM
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
  sort: 'newest',
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

/* =========================
   Featured
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
   Theme
   ========================= */
const THEME_KEY = 'ffxiv-lib-theme';
function applyTheme(mode){
  if(mode === 'dark'){
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
  }else{
    document.documentElement.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
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
    state.data = (json.items || []).map((it, idx) => deriveFields(it, idx));
    applyFilters();
    renderFeatured();
  })
  .catch(err => {
    grid.innerHTML = `<p>載入資料失敗：${err?.message || err}</p>`;
  });

function deriveFields(it, idx){
  const patchNum = parseFloat((it.patch || '0').replace(/[^\d.]/g,'') || 0);
  const dateNum  = it.date ? +new Date(it.date) : 0;
  return {...it, _patchNum: patchNum, _dateNum: dateNum, _addedIndex: idx};
}

/* =========================
   篩選 & 排序
   ========================= */
function applyFilters(){
  const qstr = state.query.trim().toLowerCase();

  let arr = state.data.filter(it => {
    const byCat  = state.category ? it.category === state.category : true;
    const byExp  = state.expac ? it.expac === state.expac : true;

    // Patch 篩選
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

  // 排序
  switch(state.sort){
    case 'newest':
      arr.sort((a,b)=> b._patchNum - a._patchNum);
      break;
    case 'oldest':
      arr.sort((a,b)=> a._patchNum - b._patchNum);
      break;
    case 'titleAZ':
      arr.sort((a,b)=>(a.title?.EN||'').localeCompare(b.title?.EN||''));
      break;
    case 'titleZA':
      arr.sort((a,b)=>(b.title?.EN||'').localeCompare(a.title?.EN||''));
      break;
    case 'added':
      arr.sort((a,b)=>{
        const aKey = a._dateNum || a._addedIndex;
        const bKey = b._dateNum || b._addedIndex;
        return bKey - aKey;
      });
      break;
  }

  state.filtered = arr;
  state.page = 1;
  render();
}

/* =========================
   Render
   ========================= */
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

  // ▶ 播放按鈕
  grid.querySelectorAll('[data-play]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const ytId  = btn.dataset.play;
      const title = btn.dataset.title;
      openPlayer(ytId, title);
    });
  });

  // Tag
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
   卡片
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
      </div>
      <div class="tags" style="margin-top:8px">${tags}</div>
    </div>
  </article>`;
}

/* =========================
   Featured
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
   Modal (dialog)
   ========================= */
const modal      = document.getElementById('playerModal');
const modalTitle = document.getElementById('modalTitle');
const ytFrame    = document.getElementById('ytFrame');

document.getElementById('modalClose')?.addEventListener('click', closePlayer);

function openPlayer(ytId, title){
  if (modalTitle) modalTitle.textContent = title || '播放中…';
  if (ytFrame) ytFrame.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
  modal?.showModal();
}
function closePlayer(){
  if (ytFrame) ytFrame.src = '';
  modal?.close();
}

/* =========================
   Tag
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
   事件
   ========================= */
q?.addEventListener('input', e => { state.query = e.target.value; applyFilters(); });
categorySel?.addEventListener('change', e => { state.category = e.target.value; applyFilters(); });
expacSel?.addEventListener('change', e => { state.expac = e.target.value; applyFilters(); });
patchSel?.addEventListener('change', e => { state.patch = e.target.value; applyFilters(); });
sortSel?.addEventListener('change', e => { state.sort = e.target.value; applyFilters(); });

clearBtnEl?.addEventListener('click', () => {
  state.query=''; state.category=''; state.expac=''; state.patch='';
  state.tags=[];
  if(q) q.value=''; if(categorySel) categorySel.value='';
  if(expacSel) expacSel.value=''; if(patchSel) patchSel.value='';
  if(sortSel) sortSel.value='newest';
  state.sort='newest';
  applyFilters();
});

/* =========================
   語言
   ========================= */
const LANG_KEY = 'ffxiv-lib-lang';
const clearI18N = {
  EN: 'Clear filters',
  JP: '条件をクリア',
  ZH: '清除條件'
};
function getLang(){ return localStorage.getItem(LANG_KEY) || 'EN'; }
function cycleLang(){
  const cur = getLang();
  const next = cur === 'EN' ? 'JP' : (cur === 'JP' ? 'ZH' : 'EN');
  localStorage.setItem(LANG_KEY, next);
  applyLangUI(next); renderFeatured(); render();
}
function applyLangUI(lang){
  if(clearBtnEl) clearBtnEl.textContent = clearI18N[lang] || 'Clear filters';
}
langToggle?.addEventListener('click', cycleLang);
applyLangUI(getLang());
