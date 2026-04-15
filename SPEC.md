# 蟠龍閣 ARGサイト仕様書

## 0. 対象と前提

- 対象ディレクトリ: `/Users/judomac/claude/banryukaku`
- 読み込み対象:
  - `arg.js`
  - `hidden/*.html` 全25ファイル
  - `blog/*.html` 全5ファイル
  - `index.html`
- 本書は「現在の実装仕様」を記述する。設計意図に加えて、実装上の癖や不整合もそのまま記録する。

## 1. 世界観・コンセプト

蟠龍閣は表向きには「秋葉原のネオチャイナ系コンカフェ」のWebサイトだが、実体は龍牌会が「次代の総龍」を選定するための観測・誘導システムである。  
表サイト、キャストブログ、検索UI、地下資料、バックドア、管理端末までが一続きの選定装置として機能している。

中核設定は以下の通り。

- 龍牌会は「真の継承者は内部では育たず、外から自発的に来る」という思想で動く。
- 蟠龍閣は、その継承者候補を自然に見つけるための表層施設。
- ゆめは候補 `#023 / YM-2023-04` として選定されたが、`ORIGIN` 基準を満たせず「失敗作」と判定され廃棄された。
- ゆめは自分が継承者になれないと理解した上で、次に外から来る者のために導線を残した。
- プレイヤーはその痕跡を辿ることで、失踪事件の調査者から「次代の総龍」へ再定義される。

体験の軸は「失踪したキャストを追う調査」から「自分自身が選定対象だったと知る継承」への転換である。

## 2. プレイヤーの体験フロー（Lv0→Lv5）

### Lv0: 表サイト侵入前

- 開始地点は `index.html`。
- 検索バーは `br_referral` がない限り CSS で即時非表示。
- 解除方法は2通り。
  - 紹介コード `BANRYUKAKU` を予約欄で入力。
  - `?ref=1` 付きURLでアクセス。
- 解放後、検索欄に一瞬 `ゆ...` と表示され、最初の検索語を誘導する。

### Lv1: ゆめの痕跡を見つける

- `ゆめ` / `夢` で `hidden/yume-notice.html`。
- 末尾の `buffer04.dat` を見つけ、`復元` / `復元ファイル` / `buffer04.dat` で `hidden/yume-draft.html`。
- ここで「番号」「黒瀬」「023」「失敗作」が示される。
- Lv1到達時タイトルサフィックスは `——龍、目覚む`。

### Lv2: ゆめの実態を調べる

- `YM-2023-04` で在籍記録。
- `黒瀬` でメールログ。
- `失敗作` で最終ログ。
- この3方向は `arg.js` 上で特別扱いされ、新規発見時に「残り何件」の進捗メッセージが出る。
- 3本が揃うと:
  - `選定審査` が解放。
  - `龍牌会` が解放。
- Lv2到達時タイトルサフィックスは `——深淵を覗く`。

### Lv3: 組織構造と地下施設を把握する

- `失敗作` 側から `MAP-RY-023`、`廃棄処理室`、`BRK-DSP-2026-0103`、`長岡`、`百瀬` へ伸びる。
- `龍牌会` 側から `記録保管室`、`長谷川`、`第三区画` / `施錠棚` へ伸びる。
- `shelve-lock.html` は検索ではなくダイヤル錠ギミック。正解は `020`。
- 開錠すると退籍キャスト `ソラ` の登録票が出る。
- Lv3以降は検索成功/失敗文言が監視システム風に変化し、右下に monitor 行が出る。
- Lv3到達時タイトルサフィックスは `——真実の螺旋`。

### Lv4: ゆめの仕込んだ裏導線に乗る

