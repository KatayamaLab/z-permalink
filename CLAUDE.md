# Z Permalink Plugin

Zotero 7用のプラグインで、グループライブラリ内のアイテムのWebリンクをクリップボードにコピーする機能を提供します。

## 機能

- **アイテム**のコンテキストメニューに「Copy Web Link to This Item」を追加
- **コレクション**のコンテキストメニューに「Copy Web Link to This Item」を追加
- **グループライブラリ内のアイテム・コレクションでのみメニューを表示**（My Libraryでは非表示）

### アイテム用機能
- グループライブラリ内のアイテムを選択してメニューをクリックすると、以下の形式のリンクをクリップボードにコピー:
  ```
  https://www.zotero.org/groups/{groupID}/items/{itemKey}/
  ```

### コレクション用機能
- グループライブラリ内のコレクションを選択してメニューをクリックすると、以下の形式のリンクをクリップボードにコピー:
  ```
  https://www.zotero.org/groups/{groupID}/collections/{collectionKey}/
  ```

## ファイル構成

- `src-2.0/manifest.json`: プラグインのメタデータとZotero 7設定
- `src-2.0/bootstrap.js`: プラグインのライフサイクル管理（起動・終了処理）
- `src-2.0/z-permalink.js`: メイン機能の実装（コンテキストメニュー追加、リンク生成・コピー）
- `src-2.0/locale/en-US/z-permalink.ftl`: メニューラベルの多言語対応
- `make-zips`: プラグインビルド用スクリプト

## 実装詳細

### コンテキストメニューの追加
- `zotero-itemmenu`（アイテム用）と`zotero-collectionmenu`（コレクション用）に`menuitem`要素を追加
- Fluent形式での多言語対応
- `popupshowing`イベントで動的にメニューの表示/非表示を制御

### グループ情報の取得
```javascript
// アイテムの場合
const item = selectedItems[0];
const itemKey = item.key;
const libraryID = item.libraryID;

// コレクションの場合
const collection = zoteroPane.getSelectedCollection();
const collectionKey = collection.key;
const libraryID = collection.libraryID;

// 共通のグループ情報取得
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
   - `build/z-permalink-2.0.xpi`: インストール用プラグインファイル
   - `build/updates-2.0.json`: アップデート設定ファイル

3. インストール:
   - Zoteroの Tools > Add-ons から `.xpi` ファイルをインストール

## 使用方法

### アイテムのリンクをコピー
1. Zotero 7でグループライブラリを開く
2. アイテムを右クリック
3. 「Copy Web Link to This Item」を選択
4. `https://www.zotero.org/groups/{groupID}/items/{itemKey}/` 形式のリンクがクリップボードにコピーされ、通知が表示される

### コレクションのリンクをコピー
1. Zotero 7でグループライブラリを開く
2. コレクション（フォルダ）を右クリック
3. 「Copy Web Link to This Item」を選択
4. `https://www.zotero.org/groups/{groupID}/collections/{collectionKey}/` 形式のリンクがクリップボードにコピーされ、通知が表示される

## 注意事項

- グループライブラリ内のアイテム・コレクションのみ対応
- 個人ライブラリ（My Library）ではコンテキストメニューが表示されません
- Zotero 7.0以上が必要