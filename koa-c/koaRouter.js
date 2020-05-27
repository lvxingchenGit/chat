

const Router = require('koa-router')
const user = new Router({prefix: '/v1'})
user.get('user', '/user', async (ctx, next) => {
    await next()
    ctx.body = {
        err_code: 'OK'
    }
})

module.exports = {
    user
}


