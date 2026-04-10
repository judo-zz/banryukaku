# CYBER CHINA ✦ 蟠龍閣 — プロジェクトメモ

最終更新: 2026-04-10

---

## プロジェクト概要

**秋葉原を舞台にした、高級コンカフェをフィクションとして見せるARG（Alternate Reality Game）サイト。**

表向きは普通の高級コンカフェの公式サイト。しかし注意深くサイト内を調査すると、キャスト「ゆめ」が失踪した事件の痕跡が見えてくる。プレイヤーは調査を進めるうちにサイトの「裏側」に到達し、最終的にARGのゴール画面（`/final/`）へ辿り着く。

- **サイト名**: CYBER CHINA ✦ 蟠龍閣
- **ジャンル**: ARG / ミステリー / サイバーパンク和風
- **ロケーション（フィクション）**: 東京・秋葉原 B1F
- **デプロイ先**: GitHub Pages（予定）→ 後に独自ドメイン取得予定

---

## ARGのストーリー

| 登場人物 | 説明 |
|----------|------|
| ゆめ | 蟠龍閣に在籍していた新人キャスト。2024年11月に突然「不在」となる。個人ブログを残しており、そこに失踪の手がかりが書かれている |
| 梨子 | 先輩キャスト。ゆめの質問を「気にしすぎ」と笑い飛ばしたが、目が笑っていなかった |
| 蒼 | キャスト。ゆめに「聞かない方がいい」と警告した |
| 龍務局 | 蟠龍閣の内部組織。「静寂処置」などを行う謎の管理部門 |

**事件の経緯（フィクション）**

1. ゆめが2024年9月に蟠龍閣に入店
2. 10月ごろからB3F施設や「蟠龍体系」の存在に気づき始める
3. 個人ブログに記録を残す（秘密保持義務違反の疑い）
4. 2024年11月3日に「静寂処置」を受ける → 処分報告書に記録される
5. 翌11月4日付で最後の日記が残される

---

## investigationLevel（進行システム）

プレイヤーの調査進度を **Lv.0〜5** で管理する。`localStorage` に保存し、ページをまたいで共有される。

| レベル | ラベル | 意味 |
|--------|--------|------|
| Lv.0 | 表の顔 | 初回訪問。普通のコンカフェサイトに見える |
| Lv.1 | 違和感の始まり | 何かがおかしいと気づいた |
| Lv.2 | 扉の向こう | 情報を集め始めた |
| Lv.3 | 内部文書へ | 組織の内側を見てしまった |
| Lv.4 | システム侵入 | バックドアを突破した |
| Lv.5 | 龍の目覚め | ARGクリア。蟠龍の縁者となった |

### CSS への反映

レベルが上がると2つの仕組みで見た目が変わる：

- `<html data-level="N">` → `assets/css/main.css` のセレクタ `[data-level="N"]` が機能する
- `<body class="lvN">` → `design-system.css` の `.lvN` セレクタが機能する

両方が同期して動く（`investigation.js` の `_brApplyDOM()` で管理）。

### localStorage キー

| キー | 内容 |
|------|------|
| `banryu_level` | 現在のレベル（0〜5） |
| `banryu_flags` | JSON配列。発見済みフラグの一覧 |

### フラグ命名規則

| フラグ名 | 発生条件 |
|----------|----------|
| `secret_index_yume` | index.html の白文字を選択 |
| `secret_cast_yume` | cast.html のゆめ周辺の白文字を選択 |
| `secret_menu_note` | menu.html の白文字を選択 |
| `secret_recruit_code` | recruit.html の白文字を選択 |
| `secret_access_dragon` | access.html の白文字を選択 |
| `hero_longpress` | index.html のHEROを3秒長押し |
| `index_3min` | index.html に3分滞在 |
| `recruit_bottom` | recruit.html を95%スクロール |
| `yume_timer_30s` | yume/index.html に30秒滞在 |
| `access_dragon_found` | access.html の隠し龍マーカーをクリック |

---

## ファイル構成

