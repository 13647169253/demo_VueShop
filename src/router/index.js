import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import welCome from '../components/welCome.vue'
import Users from '../components/user/users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/List.vue'
import addGoods from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'
import Report from '../components/report/Report.vue'


Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: "/login" },
    { path: '/login', component: Login },
    {
      path: '/home', component: Home, redirect: '/welCome',
      children: [
        { path: '/welCome', component: welCome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: GoodsList },
        { path: '/goods/add', component: addGoods },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report },
      ]
    },
  ]
})

// 挂载路由守卫(路由拦截)
router.beforeEach((to, from, next) => {
  // to 将要跳转的页面;form 来自那个页面 ; next 可以进行跳转 
  if (to.path == '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  // next('/xxx') 跳转到某个页面
  if (!tokenStr) return next('/login')
  next()
})


export default router
