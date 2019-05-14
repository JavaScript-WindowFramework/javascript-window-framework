# javascript-window-framework
JavaScript用ウインドウフレームワーク npmモジュール版

## ターゲット
- TypeScript+ES5(JavaScript)
- IE11で動作するレベルのDOM

## 更新履歴
- 2019/05/14 0.03 tsコードをstrictに対応
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
