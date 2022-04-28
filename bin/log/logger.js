const {PATH_LOGS} = require('../config')
const log4js = require('log4js');

const baseInfo = {
  appLogLevel: 'all',
  dir: PATH_LOGS,
  env: 'dev',
  projectName: 'mini'
}


module.exports = (options) => {
  const appenders = {}

  // 继承自 baseInfo 默认参数
  const opts = Object.assign({}, baseInfo, options || {})
  // 需要的变量解构 方便使用
  const {env, appLogLevel, dir, projectName} = opts

  appenders.cheese = {
    type: 'dateFile',
    filename: `${dir}/log`,
    pattern: 'yyyy-MM-dd.log',
    alwaysIncludePattern: true
  }

  if (env === "dev" || env === "local" || env === "development") {
    appenders.out = {
      type: "console"
    }
  }
  let config = {
    appenders,
    categories: {
      default: {
        appenders: Object.keys(appenders),
        level: appLogLevel
      }
    }
  }

  const logger = log4js.getLogger('cheese');
  log4js.configure(config)


  return logger
}
