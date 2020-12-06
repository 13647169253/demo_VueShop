import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入icon图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入axios包
import Axios from 'axios'
// 导入tree插件
import TreeTable from 'vue-table-with-tree-grid'
// 导入vue-quill-editor
import vueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置默认路由
Axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
Axios.interceptors.request.use(config => {
  // 为每一次的axios请求添加携带token的请求头
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 响应拦截器
Axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.prototype.$http = Axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

Vue.use(vueQuillEditor)

// 定义一个全局的过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1).toString().padStart(2, '0')
  const d = (dt.getDate()).toString().padStart(2, '0')
  const hh = (dt.getHours()).toString().padStart(2, '0')
  const mm = (dt.getMinutes()).toString().padStart(2, '0')
  const ss = (dt.getSeconds()).toString().padStart(2, '0')
  return `${y}-${m}-${d} /  ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
