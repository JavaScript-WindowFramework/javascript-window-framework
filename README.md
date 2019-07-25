# javascript-window-framework

Front end framework
JavaScript Window Framework (npm module version)

## screen

![screenshot](https://raw.githubusercontent.com/JavaScript-WindowFramework/javascript-window-framework/ScreenShot/ScreenShot.gif)

## link

- [source code](https://github.com/JavaScript-WindowFramework/javascript-window-framework)
- [document](https://javascript-windowframework.github.io/TypeDocViewer/dist/)
- [sample](https://github.com/JavaScript-WindowFramework/jwf_sample01)

## target

- TypeScript+ES5(JavaScript)
- IE11 or later

## history

- 2019/07/08 0.1.05 Modification of d.ts
- 2019/07/08 0.1.04 Change of MessageBox style
- 2019/07/03 0.1.03 Template update
- 2019/07/02 0.1.02 Change of class name, change of style composition
- 2019/06/26 0.0.16 Changed the processing method of the event system, fixed the template resource
- 2019/06/06 0.0.13 Changed the configuration of the sample
- 2019/06/02 0.0.12 Calendar correction, display update timing change, style correction
- 2019/05/27 0.0.10 Modify source code based on TSLint, modify button style
- 2019/05/19 0.0.08 Add command to expand sample, modify sample template
- 2019/05/14 0.0.05 ts code corresponds to strict
- 2019/05/13 0.0.02 Changed the module format
- 2019/05/09 0.0.01 Published version

## 使い方

- install

```.sh
npm i javascript-window-framework
```

- install template

```.sh
npx init-jwf
```

- build sample

```.sh
npx webpack
```

- result file

```.sh
dist/public/js/bundle.js
```

- Confirm in browser

```.sh
dist/public/index.html
```

- Use server

```.sh
npx webpack-dev-server
```

## Sample

```src/public/index.ts
import * as JWF from 'javascript-window-framework'

addEventListener("DOMContentLoaded", ()=>{
  const win = new JWF.FrameWindow();
  win.setTitle('SampleWindow') ;
  win.setPos();
});
```

## License

- [MIT License](https://opensource.org/licenses/mit-license.php)