```
banryukaku/
│
├── MEMO.md                    ← このファイル
├── robots.txt                 ← /yume/ へのヒントを埋め込み
│
├── index.html                 ← TOPページ（コンカフェ表向き）
├── index.css
├── cast.html                  ← キャスト紹介（ゆめが「不在」）
├── cast.css
├── menu.html                  ← メニュー（特別カクテルに長押しトリガー）
├── recruit.html               ← 求人（応募条件の縦読みでRENPAI）
├── access.html                ← アクセス（地図に隠し龍マーカー）
│
├── design-system.css          ← デザイントークン・Lv別スタイル（.lv0〜.lv5）
├── main.js                    ← ナビ・スクロールリビール・ARGトリガー
│
├── assets/
│   ├── css/
│   │   └── main.css           ← ARGレベル別フィルター等（[data-level="N"]）
│   └── js/
│       ├── investigation.js   ← ARGコアシステム（レベル管理・全トリガー）
│       └── effects.js         ← ビジュアル・サウンドエフェクト
│
├── yume/
│   ├── index.html             ← ゆめの個人ブログ（日記が壊れていく）
│   └── yume.css
│
├── report/
│   ├── index.html             ← 内部文書「処分報告書」
│   └── report.css
│
├── hack/
│   ├── index.html             ← バックドア端末（マトリックス風CLI）
│   ├── hack.css
│   └── hack.js
│
└── final/
    ├── index.html             ← ARGゴール（黒と金の就任画面）
    ├── final.css
    └── final.js
```

---

## ARG進行フロー

```
[Lv.0] 初回訪問
    │
    ├─ index.html の HERO を3秒長押し → Lv.1
    ├─ index.html に3分以上滞在 → Lv.1
    └─ yume/ に到達しただけで → Lv.1

[Lv.1] 違和感の始まり
    │
    ├─ 白文字テキストを2箇所以上選択 → Lv.2
    │   (index.html / cast.html / menu.html / recruit.html / access.html)
    └─ index.html で予約フォームに BANRYU-0001 を入力 → Lv.2

[Lv.2] 扉の向こう
    │
    ├─ yume/ に30秒以上滞在 → Lv.3
    ├─ report/ に訪問 → Lv.3
    └─ recruit.html を95%スクロール → Lv.3

[Lv.3] 内部文書へ
    │
    └─ menu.html の特別カクテルを3秒長押し → パスワードモーダル
           ↓ RENPAI を入力
       → Lv.4 → hack/ へリダイレクト

[Lv.4] システム侵入
    │
    └─ hack/ の CLI に RENPAI を入力
       → Lv.4確定 → 3秒後 final/ へリダイレクト

[Lv.5] 龍の目覚め（ARGクリア）
    └─ final/ に到達 → brSetLevel(5)
```

---

## 各ページの実装詳細

### index.html — TOPページ

| 要素 | 詳細 |
|------|------|
| 白文字 | `<span data-secret="index_yume">` — ゆめへの言及 |
| 長押しトリガー | HEROセクションを3秒長押し → `brTryLevel(1)` |
| 滞在タイマー | 3分滞在 → `brTryLevel(1)` |
| 予約フォーム | `BANRYU-0001` 入力 → `brTryLevel(2)` |
| DevTools | ヒント: `/yume/` を調べろ |

### cast.html — キャスト紹介

| 要素 | 詳細 |
|------|------|
| ゆめカード | `現在不在` 表示・黒いサイレント状態 |
| HTMLコメント | `<!-- 2024.11.03 status: INACTIVE. see /report/ -->` |
| 白文字 | `<span data-secret="cast_yume">` — ゆめの消息 |
| Lv2以上 | DevTools: `/report/` を調べろとヒント |

### menu.html — メニュー

| 要素 | 詳細 |
|------|------|
| 特別カクテル | `id="specialCocktail"` を3秒長押し → パスワードモーダル |
| パスワード | `RENPAI`（btoa: `UkVOUEFJ`） → `brTryLevel(4)` → `hack/` へ |
| 白文字 | `各ページの頭文字を繋げよ：R———AI` |

### recruit.html — 求人