- ブログ群で `MEMBER PASS` を解く。パスワードは `LEMON`。
- 解放後、`ゆめのブログ` が見える。
- ゆめの最終記事は縦読みで `れ / ん / ぱ / い`。
- `RENPAI` / `renpai` で `hidden/backdoor.html`。
- バックドアから「管理端末にアクセスできる」「選定基準を読め」と明示される。
- `lore-03` 以降もLv4で閲覧可能になり、候補 #020 / #021 / #023 / #024 の系譜が補強される。
- Lv4到達時タイトルサフィックスは `——禁忌の回廊`。

### Lv5: 継承完了

- `admin-console.html` の承認コードは `SORA`。
- 正答かつLv4以上で:
  - `admin_transfer_complete` が立つ。
  - `br_clear_date` が記録される。
  - Lv5へ上がる。
- その後 `hack-sequence.html` → `hack-complete.html` → `final.html`。
- `final.html` で、プレイヤーが最初から継承手順の一部だったことが明かされる。
- 招待URL `index.html?ref=1` をコピーでき、次の候補者を呼び込める。
- Lv5到達時タイトルサフィックスは `——蟠龍、解放`。

## 3. 全キーワード一覧（検索ワード、遷移先、フラグ、解放条件）

| キーワード | 遷移先 | 付与フラグ | 到達Lv | 解放条件 / 備考 |
|---|---|---:|---:|---|
| `ゆめ` | `hidden/yume-notice.html` | `found_yume_notice` | 1 | 初手導線 |
| `夢` | `hidden/yume-notice.html` | `found_yume_notice` | 1 | 同義語 |
| `復元` | `hidden/yume-draft.html` | `found_yume_draft` | 1 | `buffer04.dat` ヒント |
| `復元ファイル` | `hidden/yume-draft.html` | `found_yume_draft` | 1 | 同義語 |
| `buffer04.dat` | `hidden/yume-draft.html` | `found_yume_draft` | 1 | `yume-notice` 末尾ヒント |
| `YM-2023-04` | `hidden/yume-rireki.html` | `found_yume_rireki` | 2 | Lv1以降 |
| `黒瀬` | `hidden/kurose-shiji.html` | `found_kurose` | 2 | Lv1以降 |
| `失敗作` | `hidden/yume-finallog.html` | `found_yume_finallog` | 2 | Lv1以降 |
| `選定審査` | `hidden/selection-review.html` | `found_selection_review` | 2 | `found_yume_rireki` + `found_kurose` 必須 |
| `龍牌会` | `hidden/ronpaikai-chart.html` | `found_ronpaikai` | 2 | `found_yume_rireki` + `found_kurose` + `found_yume_finallog` 必須 |
| `MAP-RY-023` | `hidden/basement-map.html` | `found_basement_map` | 3 | `yume-finallog` 側ヒント |
| `龍牌会の端末` | `hidden/admin-console.html` | `found_admin_console` | 3 | 直検索可能 |
| `管理端末` | `hidden/admin-console.html` | `found_admin_console` | 3 | 直検索可能 |
| `RENPAI` | `hidden/backdoor.html` | `found_renpai` | 4 | `found_blog_unlocked` 必須 |
| `renpai` | `hidden/backdoor.html` | `found_renpai` | 4 | 小文字対応 |
| `廃棄処理室` | `hidden/disposal-room-log.html` | `found_disposal_room` | 3 | 地下施設側導線 |
| `BRK-DSP-2026-0103` | `hidden/disposal-record.html` | `found_disposal` | 3 | `found_disposal_room` 必須 |
| `次代の総龍` | `hidden/selection-criteria.html` | `found_selection` | 3 | 選定基準ページ |
| `龍牌会 端末` | `hidden/admin-console.html` | `found_admin_console` | 4 | Lv4用別名 |
| `記録保管室` | `hidden/lore-01.html` | `found_records_archive` | 2 | lore連鎖入口 |
| `記録保管` | `hidden/lore-01.html` | `found_records_archive` | 2 | 同義語 |
| `第三区画` | `hidden/shelve-lock.html` | `found_third_section` | 3 | `found_nagasawa` 必須 |
| `施錠棚` | `hidden/shelve-lock.html` | `found_third_section` | 3 | `found_nagasawa` 必須 |
| `長谷川` | `hidden/hasegawa.html` | `found_nagasawa` | 3 | `found_records_archive` 必須。フラグ名は typo のまま `nagasawa` |
| `長岡` | `hidden/nagaoka.html` | `found_nagaoka` | 3 | `found_disposal` 必須 |
| `百瀬` | `hidden/momose.html` | `found_momose` | 3 | `found_disposal` 必須 |
| `先代` | なし | なし | - | 削除済み演出 |
| `先代総龍` | なし | なし | - | 削除済み演出 |
| `前任者` | なし | なし | - | 削除済み演出 |
| `前総龍` | なし | なし | - | 削除済み演出 |
| `ソラ` | なし | なし | - | 削除済み演出。検索では到達不可 |

