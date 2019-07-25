/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

class DtsBundlePlugin {
  constructor(params) {
    this.params = params;
  }
  apply(compiler) {
    compiler.hooks.afterEmit.tap("DtsBundlePlugin", () => {
      const params = this.params;
      require("dts-bundle").bundle(params);
      require("dts-module-filter").DtsModuleFilter({
        src: params.out,
        namespace: params.name
      });
    });
  }
}
module.exports = {
  mode: "production",
  //mode: 'development',
  entry: ["es6-promise/auto", path.resolve(__dirname, "jwf/javascript-window-framework.ts")],
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
    })
  ]
};
