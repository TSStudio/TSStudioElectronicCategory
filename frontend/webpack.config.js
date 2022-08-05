const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack'); 
const config = {
    entry: './src/app.js',
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true, 
                parallel: true, 
                sourceMap: true
            }),
            new OptimizeCssAssetsPlugin({})
        ],
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename:'bundle.js'
    },
    module: {
        rules: [
        {
            test: /\.txt$/,
            use: 'raw-loader' 
        },
        {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader'
            ] 
        }
        ]
    },
    mode: 'production',
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.min.css'
        }),
    ]
};
module.exports = config;