### 検索以外で到達する主要ページ

| 経路 | 到達先 | 条件 |
|---|---|---|
| `lore-01` の次へ | `lore-02` | Lv2以上 |
| `lore-02` の次へ | `lore-03` | クリック自体は可能だが `found_renpai` がないと拒否表示 |
| `lore-03` → `lore-04` → `lore-05` | lore連鎖後半 | Lv4以上 |
| `lore-05` の次へ | `admin-console.html` | Lv4以上 |
| `admin-console` 最終リンク | `hack-sequence.html` | `admin_transfer_complete` 必須 |
| `hack-sequence` | `hack-complete.html` | 同上 |
| `hack-complete` | `final.html` | 同上 |

## 4. 全フラグ一覧と役割

### 4.1 `br_flags` に入る調査フラグ

| フラグ | 役割 |
|---|---|
| `found_yume_notice` | Lv1入口。ゆめの不在告知を見つけた記録 |
| `found_yume_draft` | 復元メモ断片を発見 |
| `found_yume_rireki` | 在籍記録を発見 |
| `found_kurose` | 黒瀬メールログを発見 |
| `found_yume_finallog` | `YUME_FINAL.LOG` を発見 |
| `found_selection_review` | ゆめの選定審査記録を発見 |
| `found_ronpaikai` | 龍牌会組織図を発見 |
| `found_basement_map` | 地下施設 `MAP-RY-023` を発見 |
| `found_admin_console` | 管理端末を発見 |
| `found_renpai` | RENPAIバックドアを発見 |
| `found_disposal_room` | 廃棄処理室利用記録を発見 |
| `found_disposal` | 廃棄処理記録 `BRK-DSP-2026-0103` を発見 |
| `found_selection` | 選定基準ページを発見 |
| `found_records_archive` | 記録保管アーカイブを発見 |
| `found_third_section` | 施錠棚第3区画を発見 |
| `found_nagasawa` | 長谷川手記を発見。名称は実装上 typo |
| `found_nagaoka` | 長岡登録票を発見 |
| `found_momose` | 百瀬登録票を発見 |
| `found_blog_unlocked` | ブログPASS解除済。`RENPAI` 検索条件 |
| `found_handover_note` | `shelve-lock.html` の錠を `020` で開けた記録 |
| `admin_transfer_complete` | 管理端末で `SORA` を通し継承完了 |

### 4.2 進行保存用 localStorage

| キー | 役割 |
|---|---|
| `br_level` | 調査レベル 0〜5 |
| `br_flags` | 上記フラグ配列 |
| `br_search_log` | 検索ログ |
| `br_referral` | 紹介コード解放状態 |
| `blog_pass_unlocked` | ブログPASS解除状態 |
| `br_clear_date` | 継承完了日時。ブログの追記記事日付に使用 |
| `br_pages` | 訪問ページ一覧。右下進捗表示に使用 |

### 4.3 実装上の注意点

- `found_nagasawa` は実際には「長谷川」発見フラグ。命名だけがズレている。
- `PROGRESS_FLAGS` は `arg.js` に定義されているが、現在のUIでは未使用。
- `PAGE_TOTAL` は `30` 固定。実ファイル総数とは一致していない。

