const path = require('path')

const rootDir = path.resolve(__dirname, '../web/')

const config = {
  PATH_ROOT: rootDir,
  PATH_LOGS: path.join(rootDir, 'logs'),
  PATH_FILES: path.join(rootDir, 'files'),
  LISTEN_PORT: '8088',
  DOMAIN: ''
}

module.exports = config
