/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const DtsModuleFilter = require("./DtsModuleFilter").DtsModuleFilter;
class DtsBundlePlugin {
  constructor(p) {
    this.p = p;
  }
  apply(compiler) {
    compiler.hooks.afterEmit.tap("DtsBundlePlugin", () => {
      var dts = require("dts-bundle");
      dts.bundle(this.p);
      DtsModuleFilter({
        src: this.p.out,
        namespace: "JWF"
});
    });
  }
}
module.exports = {
  mode: "production",
  //mode: 'development',
  entry: ["es6-promise/auto",path.resolve(__dirname, "jwf/javascript-window-framework.ts")],
  output: {
    library: "JWF",
    libraryTarget: "global",
    filename: "jwf.js",
    path: path.resolve(__dirname, "../dist-jwf")
  },
  module: {
    rules: [
      {
        test: /\.ts|\.tsx$/,
        use: ["ts-loader"]
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      },
      {
        test: /\.scss/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        loaders: "url-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js", ".scss"]
  },
  devtool: "source-map",
  plugins: [
    new DtsBundlePlugin({
      name: "JWF",
      main: path.resolve(__dirname, "../dist/javascript-window-framework.d.ts"),
      out: path.resolve(__dirname, "../dist-jwf/jwf.d.ts"),
      removeSource: false,
      referenceExternals: RegExp,
      exclude: /\.scss/,
      emitOnNoIncludedFileNotFound: true,
      emitONIncludedFileNotFound: true,
      outputAsModuleFolder: false
    })
  ]
};
