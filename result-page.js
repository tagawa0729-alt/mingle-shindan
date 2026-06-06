/* Mingle 結果ページ — 描画ロジック（データ駆動）
   コンテンツは window.MINGLE_TYPES（types-data.js）から取得。
   build(typeId, variant) -> HTML文字列 / wire(scrollRoot) で挙動を配線。 */
(function(){
  function lighten(hex,amt){const x=parseInt(hex.slice(1),16);let r=(x>>16)&255,g=(x>>8)&255,b=x&255;r=Math.round(r+(255-r)*amt);g=Math.round(g+(255-g)*amt);b=Math.round(b+(255-b)*amt);return`rgb(${r},${g},${b})`;}
  function darken(hex,amt){const x=parseInt(hex.slice(1),16);let r=(x>>16)&255,g=(x>>8)&255,b=x&255;r=Math.round(r*(1-amt));g=Math.round(g*(1-amt));b=Math.round(b*(1-amt));return`rgb(${r},${g},${b})`;}
  const li = a => a.map(s=>`<li>${s}</li>`).join('');
  const img = id => `assets/characters/char_${id}.png`;

  function sections(t){
    const compat = t.compat.map(c=>`
      <a class="cp" href="#" data-go="${c.id}" style="--cc:${c.color}">
        <span class="cp-tag">${c.tag}</span>
        <span class="cp-body">
          <span class="cp-img" style="background:linear-gradient(160deg,${lighten(c.color,.2)},${c.color})">
            <img src="${img(c.id)}" alt="${c.name}">
          </span>
          <span class="cp-txt"><b>${c.id}　${c.name}</b><em>${c.reason}</em></span>
          <span class="cp-arr">→</span>
        </span>
      </a>`).join('');

    return `
    <section class="sec sec-intro">
      <div class="sec-h"><span class="sec-n">01</span><h3>あなたはこういう人</h3></div>
      <p>${t.intro}</p>
    </section>
    <section class="sec">
      <div class="sec-h"><span class="sec-n">02</span><h3>3人組での役割</h3></div>
      <p>${t.role}</p>
    </section>
    <section class="sec sec-cards">
      <div class="two">
        <div class="mini mini-up"><h4>あなたの強み</h4><ul class="ul up">${li(t.strengths)}</ul></div>
        <div class="mini mini-dn"><h4>実はここが課題</h4><ul class="ul dn">${li(t.challenges)}</ul></div>
      </div>
    </section>
    <section class="sec sec-quote">
      <div class="sec-h"><span class="sec-n">03</span><h3>こんな場面、心当たりない？</h3></div>
      <blockquote>${t.words}</blockquote>
    </section>
    <section class="sec">
      <div class="sec-h"><span class="sec-n">04</span><h3>あなたに合うグループ</h3></div>
      <p>${t.groupShape}</p>
    </section>
    <section class="sec sec-compat">
      <div class="sec-h"><span class="sec-n">05</span><h3>相性のいいタイプ</h3></div>
      <div class="cps">${compat}</div>
    </section>
    <section class="sec sec-lock">
      <div class="lock-wrap">
        <div class="lock-peek">
          <div class="sec-h"><span class="sec-n lock-n">★</span><h3>取扱説明書</h3></div>
          <h4 class="lk-t">${t.manual.unconscious[0].t}</h4>
          <p class="lk-p">${t.manual.unconscious[0].d}</p>
          <h4 class="lk-t">${t.manual.unconscious[1].t}</h4>
          <p class="lk-p">${t.manual.unconscious[1].d}</p>
        </div>
        <div class="lock-veil">
          <div class="reg-card">
            <div class="reg-mark"><svg viewBox="0 0 44 44" width="44" height="44" fill="none"><circle cx="22" cy="22" r="20.5" stroke="var(--accent)" stroke-width="1.5"/><path d="M22 13 L27 22 L22 31 L17 22 Z" fill="var(--accent)"/></svg></div>
            <div class="reg-ttl">続きは、<b>登録</b>すると読めます</div>
            <div class="reg-sub">リリース先行登録（無料）。メールを入れるだけ。</div>
            <button type="button" class="cta cta-unlock">登録して続きを読む</button>
            <div class="reg-note"><span class="kw">無意識にやってしまうこと</span>／<span class="kw">Mingleでの動き方</span>が読めます</div>
          </div>
        </div>
      </div>
    </section>
    <section class="sec sec-manual" hidden>
      <div class="manual-in">
        <div class="sec-h"><span class="sec-n">06</span><h3>取扱説明書</h3></div>
        <h4 class="blk">1. 無意識にやってしまうこと</h4>
        ${t.manual.unconscious.map(u=>`<div class="man-item"><b>${u.t}</b><p>${u.d}</p></div>`).join('')}
        <h4 class="blk">2. Mingleでの動き方</h4>
        ${t.manual.mingle.map(u=>`<div class="man-item"><b>${u.t}</b><p>${u.d}</p></div>`).join('')}
      </div>
    </section>
    <section class="sec sec-end">
      <p class="end-line">あなたに合うグループ、<br>Mingleでつくろう。</p>
      <button class="cta cta-reg">事前登録する</button>
      <button class="ghost cta-share">結果をシェアする</button>
    </section>
    <div class="foot-space"></div>`;
  }

  function hero(t, variant){
    const g = `linear-gradient(165deg, ${lighten(t.color,.16)}, ${t.color} 72%, ${darken(t.color,.12)})`;
    if(variant==='b'){
      return `<header class="hero hero-b">
        <span class="badge" style="--cc:${t.color}">${t.id} · ${t.code}</span>
        <div class="hb-kicker">あなたの友達タイプは</div>
        <div class="hb-disc" style="background:radial-gradient(120% 90% at 50% 18%, ${lighten(t.color,.28)}, ${t.color})"><img src="${img(t.id)}" alt="${t.name}"></div>
        <h1 style="color:${darken(t.color,.18)}">${t.name}</h1>
        <p>${t.copy}</p>
      </header>`;
    }
    if(variant==='c'){
      return `<header class="hero hero-c" style="--cc:${t.color}">
        <div class="hc-top">
          <span class="badge" style="--cc:${t.color}">${t.id} · ${t.code}</span>
          <div class="hc-img" style="border-color:${t.color}"><img src="${img(t.id)}" alt="${t.name}"></div>
        </div>
        <div class="hc-kicker">あなたの友達タイプは</div>
        <h1>${t.name}</h1>
        <div class="hc-rule" style="background:${t.color}"></div>
        <p>${t.copy}</p>
      </header>`;
    }
    // a — bold full-bleed
    return `<header class="hero hero-a" style="--g:${g}">
      <div class="ha-glow"></div>
      <div class="ha-meta"><span class="badge">${t.id} · ${t.code}</span></div>
      <div class="ha-img"><img src="${img(t.id)}" alt="${t.name}"></div>
      <div class="ha-cap">
        <div class="ha-kicker">あなたの友達タイプは</div>
        <h1>${t.name}</h1>
        <p>${t.copy}</p>
      </div>
    </header>`;
  }

  function build(typeId, variant){
    variant = variant || 'a';
    const T = (window.MINGLE_TYPES||{})[typeId];
    if(!T){ return `<div style="padding:40px;font-family:sans-serif">未登録のタイプ: ${typeId}</div>`; }
    return `<div class="result v-${variant}" data-type="${typeId}" style="--accent:${T.color};--accent-d:${darken(T.color,.16)};--accent-l:${lighten(T.color,.82)}">
      <a class="result-nav" href="types.html" aria-label="16タイプ一覧を見る"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg><span>16タイプ</span></a>
      ${hero(T,variant)}
      <main class="rmain">${sections(T)}</main>
    </div>`;
  }

  function wire(root, opts){
    opts = opts || {};
    // 取扱説明書を解除：チラ見せ枠を小さな「ありがとう」に置き換え、下の本編を開く
    const doUnlock = ()=>{
      const m = root.querySelector('.sec-manual');
      const lock = root.querySelector('.sec-lock');
      const wrap = root.querySelector('.lock-wrap');
      if(wrap){
        wrap.classList.add('unlocked');
        wrap.innerHTML = `<div class="lock-thanks">
          <div class="thanks-mark"><svg viewBox="0 0 40 40" width="34" height="34" fill="none"><circle cx="20" cy="20" r="19" fill="var(--accent)"/><path d="M12.5 20.5 L18 26 L28 15" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
          <div class="thanks-txt"><b>登録ありがとうございます</b><span>下に取扱説明書が開きました。リリース時にお知らせします。</span></div>
        </div>`;
      }
      if(m){ m.hidden=false; m.classList.add('reveal'); }
      if(lock){ lock.classList.add('done'); }
      const sc = root.closest('.phone-scroll') || root.parentElement;
      if(m && sc){ setTimeout(()=>{ sc.scrollTo({top: m.offsetTop-20, behavior:'smooth'}); }, 250); }
    };
    root._mingleUnlock = doUnlock;
    // メール登録（取扱説明書ゲート）：ボタン → モーダルシート
    root.querySelectorAll('.cta-unlock').forEach(b=> b.addEventListener('click',e=>{e.preventDefault(); const id=(root.querySelector('.result')||{}).getAttribute? root.querySelector('.result').getAttribute('data-type'):null; showEmailSheet(root, id);}));
    root.querySelectorAll('.cta-reg').forEach(b=> b.addEventListener('click',e=>{
      e.preventDefault();
      if(window.MingleTrack) window.MingleTrack('cta_preregister');
      const url = (window.MINGLE_REGISTER_URL && window.MINGLE_REGISTER_URL()) || 'https://mingleapp.jp';
      window.open(url, '_blank', 'noopener');
    }));
    root.querySelectorAll('.cta-share').forEach(b=> b.addEventListener('click',e=>{e.preventDefault(); const id=(root.querySelector('.result')||{}).getAttribute? root.querySelector('.result').getAttribute('data-type'):null; showShareSheet(root, id); if(opts.onShare) opts.onShare();}));
    root.querySelectorAll('.cp').forEach(a=> a.addEventListener('click',e=>{e.preventDefault(); const id=a.getAttribute('data-go'); if(opts.onGoType) opts.onGoType(id);}));
  }

  // 結果カード画像を実寸で生成（html-to-image）。format: 'stories'|'ogp'
  async function renderCardPng(typeId, format){
    const T = (window.MINGLE_TYPES||{})[typeId]; if(!T || !window.MingleShare || !window.htmlToImage) return null;
    const sz = window.MingleShare.SIZES[format];
    const holder = document.createElement('div');
    holder.style.cssText = 'position:fixed;left:-99999px;top:0;pointer-events:none';
    holder.innerHTML = `<div style="width:${sz.w}px;height:${sz.h}px">${window.MingleShare.build(T,format)}</div>`;
    document.body.appendChild(holder);
    const node = holder.firstElementChild;
    await Promise.all([...node.querySelectorAll('img')].map(im=> im.complete?Promise.resolve():new Promise(r=>{im.onload=im.onerror=r;})));
    await new Promise(r=>setTimeout(r,150));
    let blob=null;
    try{ blob = await window.htmlToImage.toBlob(node,{width:sz.w,height:sz.h,pixelRatio:1,cacheBust:true}); }catch(e){}
    holder.remove();
    return blob;
  }

  function showEmailSheet(root, typeId){
    const host = root.closest('.phone-screen') || root;
    const old = host.querySelector('.email-sheet'); if(old) old.remove();
    const el = document.createElement('div');
    el.className = 'email-sheet';
    const acc = ((window.MINGLE_TYPES||{})[typeId]||{}).color || '#F0714A';
    el.style.setProperty('--accent', acc);
    el.innerHTML = `<div class="email-card">
        <div class="share-handle"></div>
        <div class="email-h">取扱説明書を読む</div>
        <div class="email-sub">リリース先行登録（無料）。<br>メールアドレスを入れるだけ。</div>
        <form class="email-form" id="emailForm" novalidate>
          <input type="email" placeholder="メールアドレス" autocomplete="email" inputmode="email" required aria-label="メールアドレス">
          <button type="submit" class="email-btn">送信する</button>
        </form>
        <button class="email-x">あとで</button>
      </div>`;
    host.appendChild(el);
    setTimeout(()=> el.classList.add('show'), 20);
    const close=()=>{ el.classList.remove('show'); setTimeout(()=>el.remove(),250); };
    el.querySelector('.email-x').onclick=close;
    el.addEventListener('click',e=>{ if(e.target===el) close(); });
    el.querySelector('#emailForm').addEventListener('submit', async (e)=>{
      e.preventDefault();
      const input = el.querySelector('input[type=email]');
      const email = (input.value||'').trim();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ input.focus(); return; }
      try{ localStorage.setItem('mingle_email', email); }catch(_){}
      if(window.MingleTrack){ window.MingleTrack('email_register', { type_id: typeId||'' }); }
      try{
        const ep = (window.MINGLE_CONFIG||{}).subscribeEndpoint;
        if(ep){ fetch(ep, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email, type:typeId})}).catch(()=>{}); }
      }catch(_){}
      showEmailConfirmSheet(root, email, typeId);
      el.remove();
    });
  }

  function showEmailConfirmSheet(root, email, typeId){
    const host = root.closest('.phone-screen') || root;
    const el = document.createElement('div');
    el.className = 'email-sheet';
    const acc = ((window.MINGLE_TYPES||{})[typeId]||{}).color || '#F0714A';
    el.style.setProperty('--accent', acc);
    el.innerHTML = `<div class="email-card email-confirm">
        <div class="share-handle"></div>
        <div class="email-icon"><svg viewBox="0 0 44 44" width="40" height="40" fill="none"><circle cx="22" cy="22" r="21" fill="var(--accent)"/><path d="M14 22.5 L19.5 28 L30 16.5" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div class="email-h">確認メールを送信しました</div>
        <div class="email-sub"><b>${email}</b> 宛にメールをお送りしました。ご確認ください。</div>
        <button class="email-ok">OK</button>
      </div>`;
    host.appendChild(el);
    setTimeout(()=> el.classList.add('show'), 20);
    el.querySelector('.email-ok').addEventListener('click', ()=>{
      el.classList.remove('show'); setTimeout(()=>el.remove(),250);
      if(typeof root._mingleUnlock === 'function') root._mingleUnlock();
    });
  }

  function showShareSheet(root, typeId){
    const cfg = window.MINGLE_CONFIG||{};
    const base = (cfg.diagnoseUrl || 'https://shindan.mingleapp.jp').replace(/\/+$/,'');
    const T = (window.MINGLE_TYPES||{})[typeId]||{};
    // タイプ別シェアページ（OGP画像付き → 押すと診断トップへ）をシェアする
    const shareUrl = typeId ? `${base}/share/${typeId}.html` : base + '/';
    const text = `私の友達タイプは「${T.name||''}」でした。あなたは、どんな友達になる人？`;
    const hook = T.name ? `「${T.name}」だった。` : 'あなたは、どんな友達になる人？';
    const host = root.closest('.phone-screen') || root;
    const old = host.querySelector('.share-sheet'); if(old) old.remove();
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}&hashtags=Mingle友達タイプ診断`;
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`;
    const ogp = typeId ? `assets/share/ogp/${typeId}.png` : '';
    const el = document.createElement('div');
    el.className = 'share-sheet';
    el.style.setProperty('--accent', (T.color)||'#F0714A');
    el.innerHTML = `<div class="share-card">
        <div class="share-handle"></div>
        ${ogp ? `<div class="share-preview"><img src="${ogp}" alt=""></div>` : ''}
        <div class="share-h">あなたは、どんな友達？</div>
        <div class="share-sub">「当たってる」と思ったら、<br>友達にも診断をしてもらおう。</div>
        <div class="share-row">
          <a class="share-ic x" href="${xUrl}" target="_blank" rel="noopener" data-share="x"><span class="ic"><img src="assets/icons/x.webp" alt=""></span><span>Xでシェア</span></a>
          <a class="share-ic line" href="${lineUrl}" target="_blank" rel="noopener" data-share="line"><span class="ic"><img src="assets/icons/line.png" alt=""></span><span>LINEでシェア</span></a>
        </div>
        <button class="share-img" data-fmt="stories"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg><span>画像を保存（ストーリーズ用）</span><span class="sp"></span></button>
        <button class="share-x">閉じる</button>
      </div>`;
    host.appendChild(el);
    setTimeout(()=> el.classList.add('show'), 20);
    const close=()=>{ el.classList.remove('show'); setTimeout(()=>el.remove(),250); };
    el.querySelector('.share-x').onclick=close;
    el.addEventListener('click',e=>{ if(e.target===el) close(); });
    el.querySelectorAll('[data-share]').forEach(a=> a.addEventListener('click',()=>{ if(window.MingleTrack) window.MingleTrack('share', { method:a.getAttribute('data-share'), type_id:typeId||'' }); }));
    const imgBtn = el.querySelector('.share-img');
    imgBtn.addEventListener('click', async ()=>{
      if(window.MingleTrack) window.MingleTrack('share', { method:'image', type_id:typeId||'' });
      imgBtn.classList.add('busy'); const sp=imgBtn.querySelector('.sp'); sp.textContent='保存中…';
      const blob = await renderCardPng(typeId, 'stories');
      imgBtn.classList.remove('busy'); sp.textContent='';
      if(!blob){ sp.textContent='未対応'; return; }
      const file = new File([blob], `mingle_${typeId}.png`, {type:'image/png'});
      if(navigator.canShare && navigator.canShare({files:[file]})){
        try{ await navigator.share({files:[file], text}); return; }catch(e){}
      }
      const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`mingle_${typeId}.png`; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(a.href),2000);
    });
  }

  function showStoreSheet(root){
    const cfg = (window.MINGLE_CONFIG||{}).store||{};
    const host = root.closest('.phone-screen') || root;
    const old = host.querySelector('.store-sheet'); if(old) old.remove();
    const el = document.createElement('div');
    el.className = 'store-sheet';
    el.innerHTML = `<div class="store-card">
        <div class="store-h">アプリを事前予約</div>
        <div class="store-sub">リリース時にお知らせが届きます</div>
        <a class="store-btn ios" href="${cfg.ios||'#'}" target="_blank" rel="noopener">App Store で予約</a>
        <a class="store-btn and" href="${cfg.android||'#'}" target="_blank" rel="noopener">Google Play で予約</a>
        <button class="store-x">あとで</button>
      </div>`;
    host.appendChild(el);
    setTimeout(()=> el.classList.add('show'), 20);
    const close=()=>{ el.classList.remove('show'); setTimeout(()=>el.remove(),250); };
    el.querySelector('.store-x').onclick=close;
    el.addEventListener('click',e=>{ if(e.target===el) close(); });
  }

  window.MingleResult = { build, wire };
})();
