const path = require('path')

// 引入vue-loader插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')

// 引入html-webpack-plugin插件
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 引入clean-webpack-plugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// es6结构语法 清理后重新打包

module.exports = {
    // 打包入口文件
    entry: './src/main.js',
    // 出口文件
    output: {
        filename: 'bundle.js',//打包生成的文件
        // path要使用绝对路径，导入path模块
        path: path.resolve(__dirname, '../dist')//目录
    },
    // 让webpack监听变化，自动打包
    watch: true,
    // 打包规则
    module: {
        rules:
            [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.vue$/, // 正则表达式，匹配以vue结尾的文件
                    loader: 'vue-loader' //打包工具
                },
                {
                    test: /\.(jpg|jpeg|png|svg)$/,
                    loader: 'url-loader',
                    options: {
                        name: '[name].[ext]',
                        limit: 2048
                    }
                },
                {
                    test: /\.css$/,
                    //从右到左，从上到下顺序执行
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.styl(us)?$/,
                    use: [
                        'vue-style-loader',
                        'css-loader',
                        'postcss-loader',
                        'stylus-loader'
                    ]
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                    loader: 'file-loader'
                },
                {
                    test: /\.proto$/,
                    loader: path.join(__dirname, ".."),
                    options: {
                        // both methods are static internally
                        // but result api differs
                        // https://github.com/grpc/grpc/tree/master/examples/node
                        static: false,

                        // grpc props
                        // https://github.com/grpc/grpc-node/blob/master/packages/grpc-protobufjs/index.js#L37-L42
                        //  convertFieldsToCamelCase,
                        //  binaryAsBase64,
                        //  longsAsStrings,
                        //  enumsAsStrings,
                    },
                }
            ]
    },
    // 插件
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new CleanWebpackPlugin()
    ],
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js',
            '@': path.resolve(__dirname, '../src'),
            'styles': path.resolve(__dirname, '../src/assets/styles'),
            'images': path.resolve(__dirname, '../src/assets/images')
        },
        fallback: {
            "grpc": require.resolve("grpc"),
            "protoLoader": require.resolve("@grpc/proto-loader"),
            "assert": require.resolve("assert/"),
            "path": require.resolve("path-browserify"),
            "os": require.resolve("os-browserify/browser"),
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer/"),

        }
    }
}