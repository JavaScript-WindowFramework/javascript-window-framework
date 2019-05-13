const path = require('path');

class DtsBundlePlugin {
	apply(compiler) {
		var rootDir = path.resolve(__dirname);
		compiler.plugin('done', function () {
			var dts = require('dts-bundle');

			dts.bundle({
				name: 'javascript-window-framework',
				main: rootDir + '/../dist/javascript-window-framework.d.ts',
				out: rootDir + '/../dist/index.d.ts',
				removeSource: true,
				outputAsModuleFolder: true
			});
		});
	};
}

module.exports = {
	mode: 'production',
	entry: [
		path.resolve(__dirname, 'jwf/javascript-window-framework.ts')
	],
	output: {
		library: 'javascript-window-framework',
		libraryTarget: 'commonjs',
		filename: 'index.js',
		path: path.resolve(__dirname, '../dist')
	},
	module: {
		rules: [{
			test: /\.scss/,
			use: [
					'style-loader',
					'css-loader',
					'sass-loader'
			],
		}, {
			test: /\.ts|\.tsx$/,
			use: ['ts-loader']
		}, {
			test: /\.js$/,
			use: ["source-map-loader"],
			enforce: "pre"
		}]
	},
	resolve: {
		extensions: ['.ts', '.js', '.scss'],
	},
	devtool: 'source-map',
	plugins: [
		new DtsBundlePlugin()
	]
};
