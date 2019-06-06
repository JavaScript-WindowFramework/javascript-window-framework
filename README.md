# javascript-window-framework

JavaScript 用ウインドウフレームワーク npm モジュール版

## 動作画面

![screenshot](https://raw.githubusercontent.com/JavaScript-WindowFramework/javascript-window-framework/ScreenShot/ScreenShot.gif)

## 関連リンク

- [リファレンス&ドキュメント](https://javascript-windowframework.github.io/TypeDocViewer/dist/)
- [サンプルプログラム](https://github.com/JavaScript-WindowFramework/jwf_sample01)

## ターゲット

- TypeScript+ES5(JavaScript)
- IE11 で動作するレベルの DOM

## 更新履歴
- 2019/06/06 0.14 サンプルの構成を変更
- 2019/06/02 0.12 カレンダーの修正、表示更新タイミングの変更、スタイルの修正
- 2019/05/27 0.10 ソースコードを TSLint に基づいて修正、ボタンスタイルの修正
- 2019/05/19 0.08 サンプルを展開するコマンドを追加、サンプルテンプレートの修正
- 2019/05/14 0.05 ts コードを strict に対応
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

- サンプルテンプレートに必要な WebPack 類のインストール

```
npm -D i typescript dts-bundle ts-loader node-sass style-loader sass-loader css-loader url-loader source-map-loader webpack webpack-cli webpack-dev-server
```

- サンプルのビルドと確認

```
npx webpack
dist/public/index.html をブラウザで開く
```

- Server の起動

```
npx webpack-dev-server
http://localhost:8080/ をブラウザで開く
```

## 　使用例

```src/public/index.ts
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
