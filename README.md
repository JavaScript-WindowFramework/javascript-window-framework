# javascript-window-framework
JavaScript用ウインドウフレームワーク npmモジュール版

## 動作画面
![Screen Shot](https://raw.githubusercontent.com/JavaScript-WindowFramework/javascript-window-framework/ScreenShot/ScreenShot.gif)

## 関連リンク
[リファレンスドキュメント](https://javascript-windowframework.github.io/TypeDocViewer/dist/)
[サンプルプログラム](https://github.com/JavaScript-WindowFramework/jwf_sample01)

## ターゲット
- TypeScript+ES5(JavaScript)
- IE11で動作するレベルのDOM

## 更新履歴
- 2019/05/15 0.06 TextBoxのイベント修正
- 2019/05/14 0.05 tsコードをstrictに対応
- 2019/05/13 0.02 モジュールの形式を変更
- 2019/05/09 0.01 公開バージョン

## 使い方

### 　インストール
npm i javascript-window-framework

### 　使用例
```index.ts
import * as JWF from 'javascript-window-framework'

async function Main() {
	const win = new JWF.FrameWindow()	//フレームウインドウの作成
	win.setTitle('サンプルウインドウ')	//タイトルの設定
	win.setPos()				//位置を中心に設定
}

//ページ読み込み時に実行する処理を設定
addEventListener("DOMContentLoaded", Main)
```

## ライセンス
- [MIT License](https://opensource.org/licenses/mit-license.php)  
