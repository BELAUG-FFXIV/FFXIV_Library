const state = {
  data: [], filtered: [], page: 1, perPage: 12, tags: [],
  query: '', category: '', expac: '', patch: '', sort: 'latest',
};
const grid = document.getElementById('grid');
const pager = document.getElementById('pager');
const resultCount = document.getElementById('resultCount');
const q = document.getElementById('q');
const category = document.getElementById('category');
const expac = document.getElementById('expac');
const patch = document.getElementById('patch');
const clearBtn = document.getElementById('clear');
const sortSel = document.getElementById('sort');
const activeTags = document.getElementById('activeTags');
const themeToggle = document.getElementById('themeToggle');
document.getElementById('year').textContent = new Date().getFullYear();

const THEME_KEY = 'ffxiv-lib-theme';
function applyTheme(mode){ document.documentElement.style.colorScheme = mode || 'normal'; }
applyTheme(localStorage.getItem(THEME_KEY));
themeToggle.addEventListener('click',()=>{
  const cur = localStorage.getItem(THEME_KEY);
  const next = cur === 'dark' ? 'light' : cur === 'light' ? null : 'dark';
  if(next) localStorage.setItem(THEME_KEY, next); else localStorage.removeItem(THEME_KEY);
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
  const pLink = it.playlistUrl ? `<a class="btn ghost" href="${it.playlistUrl}" target="_blank" rel="noopener">播放清單</a>` : '';
  const vLink = it.videoUrl ? `<a class="btn ghost" href="${it.videoUrl}" target="_blank" rel="noopener">YouTube</a>` : '';
  const safe = s => (s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  return `
  <article class="card">
    <img class="thumb" src="${thumb}" alt="${safe(title)}" loading="lazy">
    <div class="body">
      <h3 class="title">${safe(title)}</h3>
      <div class="meta">${metaL}</div>
      ${it.series ? `<div class="meta">系列：${safe(it.series)}</div>` : ''}
      <div class="actions">
        ${it.ytId ? `<button class="btn play" data-play="${it.ytId}" data-title="${safe(title)}">▶ 播放</button>` : ''}
        ${pLink}${vLink}
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
