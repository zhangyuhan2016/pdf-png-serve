const logger = require("./logger")
const log = logger()

const methods = ["trace", "debug", "info", "warn", "error", "fatal", "mark"]
const contextLogger = {}

function access(ctx, message, commonInfo = {}) {
  const {
    method,  // 请求方法 get post或其他
    url,		  // 请求链接
    host,	  // 发送请求的客户端的host
    headers	  // 请求中的headers
  } = ctx.request;
  const client = {
    method,
    url,
    host,
    message,
    referer: headers['referer'],  // 请求的源地址
    userAgent: headers['user-agent']  // 客户端信息 设备及浏览器信息
  }
  return JSON.stringify(Object.assign(commonInfo, client));
}

async function timeLogger (ctx, next)  {
  const start = Date.now()

  methods.forEach((method, i) => {
    contextLogger[method] = (message) => {
      log[method](access(ctx, message))
    }
  })
  ctx.log = contextLogger;
  try {
    await next()
  } catch (err) {
    if (ctx && ctx.log && ctx.log.error) {
      if (!ctx.state.logged) {
        ctx.log.error(err.stack)
      }
    }
    ctx.send({
      status: false,
      error: err.code + " : " + err.message,
      data: {
        message: err.message
      },
      message: err.message
    })
  }
  // await next()
  const responseTime = Date.now() - start;
  log.info(access(ctx, {
    responseTime: `响应时间为${responseTime / 1000}s`
  }))
}

function loggerMiddleware() {
  return (ctx, next) => {
    return timeLogger(ctx, next)
      .catch((e) => {
        if (ctx.status < 500) {
          ctx.status = 500;
        }
        ctx.log.error(e.stack);
        ctx.state.logged = true;
        ctx.throw(e);
      })
  }
}


module.exports = {
  log: log,
  loggerMiddleware: loggerMiddleware
}
