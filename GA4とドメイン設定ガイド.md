# GA4（アクセス解析）と 独立サブドメイン公開ガイド

このページに **Googleアナリティクス4（GA4）** を入れて、管理者だけが
「どのタイプが多かったか」「何問目で離脱したか」「登録まで行ったか」を見られるようにする手順と、
**shindan.mingleapp.jp** で公開するためのDNS設定手順です。

---

## A. GA4の導入（管理者だけが閲覧）

GA4の管理画面は **Googleアカウントでログインした人だけ** が見られます。一般の利用者には一切見えません。

### 1. 測定IDを発行
1. https://analytics.google.com/ にアクセス（会社のGoogleアカウントで）
2. 管理 → 「プロパティを作成」→ ウェブ → データストリームを追加
   - ウェブサイトURL：`https://shindan.mingleapp.jp`
   - ストリーム名：Mingle 友達タイプ診断
3. 発行される **測定ID `G-XXXXXXXXXX`** を控える

### 2. このサイトに測定IDを入れる
`config.js` の `ga4Id` に貼り付けるだけ：
```js
window.MINGLE_CONFIG = {
  ...
  ga4Id: "G-XXXXXXXXXX",   // ← ここに発行された測定IDを入れる
};
```
これで計測が有効になります（空のままなら計測オフ）。

### 3. 閲覧者を制限したい場合
GA4プロパティの「管理 → プロパティのアクセス管理」で、見せたい人のGoogleアカウントだけを
招待します。招待していない人は数値を見られません。

### 4. 何が見えるか（送信しているイベント）
GA4の「レポート → エンゲージメント → イベント」や「探索」で確認できます。

| イベント名 | 意味 | 付随データ |
|---|---|---|
| `quiz_start` | 「診断をはじめる」を押した | — |
| `question_view` | 各設問の表示 | `question_no`(1〜12) ← **離脱地点** |
| `question_answer` | 各設問の回答 | `question_no`, `value`(1〜6) |
| `analyzing` | 分析演出に到達 | — |
| `result_view` | 結果を表示 | `type_id`, `type_name`, `type_code` ← **タイプ別の多寡** |
| `email_register` | メール登録で取扱説明書を解除 | `type_id` ← **登録到達** |
| `cta_preregister` | 結果末尾「事前登録する」クリック | — |
| `share` | シェア | `method`(x / line / image) |
| `view_types` | 16タイプ一覧を見た | — |

**よく見る指標の作り方（GA4の「探索」→「目標到達プロセス」）**
- ステップ：`quiz_start` →（`question_view` の question_no 別）→ `result_view` → `email_register`
  - これで「12問のどこで脱落したか」「結果まで来た人のうち何%が登録したか」が一目で分かります。
- `result_view` を `type_code` で内訳表示 → **どのタイプが多いか** の分布。

> 補足：リアルタイムに動作確認したいときは、GA4の「管理 → DebugView」。
> `index.html` を開いたブラウザのコンソールで `window.MINGLE_DEBUG_ANALYTICS = true` にすると、
> 送信イベントがコンソールにも出ます（本番では無害）。

---

## B. shindan.mingleapp.jp で公開する（DNS設定）

`mingleapp.jp` のサブドメイン `shindan` を、このサイトのホスティング先に向けます。
**まずホスティング（Cloudflare Pages / Netlify / Vercel など）にこのフォルダをアップロード**し、
そのサービスが指定する「向け先」をDNSに登録します。

### 手順（添付のDNS設定画面＝レコード追加 を使う場合）

ホスティング先が **ホスト名（例 `xxxx.pages.dev`）** を指定する場合 → **CNAME** を1件追加：

| 項目 | 入力する値 |
|---|---|
| ホスト名 | `shindan` （`.mingleapp.jp` は自動で付く） |
| TYPE | **CNAME** |
| TTL | 3600（既定のまま可） |
| VALUE | ホスティングが指定した向け先（例 `mingle-shindan.pages.dev`）|
| 状態 | 有効 |

→「追加」→「確認画面へ進む」で保存。

もしホスティング先が **IPアドレス** を指定する場合は、TYPE を **A** にして VALUE にそのIP（例 `192.0.2.10`）を入れます（添付画面のAレコード欄＝4つの数字ボックス）。

> どちらになるかは使うホスティングによります。一般的には：
> - **Cloudflare Pages / Netlify / Vercel** → CNAME（ホスト名を指定される）
> - 自前サーバ / VPS / レンタルサーバの固定IP → A（IPを指定される）

### 反映
DNSは反映に数分〜最大48時間。多くは15分ほど。ホスティング側で「カスタムドメイン：shindan.mingleapp.jp」を追加し、**HTTPS証明書が自動発行**されれば完了です。

### 公開後にやること（このサイト側）
`config.js` の `diagnoseUrl` を公開URLに：
```js
diagnoseUrl: "https://shindan.mingleapp.jp",
```
`index.html` のOGP画像も絶対URLに：
```html
<meta property="og:image" content="https://shindan.mingleapp.jp/assets/share/ogp-default.png">
<meta name="twitter:image" content="https://shindan.mingleapp.jp/assets/share/ogp-default.png">
```

---

## C. リリース後の修正について（Claude Code）

はい、**リリース後の修正はClaude Codeに投げて対応できます。** このサイトは普通のHTML/CSS/JS（特殊なビルド不要）なので、フォルダを渡せば修正・追加できます。よくある依頼例：

- 文言・設問・タイプ説明の修正 → `types-data.js` / `flow.js`
- 配色・余白・装飾の調整 → `result-page.css` / `flow.css`
- 計測イベントの追加 → `analytics.js` 経由で `MingleTrack('イベント名', {...})` を仕込む
- 新しいシェア面、OGP差し替え → `share-image.js` / `assets/`

修正後は、このフォルダ一式を再アップロードするだけで反映されます（GA4の測定IDやドメインはそのまま引き継がれます）。
