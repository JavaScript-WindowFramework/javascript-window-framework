/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
class DtsBundlePlugin {
  constructor(p) {
    this.p = p;
  }
  apply(compiler) {
    compiler.hooks.afterEmit.tap("DtsBundlePlugin", () => {
      var dts = require("dts-bundle");
      dts.bundle(this.p);
    });
  }
}

module.exports = {
  mode: "production",
  entry: [path.resolve(__dirname, "jwf/javascript-window-framework.ts")],
  output: {
    library: "javascript-window-framework",
    libraryTarget: "amd",
    filename: "index.js",
    path: path.resolve(__dirname, "../dist")
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
    extensions: [".ts", ".js", ".scss", ".svg"]
  },
  devtool: "source-map",
  plugins: [
    new DtsBundlePlugin({
      name: "javascript-window-framework",
      main: path.resolve(__dirname, "../dist/javascript-window-framework.d.ts"),
      out: path.resolve(__dirname, "../dist/index.d.ts"),
      removeSource: true,
      outputAsModuleFolder: false
    })
  ]
};
