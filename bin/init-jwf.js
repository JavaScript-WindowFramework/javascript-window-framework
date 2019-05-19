#!/usr/bin/env node
const path = require('path')
const fs = require('fs-extra')
fs.copySync(path.resolve(__dirname, '../resource'), '.')

console.log(
`
File copy complite.

Do the following
---------------
npm -D i typescript dts-bundle ts-loader node-sass style-loader sass-loader css-loader url-loader source-map-loader webpack webpack-cli webpack-dev-server
---------------

Build Command
---------------
build: npx webpack
start: npx webpack-dev-server
---------------

`)
