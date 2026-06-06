// Vercel Serverless Function — メール事前登録の受け口
// パス: /api/subscribe  （POST: { email, type }）
//
// ★これは「ひな形」です。Claude Code で下記TODOを実装してください。
//   - 保存先（Vercel KV / Postgres / Google Sheet / Airtable のいずれか）
//   - 確認メール送信（Resend 推奨。SendGrid 等でも可）
//   - 環境変数（Vercel の Settings → Environment Variables に設定）
//
// 必要な環境変数（例）:
//   RESEND_API_KEY      … Resend の APIキー
//   MAIL_FROM           … 送信元（例: "Mingle <noreply@mingleapp.jp>"）
//   ADMIN_NOTIFY_EMAIL  … 登録通知を受け取る管理者アドレス（任意）

export default async function handler(req, res) {
  // CORS（同一ドメイン配信なら不要。別ドメインから叩くなら調整）
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { email, type } = req.body || {};
    // 1) バリデーション
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'invalid email' });
    }

    // 2) TODO: 保存（重複チェック込み）
    //    例) await kv.sadd('mingle_subscribers', JSON.stringify({ email, type, ts: Date.now() }));
    //    例) Google Sheet / Airtable へ追記

    // 3) TODO: 確認メール送信（Resend 例）
    //    const r = await fetch('https://api.resend.com/emails', {
    //      method: 'POST',
    //      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    //      body: JSON.stringify({
    //        from: process.env.MAIL_FROM,
    //        to: email,
    //        subject: 'Mingle 友達タイプ診断｜ご登録ありがとうございます',
    //        html: `<p>ご登録ありがとうございます。リリース時にお知らせします。</p>`
    //      })
    //    });

    // 4) TODO: 管理者通知（任意）

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'server error' });
  }
}
