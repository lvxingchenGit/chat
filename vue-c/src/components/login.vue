<template>
    <div>
        <h1 style="text-align: center;">Login</h1>
        <el-input v-model="selected.name" placeholder="请输入昵称" ></el-input>
        <div style="color: #666;">请选择头像</div>
        <div style="margin-top: 10px">
            <img
                v-for="(item, i) in url" :key="i"
                style="width: 50px; height: 50px;margin: 0 20px;"
                :class="{isSelect: item.bool}"
                :src="item.src"
                @click="selectImg(item, i)"
            >
        </div>
        <el-button type="primary" style="width: 100%;" @click="toLogin">登录</el-button>
    </div>
</template>

<script>
    export default {
        name:'home',
        data(){
            return {
                url: [{src: require('../assets/1.png'), bool: false},{src: require('../assets/2.png'), bool: false},{src: require('../assets/3.png'), bool: false},
                    {src: require('../assets/4.png'), bool: false},{src: require('../assets/5.png'), bool: false},{src: require('../assets/6.png'), bool: false}],
                selected: {
                    name: '',
                    url: ''
                },
                userList: [] // 用户姓名列表
            }
        },
        mounted() {
          this.$socket.emit('loginRemind')
          this.sockets.listener.subscribe('returnUserList', data => {
              this.userList = data
          })
        },
        methods: {
            toLogin() {
                if (this.check()) {
                    window.localStorage.setItem('chatKey', true)
                    this.$socket.emit('login', this.selected)
                    this.$router.replace('/chat')
                }
            },
            check() {
                if (!this.url.some(i => i['bool'])) {
                    this.$message.error('请选择头像！')
                    return false
                }
                if (!this.selected.name) {
                    this.$message.error('请填写昵称！')
                    return false
                }
                if(this.userList.indexOf(this.selected.name) !== -1) {
                    this.$message.error('昵称重复了！')
                    return false
                }
                return true
            },
            selectImg(item, i) {
                this.url.forEach(it => {it['bool'] = false})
                this.$set(this.url[i], 'bool', true)
                this.selected.url = item['src']
            }
        }
    }
</script>

<style scoped lang="stylus">
    .isSelect
        border: 1.5px solid indianred
</style>
