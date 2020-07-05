const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: {
        content: './src/index.js',
        background: './src/injector.js',
    },
    output: {
        publicPath: '.',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.styl$/,
                use: [
                    { loader: 'style-loader', options: { attributes: { class: 'insertStyle' } } },
                    'css-loader',
                    'stylus-loader',
                ],
            },
            { test: /\.svg$/, loader: 'svg-inline-loader' },
            {
                test: /\.(png|jpg|gif|woff|woff2)$/i,
                use: ['url-loader'],
            },
        ],
    },
    mode: 'production',
    // devtool: 'source-map',
    performance: { hints: false },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
        new CopyPlugin({
            patterns: [{ from: './manifest.json' }, { from: './src/icons/', to: 'icons/' }],
        }),
    ],
};
