<template>
    <div>
        <h1>chat聊天室</h1>
        <div style="width: 600px; height: 400px; border: 1px solid #666;display: flex;">
            <div class="left">
                <div class="li">
                    <el-avatar :size="30" :src="info.url" shape="square"></el-avatar>
                    <span style="font-size: 12px;">{{ info.name || '暂无' }}</span>
                </div>
                <span style="color:#fff; font-size: 12px;padding: 10px;border-bottom: 2px solid #434951;background: #373f42;">用户列表</span>
                <div class="li li-list" v-for="(item, i) in leftList" :key="i">
                    <el-avatar :size="30" :src="item.url" shape="square"></el-avatar>
                    <span style="font-size: 12px;">{{ item.name || '暂无' }}</span>
                </div>
            </div>
            <div class="right">
                <div class="title">聊天室({{ num }}人)</div>
                <div class="top">
                    <div class="info-list" v-for="(item, index) in infoList" :key="item.name">
                        <div v-if="item.name" style="text-align: center; color: #ccc; font-size: 12px;padding: 5px 0;">{{ item.name }} - 进入了聊天室</div>
                        <div v-if="item.leaName" style="text-align: center; color: #ccc; font-size: 12px;padding: 5px 0;">{{ item.leaName }} - 离开了聊天室</div>
                        <div v-if="item.right" class="right-info">
                            <span class="msg">{{ item.myTxt }} </span>
                            <el-avatar :size="30" :src="item.myUrl" shape="square"></el-avatar>
                        </div>
                        <div v-if="item.left" class="left-info">
                            <el-avatar :size="30" :src="item.leftUrl" shape="square"></el-avatar>
                            <span class="msg">{{ item.leftTxt }} </span>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <el-input
                        style="overflow: auto;"
                        type="textarea"
                        :rows="5"
                        placeholder="请输入内容"
                        v-model="textValue"
                        @keydown.native="stopD($event)"
                    >
                    </el-input>
                    <el-button class="btn" type="primary" @click.enter="sendMessage">发送</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    let userInfo = {}
    export default {
        name:'home',
        data(){
            return {
                leftList: [], // 左侧列表信息
                info: {}, // 个人信息
                textValue: '',
                num: 0, //人数
                infoList: []
                // leaveUser: {} // 记录离开人的信息
            }
        },
        watch: {
            // 'info.name'() {
            //     this.$router.replace('/')
            // }
        },
        created() {
            // ------------------以下都是初始化监听事件
            // 登录拿到个人信息
            this.listenerEvent('remindMe', (data) => {
                this.info = data

            })
            // 实时获取左侧栏数据
            this.listenerEvent('remindAll', (data) => {
                this.leftList = data[0]
                this.infoList.push(data[1])
                this.num = data[2]['sum']

            })
            // 监听发送的消息
            this.listenerEvent('returnMessage', data => {
                // 区分到底是自己发的消息（在右边显示）还是别人发的消息（在左边显示）
                if (data['name'] === userInfo['name']) {
                    this.infoList.push({
                        myTxt: data['txt'],
                        myUrl: data['url'],
                        right: true
                    })
                }else {
                    this.infoList.push({
                        leftTxt: data['txt'],
                        leftUrl: data['url'],
                        left: true
                    })
                }
            })
            // 检测断开与服务器链接
            // console.log(this.$socket)
        },
        mounted() {
            //监听用户离开
            this.userOut()
        },
        destroyed() {
            window.localStorage.removeItem('chatKey')
        },
        methods: {
            listenerEvent(handler, callback) {
                this.sockets.listener.subscribe(handler, callback)
            },
            stopD(e) {
                if (e.keyCode === 13) {
                    this.sendMessage() // 发送文本
                    e.preventDefault() // 阻止浏览器默认换行操作
                    return false
                }
            },
            sendMessage() {
                if (!this.textValue) return
                this.info['txt'] = this.textValue
                userInfo = this.info
                this.textValue = ''
                this.$socket.emit('sendMessage', {...this.info})
            },
            logOut() {
                this.$message.error('您已掉线，请从新登陆！')
                this.$router.replace('/')
                window.localStorage.removeItem('chatKey')
            },
            userOut() {
                // 为什么不用socket.io自带的事件disconncect来监听用户离开 ?
                // 答：因为在login登录页如果刷新或退出页面也算是用户离开，所以下边我用自定义监听用户离开的事件。
                // 监听浏览器的关闭/刷新/后退事件，只要退出聊天室就需要重新登陆。

                // 从聊天页回退到登录页，socket.io自带的事件disconncect是监听不到，为什么 ?
                // 答：监听浏览器后退事件（之所以要监听后退事件：如果从聊天页面后退到登录页面socket.io自带的事件disconncect是监听不到）
                // 原因很简单：因为当前的用户没有断开socket链接， 登录页也是连着的！！！

                window.addEventListener('popstate', () => {
                    this.$socket.emit('selfDisconnect', 'chat')
                    this.logOut()
                }, false)
                window.addEventListener('beforeunload', () => {
                    this.$socket.emit('selfDisconnect', 'chat')
                    this.logOut()
                }, false)
                //监听用户离开的返回结果
                this.listenerEvent('leave', (data) => {
                    this.num = data['sum']
                    this.leftList = data['leftUser']
                    this.infoList.push({ leaName: data['leaveUser']['name'] })
                    // this.leaveUser = data['leaveUser']
                })
            }
        }
    }
</script>

<style scoped lang="stylus">
    .left
        display flex
        flex-direction column
        width 30%
        background #282d2e
        overflow auto
        .li:nth-of-type(1)
            border-bottom 1px solid #3c434b
        .li
            display flex
            justify-content space-between
            align-items center
            color #666
            padding 10px
            box-sizing border-box
            border-bottom 1px solid #3c434b
            span
                font-szie 11px
                color grey
        .li-list
            background #2c3437
    .right
        display flex
        flex-direction column
        height 100%
        width 70%
        .title
            display flex
            justify-content center
            align-items center
            color #666
            font-size 12px
            padding 10px 0
            margin 0 5px
            border-bottom 2px solid #ccc
        .top
            height 70%
            overflow auto
            padding 10px
            .info-list
                width 100%
                .right-info
                    display flex
                    justify-content flex-end
                    width 100%
                    margin 10px 0
                    .msg
                        color #fff
                        background #01b456
                        font-size 12px
                        padding 5px 10px
                        margin-right 5px
                        border-radius 5px
                        max-width 50%
                .left-info
                    width 100%
                    display flex
                    margin 10px 0
                    .msg
                        max-width 50%
                        color #fff
                        background #01b456
                        font-size 12px
                        padding 5px 10px
                        margin 0 5px
                        border-radius 5px
        .bottom
            position relative
            height 30%
            .btn
                position absolute
                right 0px
                bottom 0px
</style>
