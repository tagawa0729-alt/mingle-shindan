/* Mingle 診断 — リリース設定（ここだけ差し替えればOK） */
window.MINGLE_CONFIG = {
  // 事前登録ページのURL（結果末尾「事前登録する」ボタンの遷移先）
  registerUrl: "https://mingleapp.jp",
  // 診断ページのURL（シェア画像のQR / シェアリンクに使用）
  diagnoseUrl: "https://shindan.mingleapp.jp",

  // ▼ Googleアナリティクス4（GA4）測定ID。GA4で発行した「G-XXXXXXXXXX」を入れる。
  //   空のままなら計測は無効（エラーにはならない）。
  ga4Id: "G-Y35S44LJD3",

  // ▼ メール登録の送信先。Vercel Serverless Function を使う想定。
  //   /api/subscribe に {email, type} をPOST。Claude Codeで実装（引き継ぎ書参照）。
  subscribeEndpoint: "/api/subscribe"
};

/* 事前登録ボタンを押したときに開くURLを返す */
window.MINGLE_REGISTER_URL = function(){
  return (window.MINGLE_CONFIG && window.MINGLE_CONFIG.registerUrl) || "https://mingleapp.jp";
};
