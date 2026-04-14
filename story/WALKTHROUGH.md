# 蟠龍閣 ARG デバッグ用攻略フロー

> テスト・デバッグ専用。ネタバレ注意。

---

## リセット手順

ブラウザコンソールで実行:
```javascript
ARG.brReset()
// → localStorage全消去 + index.html にリダイレクト
```

個別確認:
```javascript
ARG.getLevel()       // 現在のLv（0〜5）
ARG.getFlags()       // 取得済みフラグ一覧
```

消去されるlocalStorageキー:
| キー | 内容 |
|---|---|
| `br_level` | 調査レベル |
| `br_flags` | 発見フラグ配列（JSON） |
| `br_referral` | 招待コード解放済みフラグ |
| `blog_pass_unlocked` | ブログPASSウィジェット解除済みフラグ |
| `br_clear_date` | 全クリ日時 |

---

## STEP 0：招待コード入力（Lv0）

**場所:** `index.html` → RECERVEセクション

**ヒント元（ゲーム内）:** いずもブログ「年が明けた」（2026.01.07）
> 「まずお店の名前をちゃんと知っておいてほしい。それが、最初の言葉になる。」

補助ヒント（UI）: 入力欄placeholder「お店の名前または紹介コードを入力...」/ 欄外「このお店の名前を、言葉にできる方をお待ちしています。」

**入力値:**
```
BANRYUKAKU
（大文字小文字不問。内部でtoUpperCase処理）
```

**結果:** 検索バーが出現。`br_referral` に `1` を書き込み。

**備考:** `?ref=1` URLパラメータでもSTEP0をスキップして検索バー解放。

---

## STEP 1：Lv0 → Lv1

**ヒント元:** `cast.html` でゆめが「長期お休み中」と表示されている。

### 1-A: ゆめ通達を発見

| 検索ワード | 到達ページ | 取得フラグ |
|---|---|---|
| `ゆめ` または `夢` | `hidden/yume-notice.html` | `found_yume_notice` |

ページ末尾に `[buffer04.dat]` のテキストあり（次のワードへの誘導）。

### 1-B: 復元ファイルを発見 → **Lv1到達**

| 検索ワード | 到達ページ | 取得フラグ |
|---|---|---|
| `復元` / `復元ファイル` / `buffer04.dat` | `hidden/yume-draft.html` | `found_yume_draft` |

このページ到達でLv1に昇格。Lv上昇オーバーレイ（1500ms表示）→ 遷移。

**yume-draft.htmlの重要情報:**
- 管理番号 `YM-2023-04`（次ステップへの誘導）
- 「壁の案内に023があった」（MAP-RY-023の伏線）
- 「龍を探すなら、秋葉原にいる。」

---

## STEP 2：Lv1 → Lv2（3フラグ先行 + 龍牌会）

3ワード発見後に龍牌会が解放される構造。3ワードは順不同で可。

### 2-A〜C: 3方向調査（順不同）

| 検索ワード | 到達ページ | 取得フラグ | ヒント元 |
|---|---|---|---|
| `YM-2023-04` | `hidden/yume-rireki.html` | `found_yume_rireki` | yume-draft の管理番号 |
| `黒瀬` | `hidden/kurose-shiji.html` | `found_kurose` | yume-rireki の「黒瀬係長より打診」 |
| `失敗作` | `hidden/yume-finallog.html` | `found_yume_finallog` | yume-rireki の最終判定 |

各発見時: 「調査は3方向から進行中。残り: X件」と表示（1200ms後遷移）。

### 2-D: 龍牌会チャートを発見 → **Lv2到達**

**前提フラグ:** `found_yume_rireki` + `found_kurose` + `found_yume_finallog` の3つ全て  
**未達時:** 「アクセス拒否。調査が不足しています。」

| 検索ワード | 到達ページ | 取得フラグ |
|---|---|---|
| `龍牌会` | `hidden/ronpaikai-chart.html` | `found_ronpaikai` |

