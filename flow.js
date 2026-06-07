/* Mingle 友達タイプ診断 — 通しフロー制御
   設問・スコアリングは MINGLE_QUIZ_TYPES.md 準拠。
   window.MingleFlow.init(appEl) で起動。結果は MingleResult.build を再利用。 */
(function(){
  // 12問・6段階の対極スケール。axis: 軸 / 左(低スコア)=左文字, 右(高スコア)=右文字
  const Q = [
    {ax:"EI", s:"3人で初めて会う日。<br>待ち合わせ場所に着いたら、<br>1人は来ているけど、<br>もう1人はまだ来ていない。", l:"自然と話しかけて<br>場を盛り上げる", r:"来るまでスマホを<br>見て待っている"},
    {ax:"EI", s:"グループLINEが<br>しばらく沈黙している。", l:"話題を投げて<br>動かしたくなる", r:"誰かが送るのを<br>自然に待っている"},
    {ax:"EI", s:"3人で行くお店を<br>決めるとき。", l:"「ここどう？」と<br>候補を出している", r:"誰かの候補に<br>「いいね」と乗っている"},
    {ax:"AS", s:"友達の友達と初めて会う<br>飲み会が終わった。", l:"新しい人と話せて<br>楽しかった、また会いたい", r:"既存の友達と<br>ゆっくり話せなかったのが残念"},
    {ax:"AS", s:"自分の友達づきあいを<br>思い浮かべたとき。", l:"仕事・趣味など複数の<br>グループにバラバラにいる", r:"特定のグループが中心で<br>そこを深くつきあっている"},
    {ax:"AS", s:"今の3人グループに、<br>新しい4人目が加わることになった。", l:"新しい化学反応が<br>起きそうで楽しみ", r:"今の3人の空気感が<br>変わらないか少し心配"},
    {ax:"FL", s:"3人の中の1人が、<br>最近元気がないと感じた。", l:"「大丈夫？」と声をかけて<br>話を聞こうとする", r:"気分転換になりそうな<br>場所や遊びを提案する"},
    {ax:"FL", s:"グループで意見が割れて、<br>なかなか決まらない。", l:"それぞれの気持ちを確認しながら<br>落としどころを探す", r:"「じゃあこれにしよう」と<br>決断して前に進める"},
    {ax:"FL", s:"3人で会った翌日、<br>一番残っているのは。", l:"あの瞬間みんなが<br>笑っていた、あの空気感", r:"次回どこに行くか、<br>何をするかの具体的なイメージ"},
    {ax:"CV", s:"仲のいい友達と、<br>半年ぶりに会う。", l:"久しぶりでも<br>すぐ元通りになれる自信がある", r:"少し間が空くと<br>関係がリセットされた感覚になる"},
    {ax:"CV", s:"引っ越しや転職など、<br>環境が大きく変わったとき。", l:"前の関係を<br>大切に続けようとする", r:"新しい環境で<br>新しい人間関係を作る方に<br>エネルギーが向く"},
    {ax:"CV", s:"3年付き合いのある友達グループと、<br>最近できた新しいグループ。", l:"歴史があって何でも話せる<br>3年来のグループが居心地いい", r:"新鮮でまだ知らないことが多い<br>新しいグループが居心地いい"},
  ];

  function codeToId(code){
    const T = window.MINGLE_TYPES || {};
    for(const id in T){ if(T[id].code === code) return id; }
    return "MGL-01";
  }
  function score(ans){
    const sum=(a,b)=>ans[a]+ans[a+1]+ans[a+2];
    const l1 = sum(0)<=10?'E':'I';
    const l2 = sum(3)<=10?'A':'S';
    const l3 = sum(6)<=10?'F':'L';
    const l4 = sum(9)<=10?'C':'V';
    return codeToId(l1+l2+l3+l4);
  }

  const LS = "mingle_flow_v1";
  function save(st){ try{ localStorage.setItem(LS, JSON.stringify(st)); }catch(e){} }
  function load(){ try{ return JSON.parse(localStorage.getItem(LS)||"null"); }catch(e){ return null; } }

  function init(app){
    let state = load() || { screen:"landing", idx:0, ans:[] };
    var track = function(n,p){ if(window.MingleTrack) window.MingleTrack(n,p); };

    function go(screen){ state.screen=screen; save(state); paint(); }

    function paint(){
      if(state.screen==="landing") return landing();
      if(state.screen==="quiz") return quiz();
      if(state.screen==="analyzing") return analyzing();
      if(state.screen==="result") return result();
    }

    function landing(){
      app.scrollTop=0;
      const ids = ['MGL-01','MGL-04','MGL-13']; // coral / honey / teal の3頂点
      app.innerHTML = `
        <div class="scr scr-landing">
          <div class="ld-bg" aria-hidden="true"></div>
          <div class="ld-inner">
            <div class="ld-brand">
              <svg width="26" height="26" viewBox="0 0 40 40" fill="none"><path d="M20 5 L33.6 28.5 H6.4 Z" stroke="#F0714A" stroke-width="3.4" stroke-linejoin="round"/><circle cx="20" cy="5" r="4" fill="#F0714A"/><circle cx="33.6" cy="28.5" r="4" fill="#2BAE96"/><circle cx="6.4" cy="28.5" r="4" fill="#F2A93B"/></svg>
              <span>Mingle</span>
            </div>

            <div class="ld-hero" aria-hidden="true">
              <svg class="ld-tri" viewBox="0 0 268 196" fill="none">
                <path class="ld-edge" d="M134 38 L226 158"/>
                <path class="ld-edge" d="M226 158 L42 158"/>
                <path class="ld-edge" d="M42 158 L134 38"/>
              </svg>
              <span class="ld-av av-top"   style="--c:#F0714A"><img src="assets/characters/char_${ids[0]}.png" alt=""></span>
              <span class="ld-av av-left"  style="--c:#F2A93B"><img src="assets/characters/char_${ids[1]}.png" alt=""></span>
              <span class="ld-av av-right" style="--c:#2BAE96"><img src="assets/characters/char_${ids[2]}.png" alt=""></span>
            </div>

            <div class="ld-eyebrow">16 FRIEND TYPES</div>
            <h1 class="ld-title">あなたは、どんな<br>友達になる人？</h1>
            <p class="ld-sub">12の質問でわかる、16の友達タイプ。<br>あなたに似ているのは、どのキャラ？</p>

            <button class="cta cta-go ld-start" type="button">
              <span class="cta-label">診断をはじめる</span>
              <span class="cta-go-badge"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg></span>
            </button>
            <div class="ld-meta"><span>約2分</span><span class="ld-dot"></span><span>全12問</span><span class="ld-dot"></span><span>無料</span></div>
            <a class="ld-link" href="types.html">16タイプを見てみる →</a>
          </div>
        </div>`;
      app.querySelector('.ld-start').onclick = ()=>{ track('quiz_start'); state.idx=0; state.ans=[]; go("quiz"); };
    }

    function quiz(){
      app.scrollTop=0;
      const i = state.idx, q = Q[i];
      const pct = Math.round((i)/Q.length*100);
      app.innerHTML = `
        <div class="scr scr-quiz">
          <div class="q-deco" aria-hidden="true">
            <svg viewBox="0 0 360 700" preserveAspectRatio="none" width="100%" height="100%">
              <path d="M300 70 L330 122 H270 Z" fill="none" stroke="#F0714A" stroke-width="2.5" stroke-linejoin="round" opacity=".18"/>
              <path d="M58 250 L80 288 H36 Z" fill="none" stroke="#2BAE96" stroke-width="2.5" stroke-linejoin="round" opacity=".16"/>
              <path d="M318 560 L336 591 H300 Z" fill="none" stroke="#F2A93B" stroke-width="2.5" stroke-linejoin="round" opacity=".18"/>
              <circle cx="44" cy="120" r="4" fill="#F2A93B" opacity=".35"/>
              <circle cx="330" cy="330" r="4" fill="#2BAE96" opacity=".3"/>
              <circle cx="40" cy="600" r="4" fill="#F0714A" opacity=".32"/>
            </svg>
          </div>
          <div class="q-top">
            <button class="q-back" ${i===0?'disabled':''} aria-label="戻る">←</button>
            <div class="q-prog"><div class="q-prog-fill" style="width:${pct}%"></div></div>
            <div class="q-count"><b>${i+1}</b> / ${Q.length}</div>
          </div>
          <div class="q-body" id="qBody">
            <div class="q-qnum">Question ${i+1}</div>
            <div class="q-scenario">${q.s}</div>
            <div class="q-scale">
              <div class="q-pole q-pole-l"><span class="q-arrow">&#x25C4;&#xFE0E;</span><span>${q.l}</span></div>
              <div class="q-dots">
                <div class="q-track" aria-hidden="true"></div>
                ${[1,2,3,4,5,6].map(v=>`<button class="q-dot d${v} ${v<=3?'side-l':'side-r'}" data-v="${v}" aria-label="${v<=3?q.l:q.r}寄り（6段階の${v}）"></button>`).join('')}
              </div>
              <div class="q-pole q-pole-r"><span>${q.r}</span><span class="q-arrow">&#x25BA;&#xFE0E;</span></div>
            </div>
          </div>
        </div>`;
      const back = app.querySelector('.q-back');
      track('question_view', { question_no: i+1 });
      back.onclick = ()=>{ if(state.idx>0){ state.idx--; save(state); quiz(); } };
      app.querySelectorAll('.q-dot').forEach(b=> b.onclick = ()=>{
        state.ans[i] = +b.dataset.v;
        track('question_answer', { question_no: i+1, value: +b.dataset.v });
        b.classList.add('picked');
        const body = app.querySelector('#qBody'); body.classList.add('leaving');
        setTimeout(()=>{
          if(state.idx < Q.length-1){ state.idx++; save(state); quiz(); }
          else { save(state); go("analyzing"); }
        }, 240);
      });
    }

    function analyzing(){
      app.scrollTop=0;
      track('analyzing');
      app.innerHTML = `
        <div class="scr scr-analyzing">
          <div class="an-loop">
            <svg viewBox="0 0 120 120" width="150" height="150">
              <path class="an-edge" d="M60 16 L102 90 L18 90 Z" fill="none" stroke="#E7C9A8" stroke-width="2.5" stroke-linejoin="round"/>
              <path class="an-edge an-draw" d="M60 16 L102 90 L18 90 Z" fill="none" stroke="#F0714A" stroke-width="3" stroke-linejoin="round"/>
              <circle cx="60" cy="16" r="7" fill="#F0714A"/>
              <circle cx="102" cy="90" r="7" fill="#2BAE96"/>
              <circle cx="18" cy="90" r="7" fill="#F2A93B"/>
            </svg>
          </div>
          <div class="an-text">あなたのタイプを<br>分析しています…</div>
          <div class="an-axes" id="anAxes"></div>
        </div>`;
      const axes=["能動 ⇄ 受動","広く ⇄ 深く","感情 ⇄ 行動","定着 ⇄ 流動"];
      const el = app.querySelector('#anAxes'); let k=0;
      el.textContent = axes[0];
      const t = setInterval(()=>{ k=(k+1)%axes.length; el.textContent=axes[k]; el.style.animation='none'; void el.offsetWidth; el.style.animation='anFade .5s'; }, 620);
      setTimeout(()=>{ clearInterval(t); state.type = score(state.ans); save(state); go("result"); }, 2700);
    }

    function result(){
      const id = state.type || score(state.ans);
      var T = (window.MINGLE_TYPES||{})[id]||{};
      track('result_view', { type_id:id, type_name:T.name||'', type_code:T.code||'' });
      app.scrollTop=0;
      app.innerHTML = window.MingleResult.build(id, 'a') + `<button class="restart" aria-label="もう一度診断する">↻ もう一度</button>`;
      window.MingleResult.wire(app, { onGoType:(gid)=>{ state.type=gid; save(state); result(); } });
      const r = app.querySelector('.result');
      requestAnimationFrame(()=>requestAnimationFrame(()=> r.classList.add('fx')));
      app.querySelector('.restart').onclick = ()=>{ state={screen:"landing",idx:0,ans:[]}; save(state); paint(); };
    }

    paint();
  }

  window.MingleFlow = { init };
})();
