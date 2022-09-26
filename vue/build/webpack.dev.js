const baseConfig = require('./webpack.base.js')
const {merge} = require('webpack-merge')
const webpack = require('webpack')

const devConfig = {
    // 开发时，设置mode属性为development，要不然就混淆加密打包很慢
    mode: "development",
    // sourceMap
    devtool: 'eval',
    // devServer配置
    devServer: {
        // 指定服务器根目录
        contentBase: './dist',
        host: 'localhost',
        port: 8080,
        // 自动打开浏览器
        open: true,
        hot: true
    },
    // 让webpack监听变化，自动打包
    watch: true,
    // 插件
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}

module.exports = merge(baseConfig, devConfig)