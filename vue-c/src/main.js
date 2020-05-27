/* eslint-disable */
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import Io from 'vue-socket.io'
const PATH = 'ws://localhost:3000'
Vue.use(new Io({
    debug: true,
    connection: PATH
}))
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.use(ElementUI)
new Vue({
  router,
  // store,
  render: h => h(App),
}).$mount('#app')


/**
 * 1、路由切换时另一个路由是销毁！！！
 * 2、router-link被渲染到页面时是a标签，路由被选中时，会被添加两个类名，使用router-link-exact-active
 * 可以添加被选中时的样式！！！
 *
 *
 *
 *
 * */
