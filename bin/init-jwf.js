#!/usr/bin/env node
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs-extra');

fs.copySync(path.resolve(__dirname, '../resource'), '.',{overwrite:false});

if (process.platform==='win32') {
  var npm = 'npm.cmd'
} else {
  var npm = 'npm'
}
const proc = spawn(npm,'-D i typescript dts-bundle ts-loader node-sass style-loader sass-loader css-loader url-loader source-map-loader webpack webpack-cli webpack-dev-server'.split(' '),{  stdio: 'inherit' });
proc.on('exit',()=>{
  console.log(
  `
  Build Command
  ---------------
  build: npx webpack
  start: npx webpack-dev-server
  ---------------

  `)
})
