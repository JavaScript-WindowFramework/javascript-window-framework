const path = require('path');

module.exports = {
	mode: 'production',
	entry: './src/public/index.ts',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist/public/js')
	},
	devtool: 'source-map',
	module: {
		rules: [{
				test: /\.js\.jsx$/,
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
			},
		{
			test: /\.(jpg|png|svg|gif)$/,
			loaders: 'url-loader'
		},
		]
	},
	resolve: {
		moduleExtensions: ['node_modules']
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist/public'),
		host: "localhost"
	},
};