| 要素 | 詳細 |
|------|------|
| 縦読み | 6条件の頭文字 `RELIABILITY / EXCELLENCE / NIGHT / PRIVACY / ABSOLUTE / INITIATION` → **RENPAI** |
| スクロール | 95%到達 → `brInitScrollDepth(95, 'recruit_bottom', 3)` |
| 応募ボタン | クリックでタイトル変更 → 2秒後トップへスクロール（フィクション） |
| 白文字 | `各条件の頭文字を繋げよ：RENPAI` |

### access.html — アクセス

| 要素 | 詳細 |
|------|------|
| 地図 | プレースホルダー（600×400px）。CSSで抽象地図を描画 |
| 隠し龍マーカー | 地図右下、透明度8%の龍SVG → クリックで発光・コード表示 |
| 発見コード | `MAP-RY-023-DRAGON` → `brAddFlag('access_dragon_found')` + `brTryLevel(2)` |
| 白文字 | `地図の中に龍が隠れている` |

### yume/index.html — ゆめのブログ

| 要素 | 詳細 |
|------|------|
| 到達 | 訪問だけで `brTryLevel(1)` |
| 滞在 | 30秒 → `brInitPageTimer(30, 'yume_timer_30s', 3)` |
| 内容 | 4つの日記。最後の記事（11/04）が最も壊れている |
| フッター | Lv.2以上で `/report/` へのリンクが出現 |
| HTMLコメント | `<!-- 次は /report/ を見てください -->` |

### report/index.html — 処分報告書

| 要素 | 詳細 |
|------|------|
| 到達 | 訪問で `brTryLevel(3)` |
| 内容 | ゆめへの「静寂処置」の内部文書。AA機密指定 |
| 隠しメモ | `>> パスワード: BANRYU-0001` と `/final/` へのヒント |
| DevTools | 次は `/hack/` へ、パスワードはRENPAI |

### hack/index.html — バックドア端末

| 要素 | 詳細 |
|------|------|
| 外観 | マトリックス風の黒緑ターミナル |
| パスワード | `RENPAI`（btoa: `UkVOUEFJ`） |
| 正解後 | `brTryLevel(4)` → 3秒後 `final/` へリダイレクト |
| CLIコマンド | `help / ls / cat [file] / cd [dir] / clear` が実機能する |

### final/index.html — ARGゴール

| 要素 | 詳細 |
|------|------|
| 外観 | 黒と金の荘厳な「就任画面」 |
| 到達 | `brSetLevel(5)` で強制Lv.5に |
| ユーザーコード | `BANRYU-████`（JS生成の擬似固有コード） |
| SNS誘導 | `#蟠龍閣 #龍の目覚め` |

---

## 主要ファイルのAPI

### investigation.js — 公開API

```javascript
brGetLevel()                          // 現在レベル取得（0〜5）
brSetLevel(n)                         // レベルを強制設定
brTryLevel(target)                    // target-1 なら上げる（スキップ不可）
brAddFlag(flagName)                   // フラグ追加
brHasFlag(flagName)                   // フラグ確認
brSecretCount()                       // secret_ 系フラグの数

// トリガー初期化（各ページのDOMContentLoadedで呼ぶ）
brInitSecret(secretId, onFound)       // 白文字選択検出
brInitLongPress(sel, flag, cb, ms)    // 長押し検出（デフォルト3000ms）
brInitScrollDepth(pct, flag, lvTarget)// スクロール深度
brInitPageTimer(sec, flag, lvTarget)  // ページ滞在時間
brInitSiteTimer(min, flag)            // サイト通算滞在時間
brInitConsoleHint(msg)                // DevTools コンソールにヒント表示
brInitPasswordGate(inSel, btnSel, encodedPw, onSuccess) // パスワード認証

// デバッグ（ブラウザコンソールから）
brReset()                             // 全リセット（Lv.0・フラグ全消去）
```

### effects.js — ビジュアルエフェクト

```javascript
brPlayGlitch()                        // グリッチ音（Web Audio API）
brGlitchText(el, targetText, ms)      // 文字化け→解読アニメ
brTypewriter(el, text, msPerChar, cb) // タイプライター
brCRTFlash(color, ms)                 // 全画面カラーフラッシュ
brPageShake(ms)                       // 画面揺れ
brStartMatrixRain(canvasId)           // Canvasマトリックス降雨
```

