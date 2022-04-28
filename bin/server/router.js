const { LISTEN_PORT, PATH_ROOT, DOMAIN } = require('../config')
const Koa = require('koa')
const StaticServer = require('koa-static')
const Router = require('koa-router')
const createFileOfURL = require('../create-pdf/pdf')

const logger = require('../log/index')
const miSend = require('./middleware')
const errorHandle = require('./errorHandle')

const app = new Koa()

app.use(StaticServer(PATH_ROOT))

app.use(logger.loggerMiddleware())
app.use(miSend())
app.use(errorHandle())

const router = new Router({
    prefix: '/api'
})

function transformQuery (query) {
    const transformQuery = {}
    Object.keys(query).forEach(v => {
        let val = query[v]
        if (/^\d+$/.test(val)) {
            val = Number(val)
        }
        if (/^(true||false)$/.test(val)) {
            val = Boolean(val === 'true')
        }
        transformQuery[v] = val
    })
    return transformQuery
}

router.get('/to/:type/:name', async ctx => {
    const { type, name } = ctx.params
    const query = transformQuery(ctx.query)
    const url = ctx.originalUrl.match(/url=(.*?)$/)[1]
    // 获取对应PDF
    logger.log.debug(type, url)
    logger.log.debug(query)
    const result = await createFileOfURL(url, type, Object.assign({ filename : name }, query))
    // 成功通知
    ctx.send({
        status: true,
        data: {
          path: result.replace(PATH_ROOT, `${DOMAIN}`)
        }
    })
})

app.use(router.routes())

app.listen(LISTEN_PORT);
logger.log.info('app start run port ' + LISTEN_PORT)
