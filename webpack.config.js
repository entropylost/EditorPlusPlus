const path = require('path');
const webpack = require('webpack');
//const CopyPlugin = require('copy-webpack-plugin');
//const ExtensionReloader = require('webpack-extension-reloader');
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
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
        ],
    },
    mode: 'development',
    devtool: 'source-map',
    performance: { hints: false },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
        /*
        new CopyPlugin([{ from: './src/manifest.json'}]),
        new ExtensionReloader({ manifest: './src/manifest.json' }),
        */
    ],
};
