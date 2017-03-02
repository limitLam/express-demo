/**
 * 生产构建配置
 */
const path = require('path');
const webpack = require('webpack');
// 公用配置
const commonConfig = require('./webpack.common');
// 插件
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 路径
const ROOT_PATH = commonConfig.root; // 项目根目录
const DIST_PATH = path.join(ROOT_PATH, 'dist'); // 产出路径

module.exports = Object.assign(commonConfig, {
    // devtool: 'source-map', // 'eval'  生产配置这个： cheap-source-map  测试配置这个：source-map
    cache: false,
    plugins: commonConfig.plugins.concat([
        // 配置全局常量
        new webpack.DefinePlugin({
            'process.env': { // React/Redux打包常用
                NODE_ENV: JSON.stringify('production')
            },
            __DEV__: false,
            __CORS__: false // CORS跨域请求
        }),
        // 根据模块调用次数，给模块分配ids，常被调用的ids分配更短的id，使得ids可预测，降低文件大小（for [hash] or [chunkhash]）
        new webpack.optimize.OccurrenceOrderPlugin(),
        // 删除重复或者相似的文件
        new webpack.optimize.DedupePlugin(),
        // 最优合并，以平衡请求大小比例
        new webpack.optimize.AggressiveMergingPlugin({
            minSizeReduce: 1.5,
            moveToParents: true
        }),
        // 清空dist目录
        new CleanWebpackPlugin([DIST_PATH], {
            root: ROOT_PATH
        }),
        // 压缩js/css
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                // drop_debugger: true,
                // drop_console: true
            }
        }),
        // 复制polyfill文件到dist目录
        new CopyWebpackPlugin([{
            from: path.join(ROOT_PATH, 'polyfill'),
            to: path.join(DIST_PATH, 'polyfill')
        }])
    ])
});