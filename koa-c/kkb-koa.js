const Koa = require('koa')
const Router = require('koa-router')
const http = require('http')
const socket = require('socket.io')
const port = 3000
const app = new Koa()
const user = new Router()
app.use(user.routes())
user.get('/', (ctx, next) => {
    console.log(ctx)
    next()
})

const server = http.createServer(app.callback())
const io = socket(server)

let sum = 0
/**
 * socket连接成功之后触发，用于初始化
 *  io.sockets.on(‘connection’, function(socket) {})：
 *
 *  客户端通过socket.send来传送消息时触发此事件，message为传输的消息，callback是收到消息后要执行的回调
    socket.on(‘message’, function(message, callback) {})：

    收到任何事件时触发
    socket.on(‘anything’, function(data) {})：

    socket失去连接时触发（包括关闭浏览器，主动断开，掉线等任何断开连接的情况）
    socket.on(‘disconnect’, function() {})：
 */
const arr = []
// io.on('connection', socket => { // socket链接 on 为给定事件注册一个新的处理程序
//     console.log(socket)
//     console.log('初始化成功')
//     io.emit('getMsg', '初始化成功')
//     // 新人进来 在线人数加 1
//     socket.on('users', data => { // on监听 mysend事件，它是由客户端发起的事件（可自定义）
//         console.log('来自客户端的信息：' + data)
//         if (arr.length > 1) {
//             console.log('istrue', arr[0] === arr[1])
//         }
//         sum ++
//         io.emit('users', sum + '人') // 向所有链接的客户端发出事件  参数：支持所有可序列化的数据结构，包括Buffer
//     })
//
//     // setTimeout(() => {
//     //     socket.emit('sendToClient', '我是初始化3s后的返回消息... ...')
//     // }, 3000)
//
//
//     // ++++++++++  disconnect 自带的方法，监听客户端 断开连接 事件
//     socket.on('disconnect', (reason) => {
//         console.log('用户断开了')
//         sum --
//         io.emit('users', sum) // 将消息发送给所有人
//         /**
//          *  断开原因：
//          *  服务端：（1）传输错误（2）服务端执行了 socket.disconnect()
//          * 客户端：
//          *  （1）客户端断开了数据
//          * （2）客户端在允许的时间内停止了响应
//          * （3）客户端停止发送数据
//          */
//     })
//     // 从新连接socket
//     socket.on('reconnect', (data) => {
//         console.log('data', data)
//         socket.reconnect()
//     })
//
//     // 接收客户端发送来的信息
//     socket.on('send', data => {
//         // socket.emit('getMsg', data) // 通知触发该方法的客户端
//         io.emit('getMsg', data) // 通知所有客户端
//     })
//
//
//     // ++++++++++error 发生错误时触发
//     socket.on('error', (err) => {
//         console.log('收到了一条错误！')
//     })
// })
let count = 0
let userList = []
io.on('connection', socket => {
    // 监听进入登录页
    socket.on('loginRemind', () => {
        let userL = userList.reduce((prev, next) => {
            userList.length && prev.push(next['name'])
            return prev
        }, [])
        console.log('userList', userL)
        socket.emit('returnUserList', userL)
    })
    // 监听进入聊天室
    socket.on('login', data => {
        count ++
        handlerUserInfo(data, socket)
        socket.emit('remindMe', data) // 把个人信息在返回给他，（页面左上角需要显示个人信息）
        io.emit('remindAll', userList, data, {sum: count}, {chatKey: 'chatKey'} ) // 广播给所有人
    })
    // 监听离开(浏览器关闭 或 刷新都可以监听到) disconnect是自带的监听离开的事件
    // socket.on('disconnect', () => {
    //     console.log('有人刷新离开了：', socket.username)
    //     reSet(socket)
    // })
    // 监听消息
    socket.on('sendMessage', data => {
        io.emit('returnMessage', data)
    })
    // 监听离开浏览器关闭、刷新、后退事件（从聊天室后退 - 算退出登录）
    socket.on('selfDisconnect', data => {
        console.log('有人离开了：', socket.username)
        reSet(socket)
    })
    socket.on('test', data => {
        console.log(data)
    })
})
// 监听浏览器关闭 后退 刷新 - 需要重新登录
function reSet(socket) {
    count --
    count = count <= 0 ? 0 : count
    filterUserInfo(socket)
    io.emit('leave', { leaveUser: { name: socket.username, url: socket.url }, leftUser: userList, sum: count })
}


function handlerUserInfo(data, socket) {
    userList.unshift(data)
    socket['username'] = data['name']
    socket['url'] = data['url']
}
// 谁离开了
function filterUserInfo(socket) {
    userList = userList.filter(i => {
        return i['name'] !== socket['username']
    })
}

server.listen(port, () => {
    console.log('服务连接了')
})




