/**
 * 开发构建配置
 */
const path = require('path');
const webpack = require('webpack');
// 公用配置
const commonConfig = require('./webpack.common');
// WDS
const utils = require('./utils');
const HOST = utils.getIP();
const PORT = 8090;

module.exports = Object.assign(commonConfig, {
    devtool: 'source-map', // 'eval'  生产配置这个： cheap-source-map  测试配置这个：source-map
    cache: true,
    plugins: commonConfig.plugins.concat([
        // 配置全局常量
        new webpack.DefinePlugin({
            'process.env': { // React/Redux打包常用
                NODE_ENV: JSON.stringify('development')
            },
            __DEV__: true
        })
    ]),
    // webpack dev server 配置
    devServer: {
        hot: true,
        inline: true,
        progress: true,
        host: HOST,
        port: PORT,
        historyApiFallback: true,
        stats: 'errors-only',
        proxy: {
            '/api/*': {
                target: 'http://192.168.8.160:20160/', // mock服务器
                // target: 'http://192.168.9.154:8081/',
                pathRewrite: {
                    '^/api': ''
                },
                secure: false
            }
        }
    }
});