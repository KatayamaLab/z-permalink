# Zotero Permalink Plugin

Zotero 7用のプラグインで、グループライブラリ内のアイテムのWebリンクをクリップボードにコピーする機能を提供します。

## 機能

- アイテムのコンテキストメニューに「Copy web link to this article」を追加
- グループライブラリ内のアイテムを選択してメニューをクリックすると、以下の形式のリンクをクリップボードにコピー:
  ```
  https://www.zotero.org/groups/{groupID}/items/{itemKey}/
  ```
- 個人ライブラリのアイテムの場合はエラーメッセージをログに出力

## ファイル構成

- `src-2.0/manifest.json`: プラグインのメタデータとZotero 7設定
- `src-2.0/bootstrap.js`: プラグインのライフサイクル管理（起動・終了処理）
- `src-2.0/make-it-red.js`: メイン機能の実装（コンテキストメニュー追加、リンク生成・コピー）
- `src-2.0/locale/en-US/make-it-red.ftl`: メニューラベルの多言語対応
- `make-zips`: プラグインビルド用スクリプト

## 実装詳細

### コンテキストメニューの追加
- `zotero-itemmenu`に`menuitem`要素を追加
- Fluent形式での多言語対応

### グループ情報の取得
```javascript
const item = selectedItems[0];
const itemKey = item.key;
const libraryID = item.libraryID;

if (libraryID !== Zotero.Libraries.userLibraryID) {
    const group = Zotero.Groups.getByLibraryID(libraryID);
    const groupID = group.id;
}
```

### クリップボードコピー
```javascript
const clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
    .getService(Components.interfaces.nsIClipboardHelper);
clipboardHelper.copyString(permalinkURL);
```

## ビルドとインストール

1. ビルド:
   ```bash
   ./make-zips
   ```

2. 生成されるファイル:
   - `build/zotero-permalink-2.0.xpi`: インストール用プラグインファイル
   - `build/updates-2.0.json`: アップデート設定ファイル

3. インストール:
   - Zoteroの Tools > Add-ons から `.xpi` ファイルをインストール

## 使用方法

1. Zotero 7でグループライブラリを開く
2. アイテムを右クリック
3. 「Copy web link to this article」を選択
4. リンクがクリップボードにコピーされ、通知が表示される

## 注意事項

- グループライブラリ内のアイテムのみ対応
- 個人ライブラリのアイテムでは機能しません
- Zotero 7.0以上が必要