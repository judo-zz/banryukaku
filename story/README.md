# 蟠龍閣 ARG — ストーリーテキスト管理

このディレクトリ内のファイルを編集し、対応するHTMLに反映させることでテキスト内容を更新できます。

## ファイル構成

### キャストブログ（公開側）
| ファイル | 対応HTML | レベル |
|---|---|---|
| blog-yume.md | blog/yume.html | Lv0（入口） |
| blog-miju.md | blog/miju.html | Lv0 |
| blog-nano.md | blog/nano.html | Lv0 |
| blog-chaki.md | blog/chaki.html | Lv0 |
| blog-yosuzu.md | blog/yosuzu.html | Lv0 |

### 隠しページ（ARGルート）
| ファイル | 対応HTML | 発見キーワード | 必要Lv |
|---|---|---|---|
| hidden-lv1-yume-notice.md | hidden/yume-notice.html | ゆめ / 夢 | Lv0→1 |
| hidden-lv2-yume-rireki.md | hidden/yume-rireki.html | YM-2023-04 | Lv1→2 |
| hidden-lv2-kurose-mails.md | hidden/kurose-shiji.html | 黒瀬 | Lv1→2 |
| hidden-lv2-yume-finallog.md | hidden/yume-finallog.html | 失敗作 | Lv1→2 |
| hidden-lv2-ronpaikai.md | hidden/ronpaikai-chart.html | 龍牌会 | Lv1→2 |
| hidden-lv3-basement-map.md | hidden/basement-map.html | MAP-RY-023 | Lv2→3 |
| hidden-lv3-disposal.md | hidden/disposal-record.html | 廃棄 | Lv2→3 |
| hidden-lv3-selection.md | hidden/selection-criteria.html | 選定 | Lv2→3 |
| hidden-lv4-backdoor.md | hidden/backdoor.html | RENPAI | Lv3→4 |
| hidden-lv4-admin-console.md | hidden/admin-console.html | 龍牌会 端末 | Lv3→4 |
| hidden-lv5-final.md | hidden/final.html | エンディング | Lv5 |

### 古文書アーカイブ（龍牌会lore）
| ファイル | 対応HTML |
|---|---|
| lore-01.md | hidden/lore-01.html |
| lore-02.md | hidden/lore-02.html |
| lore-03.md | hidden/lore-03.html |
| lore-04.md | hidden/lore-04.html |
| lore-05.md | hidden/lore-05.html |

---

## テコ入れ重点メモ

- **ゆめブログ**: 廃棄前の「普通の女の子」感を出す。趣味・好物・幸せな瞬間を増やす
- **みじゅブログ**: 「螺旋階段の夢」エントリがあるが活用できていない
- **なのブログ**: ARGとの接点がほぼない。ゆめの痕跡に気づく記述を追加できる
- **よすずブログ**: 占いで「何かが来る」と言いすぎ。もう少しさりげなく
- **黒瀬メール**: 人間的な揺らぎは書けているが、黒瀬自身の動機が薄い
- **廃棄記録**: 処置の意味が曖昧。物理的な重さをどう示すか
- **final.html**: エンディングが受け身すぎる。プレイヤーへの問いかけがほしい
- 西尾維新構造＋森博嗣文体
