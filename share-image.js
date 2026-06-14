/* Mingle シェア画像ビルダー
   build(type, format) -> 実寸のカードDOM（OGP 1200×630 / Stories 1080×1920）
   人物=生成キャラ画像、背景・文字・コード・QR・ワードマーク=コード描画。
   QRは qrcode-generator (window.qrcode) を使用。 */
(function(){
  const SIZES = { ogp:{w:1200,h:630}, stories:{w:1080,h:1920} };
  const DIAG_URL = (window.CHILLIN_CONFIG && window.CHILLIN_CONFIG.diagnoseUrl) || "https://shindan.mingleapp.jp";
  const HOST = DIAG_URL.replace(/^https?:\/\//,'').replace(/\/+$/,'');

  function lighten(hex,a){const x=parseInt(hex.slice(1),16);let r=(x>>16)&255,g=(x>>8)&255,b=x&255;r=Math.round(r+(255-r)*a);g=Math.round(g+(255-g)*a);b=Math.round(b+(255-b)*a);return`rgb(${r},${g},${b})`;}
  function darken(hex,a){const x=parseInt(hex.slice(1),16);let r=(x>>16)&255,g=(x>>8)&255,b=x&255;r=Math.round(r*(1-a));g=Math.round(g*(1-a));b=Math.round(b*(1-a));return`rgb(${r},${g},${b})`;}
  const img = id => `assets/characters/char_${id}.png`;

  /* 日本語コピーを「意味の切れ目（、。！？）」優先で行に分ける。
     ・句読点は前の文字にぶら下げる（行頭に来ない）
     ・各セグメントは原則1行に保つ → 「わからなくても、」が割れない
     ・極端に長いセグメントのみ、禁則を守って文字数で折る */
  function wrapJP(text, hardCap){
    hardCap = hardCap || 22;
    const segs = []; let buf = '';
    for(const ch of text){ buf += ch; if('、。！？'.includes(ch)){ segs.push(buf); buf=''; } }
    if(buf) segs.push(buf);
    const lines = [];
    for(let seg of segs){
      if([...seg].length <= hardCap){ lines.push(seg); continue; }
      let s = [...seg];
      while(s.length > hardCap){
        let cut = hardCap;
        while(cut < s.length && '、。！？」』）)】’”'.includes(s[cut])) cut++;
        lines.push(s.slice(0,cut).join('')); s = s.slice(cut);
      }
      if(s.length) lines.push(s.join(''));
    }
    return lines;
  }
  function longestLen(lines){ return lines.reduce((m,l)=>Math.max(m,[...l].length),0); }

  function wordmark(scale, light){
    const c = light ? '#fff' : '#2B2521';
    const s = scale||1;
    return `<span style="display:inline-flex;align-items:center;gap:${11*s}px">
      <svg width="${30*s}" height="${30*s}" viewBox="0 0 40 40" fill="none">
        <path d="M20 5 L33.6 28.5 H6.4 Z" stroke="${light?'#fff':'#F0714A'}" stroke-width="3.6" stroke-linejoin="round"/>
        <circle cx="20" cy="5" r="4" fill="${light?'#fff':'#F0714A'}"/><circle cx="33.6" cy="28.5" r="4" fill="${light?'#fff':'#2BAE96'}"/><circle cx="6.4" cy="28.5" r="4" fill="${light?'#fff':'#F2A93B'}"/>
      </svg>
      <span style="font-family:'Zen Maru Gothic',sans-serif;font-weight:900;font-size:${23*s}px;color:${c};letter-spacing:.04em">ChillIn</span>
    </span>`;
  }

  function qrSVG(px, dark){
    dark = dark || '#2B2521';
    try{
      const qr = window.qrcode(0,'M'); qr.addData(DIAG_URL); qr.make();
      const n = qr.getModuleCount(); const cell = px/n;
      let rects='';
      for(let r=0;r<n;r++)for(let c=0;c<n;c++){ if(qr.isDark(r,c)) rects+=`<rect x="${(c*cell).toFixed(2)}" y="${(r*cell).toFixed(2)}" width="${(cell+0.4).toFixed(2)}" height="${(cell+0.4).toFixed(2)}"/>`; }
      return `<svg width="${px}" height="${px}" viewBox="0 0 ${px} ${px}" fill="${dark}" shape-rendering="crispEdges">${rects}</svg>`;
    }catch(e){
      return `<div style="width:${px}px;height:${px}px;background:repeating-conic-gradient(${dark} 0% 25%,#fff 0% 50%);background-size:${px/7}px ${px/7}px"></div>`;
    }
  }

  /* ===================== OGP 1200×630（X / LINE リンクカード） ===================== */
  function buildOGP(t){
    const accent = t.color;
    const nameLen = [...t.name].length;
    const nameSize = nameLen<=5 ? 88 : nameLen<=7 ? 74 : 62;
    const copyLines = wrapJP(t.copy, 16);
    return `<div class="card-ogp" style="width:1200px;height:630px;display:flex;font-family:'Zen Kaku Gothic New',sans-serif;background:linear-gradient(135deg,#FBF6EE,#F4ECDF);overflow:hidden;position:relative">
      <div style="position:absolute;inset:0;background-image:radial-gradient(circle, rgba(43,37,33,.05) 1.4px, transparent 1.4px);background-size:30px 30px;opacity:.6"></div>
      <div style="position:relative;z-index:1;flex:1.42;display:flex;flex-direction:column;justify-content:center;padding:0 70px;gap:20px">
        ${wordmark(1.15,false)}
        <div style="font-family:'Outfit',sans-serif;font-weight:700;font-size:25px;letter-spacing:.16em;color:${darken(accent,.05)}">${t.id} · ${t.code}</div>
        <div style="font-family:'Zen Maru Gothic',sans-serif;font-weight:900;font-size:${nameSize}px;line-height:1.14;color:#2B2521">${t.name}</div>
        <div style="font-size:24px;line-height:1.5;color:#6F645B">${copyLines.join('<br>')}</div>
        <div style="margin-top:10px"><span style="display:inline-flex;align-items:center;gap:12px;background:${accent};color:#fff;font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:23px;padding:14px 16px 14px 26px;border-radius:999px">あなたの友達タイプは？<span style="width:34px;height:34px;border-radius:999px;background:rgba(255,255,255,.24);display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg></span></span></div>
      </div>
      <div style="position:relative;z-index:1;flex:1;background:linear-gradient(160deg,${lighten(accent,.16)},${accent} 76%,${darken(accent,.12)});display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
        <div style="position:absolute;top:-22%;left:50%;transform:translateX(-50%);width:130%;height:80%;background:radial-gradient(50% 50% at 50% 50%,rgba(255,255,255,.42),transparent 66%)"></div>
        <svg viewBox="0 0 100 100" style="position:absolute;top:50%;left:50%;width:118%;height:118%;transform:translate(-50%,-46%);opacity:.16" fill="none"><path d="M50 16 L82 74 L18 74 Z" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>
        <div style="position:relative;z-index:2;width:78%;height:90%;background:rgba(251,246,238,.92);border-radius:48% 48% 26px 26px;display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
          <img src="${img(t.id)}" alt="" crossorigin="anonymous" style="width:98%;height:100%;object-fit:contain;object-position:bottom;filter:drop-shadow(0 12px 18px rgba(40,20,8,.22))">
        </div>
      </div>
    </div>`;
  }

  /* ===================== Stories 1080×1920（Instagram 保存用） ===================== */
  function buildStories(t){
    const accent = t.color;
    const nameLen = [...t.name].length;
    const nameSize = nameLen<=5 ? 104 : nameLen<=7 ? 88 : 74;
    const copyLines = wrapJP(t.copy, 20);
    const copySize = Math.max(30, Math.min(40, Math.floor(900 / Math.max(11, longestLen(copyLines)))));
    return `<div class="card-stories" style="width:1080px;height:1920px;display:flex;flex-direction:column;font-family:'Zen Kaku Gothic New',sans-serif;background:linear-gradient(177deg,${lighten(accent,.10)} 0%,${accent} 50%,${darken(accent,.16)} 100%);position:relative;overflow:hidden">
      <div style="position:absolute;inset:0;background-image:radial-gradient(circle, rgba(255,255,255,.10) 1.6px, transparent 1.6px);background-size:40px 40px;opacity:.5"></div>
      <div style="position:absolute;top:-4%;left:50%;transform:translateX(-50%);width:130%;height:44%;background:radial-gradient(50% 60% at 50% 28%,rgba(255,255,255,.34),transparent 70%)"></div>
      <svg viewBox="0 0 100 100" style="position:absolute;top:42%;left:50%;width:150%;height:80%;transform:translate(-50%,-50%);opacity:.10" fill="none"><path d="M50 18 L80 72 L20 72 Z" stroke="#fff" stroke-width="1" stroke-linejoin="round"/></svg>

      <div style="position:relative;z-index:2;padding:96px 0 0;text-align:center">
        ${wordmark(2.0,true)}
        <div style="font-family:'Outfit',sans-serif;font-weight:700;font-size:26px;letter-spacing:.28em;color:rgba(255,255,255,.92);margin-top:24px">FRIEND TYPE 診断</div>
      </div>

      <div style="position:relative;z-index:2;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;color:#fff;padding:0 80px;text-align:center">
        <div style="font-size:30px;font-weight:700;color:rgba(255,255,255,.92);letter-spacing:.02em;margin-bottom:30px">あなたの友達タイプは</div>
        <div style="position:relative;margin-bottom:30px">
          <div style="position:absolute;inset:-18px;border-radius:50%;border:2px solid rgba(255,255,255,.45)"></div>
          <div style="width:440px;height:440px;border-radius:50%;background:rgba(251,246,238,.94);display:flex;align-items:flex-end;justify-content:center;overflow:hidden;box-shadow:0 50px 80px -34px rgba(40,20,8,.55)">
            <img src="${img(t.id)}" alt="" crossorigin="anonymous" style="width:94%;height:100%;object-fit:contain;object-position:bottom">
          </div>
        </div>
        <div style="display:inline-block;white-space:nowrap;font-family:'Outfit',sans-serif;font-weight:700;font-size:26px;letter-spacing:.16em;color:#fff;background:rgba(255,255,255,.18);padding:9px 24px;border-radius:999px;margin-bottom:26px">${t.id} · ${t.code}</div>
        <div style="font-family:'Zen Maru Gothic',sans-serif;font-weight:900;font-size:${nameSize}px;line-height:1.16;text-shadow:0 6px 22px rgba(60,25,8,.28);margin-bottom:26px">${t.name}</div>
        <div style="font-size:${copySize}px;line-height:1.7;color:rgba(255,255,255,.98);font-weight:500">${copyLines.join('<br>')}</div>
      </div>

      <div style="position:relative;z-index:2;padding:0 0 92px;display:flex;flex-direction:column;align-items:center;gap:22px">
        <div style="background:#fff;padding:26px;border-radius:30px;box-shadow:0 26px 50px -22px rgba(40,20,8,.5)">${qrSVG(220)}</div>
        <div style="font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:30px;color:#fff;display:flex;align-items:center;gap:12px">診断してみる<span style="width:32px;height:32px;border-radius:999px;background:rgba(255,255,255,.22);display:inline-flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg></span></div>
        <div style="font-family:'Outfit',sans-serif;font-weight:600;font-size:27px;letter-spacing:.04em;color:rgba(255,255,255,.96)">${HOST}</div>
      </div>
    </div>`;
  }

  function build(t, format){ return format==='stories' ? buildStories(t) : buildOGP(t); }

  window.ChillInShare = { build, SIZES, DIAG_URL, HOST, wrapJP };
})();
