/**
 * 公用构建配置
 */
const path = require('path');
const webpack = require('webpack');
// 插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
// 目录
const ROOT_PATH = path.resolve(__dirname, '..'); // 前端根目录
const SRC_PATH = path.join(ROOT_PATH, 'src'); // 源码目录

// 网站信息
const info = require('./info');

module.exports = {
  root: ROOT_PATH,
  context: SRC_PATH,
  entry: {
    app: './entries/app.js',
    lib: ['react', 'react-dom', 'react-router'] // 统一打包稳定的框架/库
  },
  output: {
    chunkFilename: '[name].[chunkhash:5].chunk.js',
    path: path.join(ROOT_PATH, 'dist'),
    filename: '[name]-[hash].js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      include: SRC_PATH,
      loader: 'babel',
      query: {
        presets: ['es2015', 'stage-0', 'react'],
        cacheDirectory: true
      }
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style','css!postcss')
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract('style','css!postcss!less')
    }, {
      test: /\.(gif|jpg|png|woff|svg|eot|ttf)$/, // 这些资源包括在js中import或在css中background url引入都会被处理
      loader: 'url?limit=10000&name=[name]-[hash].[ext]' // 小于10k的用url-loader处理生成Data Url，否则用file-loadre处理生成相应资源 [name]-[hash].[ext]
    }, {
      test: /\.(doc|docx)$/,
      loader: 'file'
    }],
  },
  resolve: {
    root: path.join(ROOT_PATH, 'node_modules'), // 指定模块根目录
    extensions: ['', '.js', '.jsx'], // 为区分css/less模块，只有js(x)模块可以省略后缀
    alias: {
      // 自定义路径别名，大写用于区别NPM模块
      ASSETS: path.join(SRC_PATH, 'assets'),
      UTILS: path.join(SRC_PATH, 'utils'),
      MIXINS: path.join(SRC_PATH, 'utils/mixins'),
      PAGES: path.join(SRC_PATH, 'pages'),
      COM: path.join(SRC_PATH, 'components'),
      BCOM: path.join(SRC_PATH, 'business_components')
    }
  },
  plugins: [
    // 提取公用库，提升缓存/编译效率
    new webpack.optimize.CommonsChunkPlugin('lib', 'lib.js'),
    // 在静态根目录（WDS默认是工程根目录）生成html文件及它的相关资源文件，并引用这些资源（WDS在内存中生成）
    new HtmlWebpackPlugin({
      title: info.app.title,
      description: info.app.description,
      keywords: info.app.keywords,
      template: path.join(SRC_PATH, 'entries/app.html'),
      filename: 'index.html', // 生成的html文件
      chunks: ['app', 'lib'],
      favicon: path.join(SRC_PATH, 'assets/favicon.png')
    }),
    // 抽取css文件
    new ExtractTextPlugin('[name].[hash].css', {
      allChunks: true
    }),
    //  hmr
    new webpack.HotModuleReplacementPlugin(),
    // 报错但不退出webpack进程
    new webpack.NoErrorsPlugin(),
  ],
  postcss: function() {
    return [autoprefixer]
  },
}