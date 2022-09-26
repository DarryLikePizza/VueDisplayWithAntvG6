// 创建Vue根实例
import Vue from 'vue'

// 导入router
import router from './router'

// 导入App组件
import App from './App.vue'

// 引入echarts
import echarts from 'echarts'

import axios from 'axios'

import 'element-ui'

Vue.prototype.$echarts = echarts

new Vue({
    el: '#app',
    // 挂载App组件
    router,
    render: h => h(App),

    components: {
        // 组件名： 组件对象
        App: App,
    },
    // 渲染
    template: '<App/>',
    
    '/api': {
        target: 'http://localhost:8082/',//此处可以换成自己需要的地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
    }
})
