/* eslint-disable camelcase */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePoyfillWebpackPlugin = require('node-polyfill-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './Lab3/client/src/index.js',
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, './Lab3/client/dist'),
    },
    plugins: [
        new NodePoyfillWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './Lab3/client/src/index.html',
        }),
    ],
    resolve: {
        modules: [__dirname, 'src', 'node_modules'],
        extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
        fallback: {
            fs: false,
            esbuild: false,
            '@swc/core': false,
            'uglify-js': false,
            worker_threads: false,
            child_process: false,
        },
        alias: {
            '@components': path.join(__dirname, 'Lab3/client/src/components'),
            '@GraphQL': path.join(__dirname, 'Lab3/client/src/GraphQL'),
            '@Layout': path.join(__dirname, 'Lab3/client/src/Layout'),
        },
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: require.resolve('babel-loader'),
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'local',
                                localIdentName:
                                    '[name]__[local]___[hash:base64:5]',
                            },
                        },
                    },
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.png|svg|jpg|gif$/,
                use: ['file-loader'],
            },
        ],
    },
};
