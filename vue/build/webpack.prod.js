const baseConfig = require('./webpack.base.js')
const {merge} = require('webpack-merge')

const prodConfig = {
    // 开发时，设置mode属性为development，要不然就混淆加密打包很慢
    mode: "production",
}

module.exports = merge(baseConfig, prodConfig)