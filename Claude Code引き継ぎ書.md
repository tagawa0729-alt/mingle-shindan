# Claude Code 引き継ぎ書 — メール登録の保存＆送信（Vercelデプロイ）

このサイトは **静的サイト（HTML/CSS/JS）** です。デザイン・画面はすべて完成しています。
Claude Code には **「診断で集めたメールアドレスを保存し、確認メールを送る」サーバー処理だけ** をお願いします。
**フロント（見た目・画面遷移）は変更しないでください。**

---

## いまの状態（フロント側は実装済み）

- メール入力モーダル → 「送信する」で、フロントは次を実行します：
  1. `localStorage` に保存
  2. `config.js` の `subscribeEndpoint`（= `/api/subscribe`）へ `POST {email, type}`
  3. 確認シート「確認メールを送信しました」を表示 → OKで取扱説明書を解除
- つまり **`/api/subscribe` を実装すれば、保存＆送信が動きます。**
- ひな形あり：`api/subscribe.js`（TODOコメントの通りに実装）

---

## Claude Code への依頼内容（コピペ用）

> Vercelにデプロイする静的サイトです。`api/subscribe.js`（Vercel Serverless Function）を実装してください。
> 仕様：
> 1. `POST /api/subscribe`、body は `{ email, type }`。
> 2. email をバリデーションし、**保存**する（保存先は Vercel KV を推奨。なければ Google Sheet か Airtable）。同じメールの重複登録は1件にまとめる。
> 3. 登録者に**確認メール**を送る（Resend を推奨）。件名・本文は日本語で、Mingleのトーンで。
> 4. 管理者通知メール（任意）を `ADMIN_NOTIFY_EMAIL` に送る。
> 5. 環境変数で APIキー等を扱う（コードに直書きしない）。
> 6. 成功時 `{ ok: true }`、失敗時は適切なエラーコードを返す。
> フロント（HTML/CSS/JS）は変更しないでください。

---

## 必要なアカウント / 環境変数（あなたが用意）

| 用途 | サービス（推奨） | 環境変数 |
|---|---|---|
| メール送信 | [Resend](https://resend.com)（無料枠あり） | `RESEND_API_KEY` / `MAIL_FROM` |
| 保存 | Vercel KV（Vercel内で完結） | （Vercelが自動設定） |
| 管理者通知 | 任意 | `ADMIN_NOTIFY_EMAIL` |

- 環境変数は **Vercel → Settings → Environment Variables** に入れます（Claude Codeが手順を案内できます）。
- `MAIL_FROM` を `@mingleapp.jp` で送るには、Resendで **mingleapp.jp のドメイン認証（DNSにレコード追加）** が必要。お名前.comで設定します。

---

## デプロイ手順（おさらい）

1. この `release/` の中身を **GitHubリポジトリ** に置く（推奨）
2. Vercel で「Import Git Repository」→ Deploy
3. `shindan.mingleapp.jp` を Domains に追加 → お名前.comにCNAME設定
4. 環境変数を設定 → 再デプロイ
5. 診断 → メール送信 → 受信BOXに確認メールが届けば完成 🎉

> GitHubに置けば、**今後このツール（Claude Design）でデザインを直して `release/` を更新 → GitHubにpushするだけで自動再デプロイ** されます。
