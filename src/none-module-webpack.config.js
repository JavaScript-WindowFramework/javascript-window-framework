const path = require('path');
class DtsBundlePlugin {
	constructor(p){
		this.p = p
	}
	apply(compiler) {
		compiler.hooks.done.tap('DtsBundlePlugin', () => {
			var dts = require('dts-bundle');
			dts.bundle(this.p)
		})
	}
}
module.exports = {
	mode: 'production',
	//mode: 'development',
	entry: [
		path.resolve(__dirname, 'jwf/javascript-window-framework.ts')
	],
	output: {
		library: 'JWF',
		libraryTarget: 'global',
		filename: 'jwf.js',
		path: path.resolve(__dirname, '../dist-jwf')
	},
	module: {
		rules: [{
				test: /\.ts|\.tsx$/,
				use: ['ts-loader']
			}, {
				test: /\.js$/,
				use: ["source-map-loader"],
				enforce: "pre"
			}, {
				test: /\.scss/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				],
			},
			{
				test: /\.(jpg|png|svg|gif)$/,
				loaders: 'url-loader'
			},
		]
	},
	resolve: {
		extensions: ['.ts', '.js', '.scss'],
	},
	devtool: 'source-map',
	plugins: [
		new DtsBundlePlugin({
			name: 'jwf',
			prefix: 'JWF.',
			main: path.resolve(__dirname, '../dist/javascript-window-framework.d.ts'),
			out: path.resolve(__dirname, '../dist-jwf/jwf.d.ts'),
			removeSource: true,
			outputAsModuleFolder: true
		})
	]
};
