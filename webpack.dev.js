const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');

 module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 3001,
        proxy: {
            '/': 'http://localhost:8080'
        }
    },
    plugins: [
        new Dotenv({
            path: '.env/dev.env',
            allowEmptyValues: true,
        })
    ],
});