## 5. レベルシステム（各レベルの意味・演出）

| Lv | タイトルサフィックス | 意味 | 主な到達トリガー | 演出 |
|---|---|---|---|---|
| 0 | なし | 表向きサイトのみ。検索未解放 | 初期状態 | 検索バー非表示 |
| 1 | `——龍、目覚む` | ゆめの痕跡を見つける段階 | `ゆめ` など | Lvオーバーレイ、favicon赤系変化 |
| 2 | `——深淵を覗く` | 失踪の実態と選定の存在を知る | `YM-2023-04` / `黒瀬` / `失敗作` | yume補足断片表示開始 |
| 3 | `——真実の螺旋` | 組織構造・地下施設の把握 | `MAP-RY-023` など | 成功/失敗文言変化、monitor表示、ブログPASS強調 |
| 4 | `——禁忌の回廊` | バックドア到達、継承候補化 | `RENPAI` | lore後半閲覧、管理端末への文脈確定 |
| 5 | `——蟠龍、解放` | 継承完了 | `admin-console` で `SORA` | 最終継承シーケンス、終幕ページ、招待機能 |

### 共通演出

- 新規検索成功時は `RECORD UNSEALED` オーバーレイ。
- 一部フラグではゆめの短いメッセージが出る。
  - `found_yume_notice`: `……見つけてくれたんだ`
  - `found_yume_draft`: `まだ残ってた`
  - `found_yume_finallog`: `最後まで読んでくれて、ありがとう`
  - `found_selection_review`: `……あの夜、本当はあなたに来てほしかった`
  - `found_renpai`: `ここまで来たんだね`

## 6. ページ一覧（hidden/・blog/・表ページ）

### 6.1 表ページ

| パス | タイトル | 役割 |
|---|---|---|
| `index.html` | 蟠龍閣 \| 秋葉原 ネオチャイナ系コンカフェ | ARG開始点。紹介コード、検索バー、キャスト導線 |
| `cast.html` | CAST キャスト紹介 \| 蟠龍閣 | 表層導線 |
| `menu.html` | MENU メニュー \| 蟠龍閣 | 表層導線 |
| `recruit.html` | RECRUIT 求人募集 \| 蟠龍閣 | 表層導線 |
| `access.html` | ACCESS アクセス \| 蟠龍閣 | 表層導線 |
| `kuji.html` | 龍神くじ ✦ 蟠龍閣 HP限定イベント | 表層お遊びページ |
| `404.html` | 404 — FILE NOT FOUND \| 蟠龍閣 | 補助ページ |

### 6.2 ブログページ

| パス | 役割 |
|---|---|
| `blog/miju.html` | `牡丹`、`二十日草`、`レモン`、先代伝承などのヒント源 |
| `blog/chaki.html` | ゆめの最終記事の異常性を言語化。クリア後の追記記事あり |
| `blog/nano.html` | 「ぱっと見じゃない読み方」と `レモン` ヒント。クリア後の追記記事あり |
| `blog/izumo.html` | 「外から来る訪問者」の予言的補強。クリア後の追記記事あり |
| `blog/yume.html` | `RENPAI` 縦読みの本体。Lv1で glitch note 表示 |

### 6.3 hidden ページ

