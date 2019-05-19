# javascript-window-framework
JavaScript用ウインドウフレームワーク npmモジュール版

## 動作画面
![screenshot](https://raw.githubusercontent.com/JavaScript-WindowFramework/javascript-window-framework/ScreenShot/ScreenShot.gif)

## 関連リンク
- [リファレンス&ドキュメント](https://javascript-windowframework.github.io/TypeDocViewer/dist/)
- [サンプルプログラム](https://github.com/JavaScript-WindowFramework/jwf_sample01)

## ターゲット
- TypeScript+ES5(JavaScript)
- IE11で動作するレベルのDOM

## 更新履歴
- 2019/05/19 0.07 サンプルを展開するコマンドを追加
- 2019/05/14 0.05 tsコードをstrictに対応
- 2019/05/13 0.02 モジュールの形式を変更
- 2019/05/09 0.01 公開バージョン

## 使い方

- インストール
```
npm i javascript-window-framework
```

- サンプルテンプレートのインストール
```
npx init-jwf
```

- サンプルテンプレートに必要なWebPack類のインストール
```
npm -D i typescript dts-bundle ts-loader node-sass style-loader sass-loader css-loader url-loader source-map-loader webpack webpack-cli webpack-dev-server
```

- サンプルのビルドと確認
```
npx webpack
dist/index.html をブラウザで開く
```

- Serverの起動
```
npx webpack-dev-server
http://localhost:8080/ をブラウザで開く
```

## 　使用例
```src/index.ts
import * as JWF from 'javascript-window-framework'

//ページ読み込み時に実行する処理を設定
addEventListener("DOMContentLoaded", ()=>{
	const win = new JWF.FrameWindow()	//フレームウインドウの作成
	win.setTitle('サンプルウインドウ')	//タイトルの設定
	win.setPos()				//位置を中心に設定
})
```

## ライセンス
- [MIT License](https://opensource.org/licenses/mit-license.php)  
