const path = require('path');

module.exports = {
	mode: 'production',
	entry: './src/index.ts',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: 'source-map',
	module: {
		rules: [{
				test: /\.js$/,
				use: ["source-map-loader"],
				enforce: "pre"
			},
			{
				test: /\.ts|\.tsx$/,
				use: 'ts-loader'
			}, {
				test: /\.(scss|css)$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			}, {
				test: /\.(jpg|png|svg|gif)$/,
				loaders: 'url-loader'
			},
		]
	},
	resolve: {
		moduleExtensions: ['node_modules']
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		host: "localhost"
	},
};