このページ到達でLv2に昇格。Lv上昇オーバーレイ（1500ms）→ 遷移。

---

## STEP 3：Lv2 → Lv3（4ワード、順不同）

4つ全て揃った時点でLv3。最後の1つを発見したタイミングでLv3昇格。

| 検索ワード | 到達ページ | 取得フラグ | ヒント元 |
|---|---|---|---|
| `MAP-RY-023` | `hidden/basement-map.html` | `found_basement_map` | yume-draft「023があった」＋access.htmlの龍マークポップアップ |
| `廃棄処理室` | `hidden/disposal-room-log.html` | `found_disposal_room` | basement-map の「廃棄処理室」区画名 |
| `BRK-DSP-2026-0103` | `hidden/disposal-record.html` | `found_disposal` | disposal-room-log の処理区分列（`found_disposal_room`前提） |
| `次代の総龍` | `hidden/selection-criteria.html` | `found_selection` | ronpaikai-chart の「組織の目的：次代の総龍を発見・育成」 |
| `龍牌会の端末` または `管理端末` | `hidden/admin-console.html` | `found_admin_console` | basement-map の「管理端末室」区画 |

※ Lv3はこの5ワード中4フラグ（`found_basement_map` / `found_disposal` / `found_selection` / `found_admin_console`）で到達。`found_disposal_room`は中間フラグ。

Lv3到達後: Lv上昇オーバーレイ（1500ms）＋ Lv3成功メッセージ（700ms）→ 遷移。  
Lv3以降はLv3+演出（`SEARCH_OK_LV3` ランダムメッセージ / 右下モニター行）が有効になる。

---

## STEP 4：ブログPASS解放（LEMON）

Lv3以降、各ブログのPASSウィジェットが金色にglow強調される。

**ヒント元（2か所）:**
- なのブログ「あるワードで笑ってしまった」（2026.02.15）
  > 「キャラクターが『ウーロンハイにカットレモン』って注文するシーンがあって。うちの内勤さんがよく飲んでるやつだ。」
- みじゅブログ「バレンタインイベント前夜」（2026.02.22）
  > 「内勤さん、いつもシフト中にウーロンハイにカットレモン飲んでるんですよね。」

**操作:** ブログサイドバーのパスワード欄に `LEMON` を入力

**結果:**
1. UNLOCKEDオーバーレイ（800ms）
2. 鍵記事がフェードイン表示
3. ゆめのブログリンクが金色glow強調
4. `blog_pass_unlocked` = `1`（localStorage）
5. ARGフラグ `found_blog_unlocked` 追加

---

## STEP 5：RENPAI発見 → Lv4到達

**前提フラグ:** `found_blog_unlocked`  
**未達時:** 「不正なアクセスです。先に表層の記録を参照してください。」

**ヒント元（2か所）:**
- ちゃきブログ（鍵記事）
  > 「ぱっと見は普通の日記に見えると思う。それって、ぱっと見じゃない読み方があるってこと…？」
- なのブログ（鍵記事「ゆめちゃんのこと」）
  > 「普通に読むのとはちょっと違う見方をすると、何かが見えてくるような気がする」

**ゆめブログ最終投稿「たいせつなこと」の縦読み:**
```
れ んらく、したかったけど、うまくできなかった。
ん ー、でもこれだけは残しておきたかった。
ぱ っと見は普通の日記に見えると思う。
い つかここに来た人への、手紙だよ。
→ れんぱい = RENPAI
```

確信サポート: コメント欄（最下部）に「縦に読んでみたら……れ、ん、ぱ、い？」のヒントあり。

**操作:** 検索バーで `RENPAI` または `renpai`

**結果:** `hidden/backdoor.html` へ遷移。`found_renpai` フラグ追加。Lv4昇格オーバーレイ（1500ms）。

---

## STEP 6：全クリ（Lv4 → Lv5）

**前提:** Lv4以上（`found_renpai` フラグ保持）