| パス | 役割 |
|---|---|
| `hidden/yume-notice.html` | 長期休暇告知。`buffer04.dat` ヒント |
| `hidden/yume-draft.html` | 復元メモ。`YM-2023-04`、`黒瀬`、`023`、`失敗作` を匂わせる |
| `hidden/yume-rireki.html` | 在籍記録。採用前接触・規定第7条・廃棄参照 |
| `hidden/kurose-shiji.html` | 黒瀬メールログ。PASS由来と評価の内実 |
| `hidden/yume-finallog.html` | ゆめ最終ログ。`MAP-RY-023` の直接ヒント |
| `hidden/selection-review.html` | ゆめの選定審査記録 |
| `hidden/ronpaikai-chart.html` | 龍牌会組織図 |
| `hidden/basement-map.html` | 地下施設平面図 |
| `hidden/disposal-room-log.html` | 廃棄処理室利用記録 |
| `hidden/disposal-record.html` | ゆめの廃棄処理記録 |
| `hidden/nagaoka.html` | 長岡登録票 |
| `hidden/momose.html` | 百瀬登録票 |
| `hidden/selection-criteria.html` | 現在候補の適合率評価 |
| `hidden/lore-01.html` | 龍牌会創設思想 |
| `hidden/lore-02.html` | 先代総龍の概要 |
| `hidden/lore-03.html` | 候補 #020〜#024 の履歴 |
| `hidden/lore-04.html` | ゆめの調査ノート |
| `hidden/lore-05.html` | 先代の預言書 |
| `hidden/hasegawa.html` | 長谷川手記。牡丹と第3区画のヒント |
| `hidden/shelve-lock.html` | 第3区画のダイヤル錠ギミック。`020` |
| `hidden/backdoor.html` | RENPAIバックドア |
| `hidden/admin-console.html` | 承認コード入力とLv5化 |
| `hidden/hack-sequence.html` | 継承演出1 |
| `hidden/hack-complete.html` | 継承演出2 |
| `hidden/final.html` | エンディング。検索ログ表示と招待URL発行 |

## 7. 登場人物一覧

| 人物 | 立場 | 役割 |
|---|---|---|
| ゆめ | キャスト / 候補 `#023` | 主な失踪対象。失敗作と判定され廃棄されたが、次の候補のために導線を仕込む |
| 黒瀬 | フロント部門 / 採用・接触担当 | ゆめを候補登録し、選定ルールを知りつつ可能性を賭けた人物 |
| 長谷川 | 代理統括 / 記録管理室 | 総龍空位を預かる管理者。先代から引き継ぎ紙を受け取った |
| 長岡 | 選定部門主任 | 感情を排した審査担当。ゆめを38%で失格判定 |
| 百瀬 | 廃棄部門乙班 / 処置担当 | ゆめの処置実行者。私的メモから感情の揺れが示される |
| ソラ | 元キャスト / 候補 `#021` | ORIGIN未達で廃棄された過去候補。`SORA` が継承コードになる |
| 先代総龍 | 第三代総龍 | 唯一廃棄されず退任した総龍。預言書と痕跡を残した |
| 創設者 | 初代総龍 | 「外から来る者」思想の起点 |
| 候補 #020 | 来客（女性） | RECOGNITION未充足で失敗。`020` が棚錠の番号として再利用される |
| 候補 #022 | 来客（不明） | LOYALTY未達で廃棄 |
| 候補 #024 | プレイヤー | 現在進行中の候補。最終的に次代の総龍になる |
| みじゅ | 表キャスト | 花・料理・映画好き。`牡丹`、`二十日草`、`レモン` の主要ヒント供給源 |
| ちゃき | 表キャスト | ゆめの同期。ブログで「ぱっと見じゃない読み方」を補強 |
| なの | 表キャスト | 読書好き。隠し読みの発想と `レモン` ヒントを補強 |
| いずも | 表キャスト | 占い役。外部から来る訪問者を予見する語り手 |

## 8. 謎の連鎖マップ

### 8.1 主幹ルート

`紹介コード BANRYUKAKU`
→ 検索解放
→ `ゆめ`
→ `buffer04.dat`
→ `YM-2023-04` / `黒瀬` / `失敗作`
→ `選定審査`
→ `龍牌会`
→ `記録保管室`
→ `長谷川`
→ `第三区画`
→ `020`
→ `ソラ`
→ `SORA`
→ `管理端末`
→ 継承完了

### 8.2 廃棄・地下ルート

`失敗作`
→ `YUME_FINAL.LOG`
→ `MAP-RY-023`
→ `廃棄処理室`
→ `BRK-DSP-2026-0103`
→ `長岡` / `百瀬`

