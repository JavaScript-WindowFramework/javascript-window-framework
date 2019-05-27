import * as JWF from "javascript-window-framework";

function Sample001(): void {
  const win = new JWF.FrameWindow(); //フレームウインドウの作成
  win.setTitle("Sample01 ウインドウを表示"); //タイトルの設定
  win.setPos(); //位置を中心に設定
}

function Sample002(): void {
  const win = new JWF.FrameWindow(); //フレームウインドウの作成
  win.setTitle("Sample02 位置サイズ指定"); //タイトルの設定
  win.setSize(100, 100); //サイズの変更
  win.setPos(10, 10); //位置指定
  const client = win.getClient(); //クライアントノードの取得
  win.addEventListener(
    "active",
    (e): void => {
      client.innerText = e.active
        ? "アクティブになった"
        : "非アクティブになった";
    }
  );
}

function Sample003(): void {
  const listView = new JWF.ListView({ frame: true }); //リストビューをフレーム付きで作成
  listView.setTitle("Sample03 リストビュー"); //タイトルの設定
  listView.addHeader(["番号", "名前", "攻撃力"]); //ヘッダの作成
  listView.addItem([1, "竹槍", 5]); //アイテムの設定
  listView.addItem([2, "棍棒", 10]);
  listView.addItem([3, "銅の剣", 10]);
  listView.setPos(30, 30); //位置指定

  listView.addEventListener(
    "itemClick",
    (e): void => {
      //アイテムクリック処理
      const name = listView.getItemText(e.itemIndex, 1); //リストビューからデータを取り出す
      new JWF.MessageBox("メッセージ", name + "が選択された"); //メッセージボックスの表示
    }
  );
}
function Sample004(): void {
  //ツリービューの作成
  let treeView = new JWF.TreeView({ frame: true });
  treeView.setTitle("Sample04 ツリービュー"); //タイトルの設定
  //サイズ設定
  treeView.setSize(300, 300);
  //ルートアイテムに対して名前の設定
  treeView.getRootItem().setItemText("ルートアイテム");

  //アイテムを作成
  let item: JWF.TreeItem;
  item = treeView.addItem("アイテム1");
  item.addItem("アイテム1-1");
  item.addItem("アイテム1-2");
  item = treeView.addItem("アイテム2");
  item.addItem("アイテム2-1");
  item.addItem("アイテム2-2");
  item.addItem;

  //アイテムが選択された場合のイベント
  treeView.addEventListener("itemSelect", function(e): void {
    const name = e.item.getItemText(); //リストビューからデータを取り出す
    new JWF.MessageBox("メッセージ", name + "が選択された"); //メッセージボックスの表示
  });
}
function Sample005(): void {
  const frame = new JWF.FrameWindow();
  frame.setTitle("Sample005 分割ウインドウ"); //タイトル設定

  const splitter = new JWF.Splitter(); //分割バーの作成
  frame.addChild(splitter, "client"); //分割バーをフレームウインドウに乗せる

  const tree = new JWF.TreeView(); //ツリービューの作成
  const list = new JWF.ListView(); //リストビューの作成

  splitter.addChild(0, tree, "client"); //splitterの分割領域0にtreeを追加
  splitter.addChild(1, list, "client"); //splitterの分割領域1にlistを追加

  //分割バーの分割サイズと方向設定(WestEast、左右)
  //weは左が領域0、右が領域1
  //nsにすると上下分割も可能
  splitter.setSplitterPos(200, "we");
  //表示領域が300を切ると、動的なオーバーレイ表示にする
  splitter.setOverlay(true, 300);

  //treeにアイテムを追加
  tree.getRootItem().setItemText("最上位アイテム");
  for (let j = 0; j < 5; j++) {
    let item = tree.addItem("アイテム" + j, true);
    for (let i = 0; i < 5; i++)
      item.addItem("サブアイテム" + j + "-" + i, false);
  }
  //アイテムが選択された場合のイベント
  tree.addEventListener(
    "itemSelect",
    (e): void => {
      const value = e.item.getItemText();
      if (value) {
        const no = list.getItemCount();
        const date = new Date().toLocaleString();
        list.addItem([no.toString(), value, date]);
      }
    }
  );

  //listにヘッダを追加
  list.addHeader(["番号", ["名前", 200], "時刻"]);

  //位置とサイズの設定
  frame.setSize(800, 600);
  frame.setPos();
}

//ページ読み込み時に実行する処理を設定
addEventListener(
  "DOMContentLoaded",
  (): void => {
    Sample001();
    Sample002();
    Sample003();
    Sample004();
    Sample005();
  }
);
