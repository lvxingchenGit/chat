import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login'
import Chat from '@/components/chat'
Vue.use(VueRouter)
const router = new VueRouter({
    routes:[
        {
            path:'/',
            redirect: '/login'
        },
        {
            path:'/login',
            component:Login
        },
        {
            path:'/chat',
            component:Chat
        }
    ]
})
router.beforeEach((to, from, next)=>{
    if (to.path === '/chat') { // 判断当前用户是否已拉取完user_info信息
        if (!window.localStorage.getItem('chatKey') || from.path !== '/login') {
            next('/login')
            return
        }
    }
    next()
})
export default router

