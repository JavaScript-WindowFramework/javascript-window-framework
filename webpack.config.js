const path = require('path');
var glob = require("glob");
module.exports = {
	mode: 'production',
	entry: "./src/jwf.ts",
	output: {
		library: 'JWF',
		libraryTarget: 'amd',
		filename: 'jwf.js',
		path: path.resolve(__dirname, 'dist')
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
			use: 'ts-loader'
		}]
	}
};
