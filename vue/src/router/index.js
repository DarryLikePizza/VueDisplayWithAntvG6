import Vue from 'vue'
import Router from 'vue-router'

// 文件导入界面
import Import from '../components/Import/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Import
    },
  ]
})