**操作手順:**
1. `hidden/admin-console.html` を開く
2. 引き継ぎコード入力欄に `RENPAI` を入力
3. 「[SYS] TRANSFER COMPLETE — 総龍継承 確認済み」が表示
4. 「システム引き継ぎを実行する」ボタンをクリック
5. `hidden/hack-sequence.html` → `hidden/hack-complete.html` → `hidden/final.html`

**結果:**
- `admin_transfer_complete` フラグ追加
- `br_clear_date` に現在日時を記録
- `br_level` = 5
- 全クリ後: 各ブログに隠し記事が出現（ちゃき・なの・いずも）
- final.htmlに `#蟠龍閣 #次の龍` + 招待リンク生成ボタン

---

## フラグ・Lv対応表

| フラグ名 | 取得条件 | Lv昇格 |
|---|---|---|
| `found_yume_notice` | `ゆめ`/`夢` 検索 | — |
| `found_yume_draft` | `復元`/`buffer04.dat` 検索 | Lv1 |
| `found_yume_rireki` | `YM-2023-04` 検索 | — |
| `found_kurose` | `黒瀬` 検索 | — |
| `found_yume_finallog` | `失敗作` 検索 | — |
| `found_ronpaikai` | `龍牌会` 検索（3フラグ前提） | Lv2 |
| `found_basement_map` | `MAP-RY-023` 検索 | Lv3（4フラグ目到達時） |
| `found_disposal_room` | `廃棄処理室` 検索 | —（中間フラグ） |
| `found_disposal` | `BRK-DSP-2026-0103` 検索（`found_disposal_room`前提） | 同上 |
| `found_selection` | `次代の総龍` 検索 | 同上 |
| `found_admin_console` | `龍牌会の端末`/`管理端末` 検索 | 同上 |
| `found_blog_unlocked` | ブログPASS `LEMON` 入力 | — |
| `found_renpai` | `RENPAI` 検索（`found_blog_unlocked` 前提） | Lv4 |
| `admin_transfer_complete` | admin-consoleでRENPAI入力（Lv4必須） | Lv5 |

---

## 検索ワード一覧（エイリアス含む）

| ワード | 遷移先 | 備考 |
|---|---|---|
| `ゆめ` / `夢` | yume-notice.html | |
| `復元` / `復元ファイル` / `buffer04.dat` | yume-draft.html | |
| `YM-2023-04` | yume-rireki.html | |
| `黒瀬` | kurose-shiji.html | |
| `失敗作` | yume-finallog.html | |
| `龍牌会` | ronpaikai-chart.html | 3フラグ前提 |
| `MAP-RY-023` | basement-map.html | |
| `廃棄処理室` | disposal-room-log.html | |
| `BRK-DSP-2026-0103` | disposal-record.html | `found_disposal_room` 前提 |
| `次代の総龍` | selection-criteria.html | |
| `龍牌会の端末` / `管理端末` / `龍牌会 端末` | admin-console.html | |
| `RENPAI` / `renpai` | backdoor.html | `found_blog_unlocked` 前提 |

---

## クイックデバッグコマンド

```javascript
// 現状確認
ARG.getLevel()
ARG.getFlags()
localStorage.getItem('blog_pass_unlocked')

// 特定フラグを手動で立てる（STEP飛ばし）
ARG.addFlag('found_yume_rireki')
ARG.addFlag('found_kurose')
ARG.addFlag('found_yume_finallog')
ARG.addFlag('found_blog_unlocked')

// レベルを直接セット
ARG.setLevel(3)

// 全リセット
ARG.brReset()
```

---

## 進捗バー（hidden/ページ左下）

```
調査進捗 ████████░░ 80%
```

カウント対象フラグ（10個）:
`found_yume_notice` / `found_yume_draft` / `found_kurose` / `found_yume_rireki` / `found_yume_finallog` / `found_ronpaikai` / `found_basement_map` / `found_admin_console` / `found_renpai` / `admin_transfer_complete`