### 8.3 ブログ / バックドアルート

`みじゅブログ`
→ `MEMBER PASS` に注意
→ `ウーロンハイ + カットレモン`
→ `LEMON`
→ `ゆめのブログ`
→ 縦読み `RENPAI`
→ `RENPAI` 検索
→ `backdoor.html`
→ `admin-console.html`

### 8.4 `牡丹 → 020 → shelve-lock → ソラ` の意味

- `blog/miju.html` に `牡丹` の別名 `二十日草` がある。
- 「二十日」から数値 `20` を読む。
- `hidden/lore-03.html` に候補 `#020` が存在し、数字が再強化される。
- `hidden/shelve-lock.html` の3桁ダイヤル正解は `020`。
- 解錠すると `ソラ` の登録票が出る。
- `admin-console.html` の承認コードは `SORA`。

この連鎖は「先代の痕跡 → 候補 #020 → ソラ → 現在の継承コード」へ繋がる、Lv3〜Lv5の鍵である。

## 9. 削除済みキーワードの演出仕様

削除済み語は `SEARCH_INDEX` 上で `deleted: true` として扱う。

対象:

- `先代`
- `先代総龍`
- `前任者`
- `前総龍`
- `ソラ`

検索時の挙動:

- 遷移しない。
- `#search-error` に4秒だけ以下のメッセージを表示する。
  - `> [語] に関する記録は存在しません。`
  - `> STATUS: DELETED — 2024.11 / 操作者: ████`
- 文字色は通常エラーより暗い `#554433`。

演出的意味:

- 先代やソラの情報は「存在しない」のではなく「削除された」扱い。
- プレイヤーは検索による正攻法を閉ざされ、周辺ヒントから逆算する必要がある。

## 10. 今後の拡張余地

### 10.1 物語拡張

- 深部区画 `B2F` は地図上で封鎖表示のみ。総龍着任後の専用章を追加できる。
- 先代総龍そのものの痕跡は削除演出止まり。Lv5後解禁資料として展開可能。
- `候補 #002` の記録は継承ログにのみ存在。連作化しやすい。

### 10.2 システム拡張

- `PROGRESS_FLAGS` を使った真の進捗バー実装。
- `br_pages` と `PAGE_TOTAL=30` の整合を取り、実ページ数基準へ更新。
- `br_search_log` は現在 `toLocaleTimeString()` のみ保存しており、`final.html` の日付整形と噛み合っていない。ISO日時保存へ変更余地あり。
- `found_nagasawa` など命名ズレの整理。

### 10.3 導線拡張

- ブログPASSは `LEMON` 一発だが、現在でも複数のブログにヒントが散っている。段階的解除方式に拡張可能。
- 表サイトの `cast/menu/access/kuji` にもARG痕跡を増やせる。
- クリア後の `?ref=1` 招待URLを、次周回プレイヤー向けの分岐導線に発展できる。

## 11. 現状実装メモ

- 検索は完全一致。部分一致や正規化はない。
- `resolveSearchPath()` で hidden階層からでも相対パス解決できる。
- 多くの hidden ページは `arg.js` を読み、右下のレベル表示と訪問数表示を共有する。
- 一部ページはレベル未達で即 `index.html` に戻す。
  - `hasegawa`, `shelve-lock`, `nagaoka`, `momose`: Lv3未満
  - `lore-02`: Lv2未満
  - `lore-03`, `lore-04`, `lore-05`: Lv4未満
  - `hack-sequence`, `hack-complete`, `final`: `admin_transfer_complete` 未達
- 追加表示:
  - `yume-draft`: Lv2以上で decoded fragment
  - `yume-finallog`: Lv2以上で addendum
  - `blog/yume.html`: Lv1以上で `下書きの復元に失敗しました。`
  - `blog/chaki.html` / `nano.html` / `izumo.html`: クリア後に ghost entry が出る

