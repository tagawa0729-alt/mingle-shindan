/* Mingle 診断 — Googleアナリティクス4（GA4）計測ヘルパー
   config.js の ga4Id（G-XXXXXXXXXX）が設定されていればGA4を読み込み、
   ファネルのイベントを送信する。未設定ならすべて no-op（エラーにならない）。

   送信イベント：
     quiz_start         診断開始（ランディングの「診断をはじめる」）
     question_view      各設問の表示（params: question_no 1-12）← 離脱地点が分かる
     question_answer    各設問の回答（params: question_no, value 1-6）
     analyzing          分析演出に到達
     result_view        結果表示（params: type_id, type_name, type_code）← タイプ別の多寡
     email_register     メール登録で取扱説明書を解除（登録到達）
     cta_preregister    結果末尾「事前登録する」クリック
     share              シェア（params: method = x|line|image|open）
     view_types         16タイプ一覧へ
*/
(function(){
  var id = (window.CHILIN_CONFIG && window.CHILIN_CONFIG.ga4Id) || "";
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }

  if(id){
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
    gtag('js', new Date());
    // 既定のpage_viewは送る。デバッグしたい時はGA4の DebugView を使用。
    gtag('config', id, { send_page_view: true });
  }

  // アプリ内のどこからでも呼べる薄いラッパ
  window.ChilInTrack = function(eventName, params){
    try{
      if(id && typeof gtag === 'function'){
        gtag('event', eventName, params || {});
      }
      // GA4未設定でもデバッグできるよう、コンソールには出す（本番は無害）
      if(window.CHILIN_DEBUG_ANALYTICS){ console.log('[track]', eventName, params||{}); }
    }catch(e){}
  };
})();