---

## パスワード一覧

| 場所 | パスワード | エンコード（btoa） | 用途 |
|------|-----------|-------------------|------|
| `index.html` 予約フォーム | `BANRYU-0001` | — | Lv.2解放 |
| `menu.html` 長押し後 | `RENPAI` | `UkVOUEFJ` | Lv.4解放 → hack/ |
| `hack/index.html` CLI | `RENPAI` | `UkVOUEFJ` | Lv.4確定 → final/ |
| `report/index.html` 内部文書 | `BANRYU-0001` | — | final/ への扉ヒント |

> **注**: btoa('RENPAI') === 'UkVOUEFJ'

---

## 隠し要素一覧

| 場所 | 仕掛け | 発見方法 |
|------|--------|----------|
| `index.html` | 白文字テキスト | テキストを全選択 |
| `cast.html` | ゆめの白文字 + HTMLコメント | 選択 / ソース確認 |
| `menu.html` | 白文字「各ページの頭文字を繋げよ」 | テキストを全選択 |
| `recruit.html` | 条件の縦読みRENPAI + 白文字 | 注意深く読む / 全選択 |
| `access.html` | 龍マーカー（opacity: 0.08） | 地図右下をよく見る |
| `yume/` | フッターHTMLコメント | ソース確認 |
| `robots.txt` | `# ゆめへ / # /yume/` | robots.txt を直打ち |
| 全ページ | DevTools コンソールにヒント | F12 → Console |

---

## 画像プレースホルダー

実装時は以下のサイズで画像を用意・差し替える。

| ページ | 要素 | 推奨サイズ | 差し替え箇所 |
|--------|------|-----------|-------------|
| `index.html` | ヒーロー背景 | 1920×1080px | `.hero-bg` の `background-image` |
| `cast.html` | キャスト写真（5名） | 400×500px | `.cast-photo` の `background-image` |
| `menu.html` | ドリンク写真（4種） | 400×300px | `.menu-card__img` の `background-image` |
| `menu.html` | フード写真（2種） | 400×300px | 同上 |
| `access.html` | 地図 | 600×400px | `.map-placeholder` ごと `<iframe>` or `<img>` に置換 |
| `final/` | 背景パーティクル | — | CSSアニメで代替済み（差し替え不要） |

---

## デプロイ

### GitHub Pages

1. `banryukaku/` ディレクトリをリポジトリのルートとして公開
2. Settings → Pages → Source: main branch / root
3. URL: `https://[username].github.io/[repo-name]/`

### 独自ドメイン（予定）

1. ドメイン取得後、`CNAME` ファイルをリポジトリルートに配置
2. DNS設定でGitHub PagesのIPを指定
3. GitHub Pages設定でカスタムドメインを入力・HTTPS有効化

---

## デバッグ方法

ブラウザのコンソールで以下を実行できる：

```javascript
brGetLevel()        // 現在のレベル確認
brSetLevel(3)       // 強制的にLv.3に設定
brReset()           // 全リセット（Lv.0に戻す）
JSON.parse(localStorage.getItem('banryu_flags'))  // フラグ一覧確認
```

---

## 今後のTODO

- [ ] 実際の画像を用意して各プレースホルダーを差し替え
- [ ] access.html の地図を実地図（Google Maps埋め込み or 手書きSVG）に差し替え
- [ ] GitHubリポジトリ作成 → GitHub Pagesへデプロイ
- [ ] 独自ドメイン取得・設定
- [ ] OGP画像の作成（SNSシェア時のサムネイル）
- [ ] SP（スマホ）での動作確認・調整
- [ ] final.js のユーザーコード生成ロジック確認（BANRYU-████ の个別化）
- [ ] cast.html の他キャスト（みじゅ・ちゃき・なの・よすず）に白文字秘密を追加するか検討
- [ ] hack.js の CLI コマンドに ARG ヒントを仕込むか検討
