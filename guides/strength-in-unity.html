<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Strength in Unity | BELAUG · FFXIV Library</title>
  <meta name="description" content="MSQ – Strength in Unity (ARR Patch 2.4)">
  <link rel="icon" href="../img/favicon.ico" />
  <style>
    :root { --bg:#fff8e6; --card:#fff; --fg:#222; --muted:#666; --border:#e5e1d8; --accent:#e11d48; }
    *{box-sizing:border-box}
    body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Inter,"Noto Sans TC","Noto Sans JP",Arial,sans-serif;background:var(--bg);color:var(--fg)}
    .container{max-width:1080px;margin:0 auto;padding:0 16px}
    .site-header{border-bottom:1px solid var(--border);background:#fff9edb3;backdrop-filter:saturate(120%) blur(6px);position:sticky;top:0;z-index:10}
    .nav{display:flex;align-items:center;justify-content:space-between;height:60px}
    .left{display:flex;align-items:center;gap:12px}
    .home{border:1px solid var(--border);background:#fff;padding:4px 8px;border-radius:8px;text-decoration:none;color:var(--fg);font-weight:800}
    .home:hover{background:#fffef8}
    .right{display:flex;align-items:center;gap:8px}
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
    .stack .row{padding:12px 14px;border:1px dashed var(--border);border-radius:12px;background:#fffdf6}
    .row b{display:inline-block;min-width:130px}
    .muted{color:var(--muted)}
    .link{color:#0b60d8;text-decoration:none}
    .link:hover{text-decoration:underline}
    .clamp{position:relative; max-height:360px; overflow:hidden}
    .clamp[data-collapsed="false"]{max-height:none}
    .clamp[data-collapsed="true"]::after{
      content:""; position:absolute; left:0; right:0; bottom:0; height:72px;
      background:linear-gradient(to bottom, rgba(255,255,255,0), var(--card)); pointer-events:none;
    }
    .expand-wrap{ margin-top:12px; }
    .expand-btn{
      display:inline-block; padding:8px 14px; border-radius:10px;
      background:var(--card); border:1px solid var(--border); cursor:pointer; font-weight:600;
    }
    .expand-btn:hover{ background:#fffef8; }
  </style>
</head>
<body>
  <header class="site-header">
    <nav class="container nav">
      <div class="left">
        <a class="home" href="../index.html">🏠 Home</a>
      </div>
      <div class="right">
        <button id="langToggle" class="icon-btn" aria-label="切換語言">🌐 EN</button>
      </div>
    </nav>
  </header>

  <main class="container main">
    <div class="grid">
      <section class="card video-card">
        <div class="bd">
          <div class="video-wrap">
            <iframe id="ytFrame" src="https://www.youtube.com/embed/QKIqWhcdSwU"
              title="Strength in Unity" allowfullscreen></iframe>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="hd" id="pageTitle">Strength in Unity</div>
        <div class="tabs" role="tablist">
          <button class="tab-btn" role="tab" aria-selected="true"  data-tab="story">Story</button>
          <button class="tab-btn" role="tab" aria-selected="false" data-tab="acq">Acquisition</button>
          <button class="tab-btn" role="tab" aria-selected="false" data-tab="unlockq">Unlock Quest</button>
          <button class="tab-btn" role="tab" aria-selected="false" data-tab="followq">Follow-Up Quest</button>
          <button class="tab-btn" role="tab" aria-selected="false" data-tab="comments">Comments</button>
        </div>
        <div class="bd">
          <div id="panel-story"    class="tab-panel active"></div>
          <div id="panel-acq"      class="tab-panel"></div>
          <div id="panel-unlockq"  class="tab-panel"></div>
          <div id="panel-followq"  class="tab-panel"></div>
          <div id="panel-comments" class="tab-panel">
            <div id="giscus_container" style="min-height:320px;"></div>
          </div>
        </div>
      </section>
    </div>
  </main>

<script>
const LANG_KEY = 'ffxiv-guide-lang';
const i18n = {
  EN:{
    langLabel:'EN',
    pageTitle:`Strength in Unity`,
    tabs:{ story:'Story', acq:'Acquisition', unlockq:'Unlock Quest', followq:'Follow-Up Quest', comments:'Comments' },
    readMore:'Show more', readLess:'Show less',
    story:`<div class="clamp" data-collapsed="true"><p>Haurchefant’s voice turns grave. Heretics and Dravanians have always been familiar foes, yet what you face now feels like something beyond imagination. Yaelle answers with House Fortemps’ pride—heretics may grow bolder by the day, but they will not cower behind their walls.</p><p>Alphinaud admits that the repeated caravan attacks first seemed like little more than a nuisance. The heretics were a problem, certainly, but a minor one—until the true purpose behind the raids became clear. Now, he says, they have his full attention. He will inform Minfilia at once, then summon a unit of the Crystal Braves to assist. As for you, he asks you to meet him at Whitebrim Front.</p><p>Since the incident at Snowcloak, House Durendaire has redoubled reconnaissance across the region. Alphinaud hopes their knights have information that will pinpoint where the heretics are hiding—and with a mutual enemy, Lord Drillemont should be willing to cooperate. You set out for Whitebrim Front as planned.</p><p>When you arrive, Alphinaud tells you his men are already beginning to gather—Captain Ilberd keeps a few Braves ready for emergencies. Aymeric, however, looks troubled; if Alphinaud’s assessment is correct, Iceheart now threatens Ishgard at large. Nearby, a Temple Knight demands an answer to the same question you cannot ignore: how do these heretics move so quickly? Without knowing that, every attempt to apprehend them may be doomed to fail.</p><p>Lord Drillemont receives you without hesitation. He says the Scions of the Seventh Dawn are more than welcome to join the hunt for Iceheart—and given the report he has just received, your timing could not be better. A band of pilgrims was seen transporting a large number of crates to the west, their garb matching the surviving squire’s description. Yet the scouts lost their trail at Snowcloak—the very frozen wall you had already suspected might conceal the heretics’ hideaway. The disappearance of these “pilgrims” and their provisions, he says, all but confirms your suspicions.</p><p>Aymeric decides he has heard enough and orders his knights to join the hunt. Alphinaud adds that he has already summoned a unit of the Crystal Braves to Whitebrim Front—this is too grave for half measures, and every available resource must be used. Aymeric agrees that these are extraordinary circumstances and that coordination is in everyone’s best interest. Alphinaud says that was his intent from the start: the combined forces of the Crystal Braves and the Temple Knights will not let Iceheart evade them for long—though he warns you that a wise man does not stake everything on a single approach. There may yet be subtler means to locate the lair, and he looks to Lord Drillemont as if expecting an idea.</p><p>Far away at Snowcloak, an heretic mage speaks in hushed satisfaction. Everything has been accounted for, he tells his lady, and if there is anything else she would have them do, they need only speak—and it shall be done.</p></div><div class="expand-wrap"><button class="expand-btn" data-role="expand"></button></div>`,
    acq:`<div class="stack"><div class="row"><b>Quest Giver</b> Alphinaud <small class="muted">(Coerthas Central Highlands, X:26.7, Y:17.0)</small></div></div>`,
    unlockq:`<div class="stack"><div class="row"><a class="link" href="the-intercession-of-saints.html">The Intercession of Saints</a></div><div class="row">All classes and jobs (excluding limited jobs) (Level 50 or above)</div></div>`,
    followq:`<div class="stack"><div class="row"><a class="link" href="dark-words-dark-deeds.html">Dark Words, Dark Deeds</a></div></div>`
  },
  JP:{
    langLabel:'JP',
    pageTitle:'極寒の共同作戦',
    tabs:{ story:'ストーリー', acq:'入手方法', unlockq:'開放クエスト', followq:'後続クエスト', comments:'コメント' },
    readMore:'全文を表示', readLess:'折りたたむ',
    story:`<div class="clamp" data-collapsed="true"><p>オルシュファンは険しい表情で言う。異端者もドラヴァニア勢も、これまで何度も相対してきた敵だ。だが今起きていることは、そんな既知の脅威を越えているように思える。ヤエルはフォルタン家の矜持を示し、異端者がいかに増長しようとも、壁の内で怯えはしないと言い切る。</p><p>アルフィノは、荷馬車への襲撃を当初は「厄介な小競り合い」程度に見ていたと認める。異端者は確かに問題だったが、まだ小さい――襲撃の目的を見抜くまでは。いまや彼らは、アルフィノの注意を独占している。彼はまずミンフィリアへ事態を伝え、続いてクリスタルブレイブの部隊を招集して支援に当たらせるという。そしてあなたには、ホワイトブリム前哨地で合流してほしいと告げる。</p><p>スノークロークでの一件以来、デュランデール家の騎士たちは地域の偵察をさらに強化している。アルフィノは、異端者の潜伏先を突き止める手がかりを彼らが握っていることを期待していた。共通の敵を抱える以上、ドリルモント卿も協力を惜しまないはずだ。あなたは予定どおりホワイトブリム前哨地へ向かう。</p><p>到着すると、アルフィノはすでに部下が集まり始めていると言う。イルベルド大尉は緊急時に備え、常に数名の隊員を待機させているのだ。だがアイメリクは深刻な顔つきで、もしアルフィノの見立てが正しければ、アイスハートはイシュガルド全体への脅威になり得ると指摘する。傍らの聖堂騎士は苛立ちを隠さず、異端者がどうやってあれほど素早く移動できるのか突き止めねば、捕縛の試みはすべて失敗に終わると言う。</p><p>ドリルモント卿はあなたたちを迎え、暁の血盟がアイスハート討伐に加勢するのは大歓迎だと言う。しかも、たった今届いた報告を踏まえると、そのタイミングはこれ以上ないほど良い。西へ向かう多数の木箱を運ぶ「巡礼者」の一団が目撃され、その装束は襲撃を生き延びた従騎士の証言と一致した。だが斥候はスノークロークで追跡を失った――異端者の隠れ家を覆う凍てついた壁ではないかと、かねて疑っていた場所である。その「巡礼者」と物資がそこで姿を消したことは、疑念をほとんど確信へ変える、と。</p><p>アイメリクは聞くに堪えたと言い、聖堂騎士団も狩りに加わると決める。アルフィノもまた、事の重大さを踏まえてホワイトブリム前哨地へクリスタルブレイブの部隊を呼び寄せていた。使える戦力はすべて投入すべきだという判断だ。アイメリクは異例の状況だからこそ連携が最善だと応じ、アルフィノはそれこそが当初からの狙いだと言う。クリスタルブレイブと聖堂騎士団の合同戦力から、アイスハートが長く逃れられるはずはない――ただし、賢い者は一つの手段にすべてを賭けない。異端者の巣を突き止めるには、より巧妙な道もあるかもしれない。アルフィノはドリルモント卿に、何か案がないかと視線を向ける。</p><p>そのころスノークロークでは、異端の魔道士が低い声で報告していた。すべては滞りなく整った、我が君、と。ほかに命じることがあれば言ってほしい――必ず成し遂げる、と。</p></div><div class="expand-wrap"><button class="expand-btn" data-role="expand"></button></div>`,
    acq:`<div class="stack"><div class="row"><b>クエスト発行</b> アルフィノ <small class="muted">（クルザス中央高地, X:26.7, Y:17.0）</small></div></div>`,
    unlockq:`<div class="stack"><div class="row"><a class="link" href="the-intercession-of-saints.html">目撃者の証言</a></div><div class="row">すべて（リミテッドジョブを除く）Lv 50～</div></div>`,
    followq:`<div class="stack"><div class="row"><a class="link" href="dark-words-dark-deeds.html">疑惑の騎兵を追え</a></div></div>`
  },
  ZH:{
    langLabel:'ZH',
    pageTitle:'冰原聯合作戰',
    tabs:{ story:'故事概要', acq:'取得方式', unlockq:'解鎖任務', followq:'後續任務', comments:'留言' },
    readMore:'展開全文', readLess:'收合內容',
    story:`<div class="clamp" data-collapsed="true"><p>Haurchefant 的語氣沉了下來。他說，異端者也好、Dravanians 也好，都是你們早已熟悉的敵人；但這一次，事情卻像是走到了更難想像的地步。Yaelle 也毫不退讓，說異端者就算再怎麼變本加厲，House Fortemps 也不會縮在城牆後面發抖。</p><p>Alphinaud 承認，起初那些針對車隊的襲擊在他眼裡只是麻煩事——異端者確實是問題，但還算是「小問題」。直到他看清楚對方襲擊的真正目的，情況才完全不同；如今，那些人已經奪走他全部的注意力。他說自己會先把狀況告知 Minfilia，接著召集一支 Crystal Braves 的小隊來支援；而你則要與他在 Whitebrim Front 會合。</p><p>自從 Snowcloak 那起事件之後，House Durendaire 的騎士在這一帶的偵察變得更頻繁、更徹底。Alphinaud 希望他們手上握有線索，能幫你們精準鎖定異端者的藏身處；畢竟敵人一致，Lord Drillemont 理應願意配合。你照著 Alphinaud 的安排前往 Whitebrim Front。</p><p>你一到，Alphinaud 便告訴你：他的人已經開始抵達了——Captain Ilberd 總會留幾名 Crystal Braves 待命，以防緊急狀況。Aymeric 的神情卻很凝重，他說如果 Alphinaud 的判斷沒錯，那 Iceheart 現在已經成了整個 Ishgard 都無法忽視的威脅。旁邊那名寡言的 Temple Knight 也追問關鍵：異端者到底用什麼方式才能移動得這麼快？若不弄清楚，你們每一次想抓人，都只會注定失敗。</p><p>Lord Drillemont 見到你們後直截了當地表示：Scions of the Seventh Dawn 願意加入追捕 Iceheart，他非常歡迎；更何況依照他剛收到的回報，你們來得正是時候。他說有人目擊一群朝聖者把大量貨箱往西運送，裝束與那名倖存從騎的描述一致；可偵察隊在 Snowcloak 失去了他們的行蹤——也正是你們先前推測可能掩藏異端者據點的那道冰封屏障。那群「朝聖者」連同物資在那裡消失，幾乎等於替你們的懷疑蓋下了定論。</p><p>Aymeric 表示他已經聽夠了，Temple Knights 也會加入追捕。Alphinaud 則補上一句：他已經自作主張把一支 Crystal Braves 小隊召到 Whitebrim Front，畢竟事態嚴重，任何能用的資源都得動起來。Aymeric 同意這是非常時期，更應該協調行動；Alphinaud 說這正是他從一開始的打算——Crystal Braves 與 Temple Knights 聯手，Iceheart 不可能逃太久。不過他也提醒你：聰明的人不會把所有賭注都壓在單一辦法上，或許還有更隱密、更巧妙的路可以找到異端者的巢穴；他隨即把話鋒帶回 Lord Drillemont，像是在等他提出另一個方向。</p><p>而在 Snowcloak 的另一頭，一名異端法師低聲向「我的主人」回報：一切都已清點完畢、準備就緒。若還有任何吩咐，只要開口，他們都會照做。</p></div><div class="expand-wrap"><button class="expand-btn" data-role="expand"></button></div>`,
    acq:`<div class="stack"><div class="row"><b>Quest Giver</b> 阿爾菲諾 <small class="muted">(庫爾札斯中央高地, X:26.7, Y:17.0)</small></div></div>`,
    unlockq:`<div class="stack"><div class="row"><a class="link" href="the-intercession-of-saints.html">目擊者出面作證</a></div><div class="row">所有職業（不含限定職） 等級 50 以上</div></div>`,
    followq:`<div class="stack"><div class="row"><a class="link" href="dark-words-dark-deeds.html">追查可疑的騎兵</a></div></div>`
  }
};

const langToggle  = document.getElementById('langToggle');
const pageTitle   = document.getElementById('pageTitle');
const tabBtns     = [...document.querySelectorAll('.tab-btn')];
const panels = {
  story:  document.getElementById('panel-story'),
  acq:    document.getElementById('panel-acq'),
  unlockq:document.getElementById('panel-unlockq'),
  followq:document.getElementById('panel-followq'),
  comments: document.getElementById('panel-comments')
};

function getLang(){ return localStorage.getItem(LANG_KEY) || 'EN'; }
function applyLang(lang){
  const t = i18n[lang] || i18n.EN;
  pageTitle.textContent = t.pageTitle.replace(/&#39;/g,"'");
  langToggle.textContent = `🌐 ${t.langLabel}`;
  tabBtns.forEach(btn => { btn.textContent = t.tabs[btn.dataset.tab]; });
  const activeBtn = tabBtns.find(b => b.getAttribute('aria-selected')==='true') || tabBtns[0];
  renderPanel(activeBtn.dataset.tab, lang);
}

function wireClamp(panelEl, t){
  const clamp = panelEl.querySelector('.clamp');
  const btn = panelEl.querySelector('[data-role="expand"]');
  if(!clamp || !btn) return;
  function setLabel(){
    const collapsed = clamp.getAttribute('data-collapsed') !== 'false';
    btn.textContent = collapsed ? t.readMore : t.readLess;
  }
  setLabel();
  btn.addEventListener('click', ()=>{
    const collapsed = clamp.getAttribute('data-collapsed') !== 'false';
    clamp.setAttribute('data-collapsed', collapsed ? 'false' : 'true');
    setLabel();
  });
}

function renderPanel(key, lang){
  const t = i18n[lang] || i18n.EN;
  Object.keys(panels).forEach(k => panels[k].classList.remove('active'));
  panels[key].classList.add('active');
  if (key !== 'comments') panels[key].innerHTML = t[key];
  if (key === 'story') wireClamp(panels[key], t);
  if (key === 'comments') loadGiscusForCurrentLang();
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

applyLang(getLang());

const GISCUS_CFG = {
      repo: 'BELAUG-FFXIV/FFXIV_Library',
      repoId: 'R_kgDOPyh4Kw',
      category: 'General',
      categoryId: 'DIC_kwDOPyh4K84CwPjL',
      theme: 'preferred_color_scheme'
};
function uiLang(code){ return code==='JP' ? 'ja' : (code==='ZH' ? 'zh-TW' : 'en'); }
function loadGiscusForCurrentLang(){
  const mount = document.getElementById('giscus_container');
  if (!mount) return;
  mount.innerHTML = '';
  const langCode = getLang();
  const s = document.createElement('script');
  s.src = 'https://giscus.app/client.js';
  s.setAttribute('data-repo', GISCUS_CFG.repo);
  s.setAttribute('data-repo-id', GISCUS_CFG.repoId);
  s.setAttribute('data-category', GISCUS_CFG.category);
  s.setAttribute('data-category-id', GISCUS_CFG.categoryId);
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
</script>
</body>
</html>
