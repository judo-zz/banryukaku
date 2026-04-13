# 蟠龍閣 ARG 正解ルート案内書

> テスト・デバッグ用。ネタバレ注意。

---

## 前提：デバッグリセット

コンソールで `ARG.brReset()` を実行 → index.html にリダイレクト＆全localStorage消去

---

## STEP 0：入口（招待コード）

**ヒント元:** いずもブログ「年が明けた」（2026.01.07）  
> 「まずお店の名前をちゃんと知っておいてほしい。それが、最初の言葉になる。」

**操作:**  
index.html の「RESERVE ご予約」セクションの入力欄に以下を入力

```
BANRYUKAKU
```

→ 検索バーが出現

---

## STEP 1：Lv0 → Lv1

**ヒント元:** cast.htmlでゆめが「長期お休み中」と表示されている

**操作①:** 検索バーで `ゆめ`  
→ `hidden/yume-notice.html`（業務連絡）  
→ 末尾に「**local buffer #04 detected — 復元ファイルあり**」

**操作②:** 検索バーで `復元`  
→ `hidden/yume-draft.html`（断片メモ #04）  
→ 「壁の案内に **023** があった」「**龍を探すなら、秋葉原にいる。**」

---

## STEP 2：Lv1 → Lv2（4キーワード）

**ヒント元:** yume-draft.html、yume-rireki.html内の各記述

| 検索ワード | 遷移先 | ヒントの出所 |
|---|---|---|
| `YM-2023-04` | yume-rireki.html | yume-draft.htmlの管理番号 |
| `黒瀬` | kurose-shiji.html | yume-rireki.htmlの評価履歴「黒瀬係長より打診」 |
| `失敗作` | yume-finallog.html | yume-rireki.htmlの最終判定「失敗作 / 廃棄」 |
| `龍牌会` | ronpaikai-chart.html | 各ページ全体で繰り返し言及 |

---

## STEP 3：Lv2 → Lv3（4キーワード）

**ヒント元:** yume-draft.html・access.htmlの地図（龍マーク）

| 検索ワード | 遷移先 | ヒントの出所 |
|---|---|---|
| `MAP-RY-023` | basement-map.html | yume-draft.html「023があった」＋access.htmlの龍マークポップアップ |
| `廃棄` | disposal-record.html | yume-rireki.htmlの最終判定 |
| `選定` | selection-criteria.html | backdoor.htmlの「選定基準がある。読め。」 |
| `龍牌会の端末` | admin-console.html | basement-map.htmlの区画図「管理端末室」 |

---

## STEP 4：ブログPASSの解放

**ヒント元:** なのブログ「あるワードで笑ってしまった」（2026.02.15）  
> 「キャラクターが『**ウーロンハイにカットレモン**』って注文するシーンがあって。うちの内勤さんがよく飲んでるやつだ。」

→ カットレモン = **LEMON**

**操作:** 各ブログページ右上のパスワード欄に `LEMON` を入力  
→ 各ブログの鍵記事・ゆめブログへのリンクが出現

---

## STEP 5：Lv3 → Lv4（RENPAIの発見）

**ヒント元①:** ちゃきブログ（鍵記事）  
> 「ぱっと見は普通の日記に見えると思う」って書いてあるんです。**それって、ぱっと見じゃない読み方があるってこと…？**

**ヒント元②:** なのブログ（鍵記事「ゆめちゃんのこと」）  
> 普通に読むのとはちょっと違う見方をすると、何かが見えてくるような気がする

**操作:** ゆめのブログ最終投稿「たいせつなこと」の**各段落の頭文字を縦読み**

```
れんらく、したかったけど
んー、でもこれだけは
ぱっと見は普通の日記に見えると思う
いつかここに来た人への、手紙だよ
→ 「れんぱい」= RENPAI
```

**操作:** 検索バーで `RENPAI`  
→ `hidden/backdoor.html`（Lv4到達）

---

## STEP 6：全クリ（Lv4 → Lv5）

**前提:** Lv4以上であること（RENPAI検索済み）

**操作:** `hidden/admin-console.html` を開く  
→ 引き継ぎコード入力欄に `RENPAI` を入力  
→「◆ 蟠龍閣は、あなたのものになりました ◆」が出現  
→「システム引き継ぎを実行する」クリック  
→ `hidden/hack-sequence.html` → `hidden/hack-complete.html` → `hidden/final.html`

---

## 全体フロー（一覧）

```
BANRYUKAKU（招待コード）
  ↓ 検索バー出現
ゆめ → 復元
  ↓ Lv1
YM-2023-04 → 黒瀬 → 失敗作 → 龍牌会
  ↓ Lv2
MAP-RY-023 → 廃棄 → 選定 → 龍牌会の端末
  ↓ Lv3　＋　ブログPASS: LEMON → ゆめブログ解放
RENPAI（縦読み）
  ↓ Lv4
admin-console で RENPAI 入力（Lv4必須）
  ↓ Lv5 全クリ
```

---

## 進捗フラグ一覧（デバッグ用）

| フラグ名 | 対応アクション |
|---|---|
| found_yume_notice | `ゆめ` 検索 |
| found_yume_draft | `復元` 検索 |
| found_kurose | `黒瀬` 検索 |
| found_yume_rireki | `YM-2023-04` 検索 |
| found_yume_finallog | `失敗作` 検索 |
| found_ronpaikai | `龍牌会` 検索 |
| found_basement_map | `MAP-RY-023` 検索 |
| found_admin_console | `龍牌会の端末` 検索 |
| found_renpai | `RENPAI` 検索 |
| admin_transfer_complete | admin-consoleでRENPAI入力（Lv4以上） |

確認コマンド: `ARG.getFlags()` / `ARG.getLevel()`
