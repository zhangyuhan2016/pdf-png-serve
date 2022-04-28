const { PATH_FILES } = require('../config')
const logger = require('../log/index')
const puppeteer = require('puppeteer');
const fs = require('fs')
const path = require('path')


// 生成
async function initBrowser () {
  logger.log.debug('启动', new Date().toLocaleString())
  return await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
}

let browser = null

function checkCache (fPath) {
  try {
    const fStat = fs.statSync(fPath)
    if (fStat) {
      const isFile = fStat.isFile()
      if (isFile) {
        return fPath
      }
    }
    return false
  } catch (err) {
    return false
  }
}

function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Done waiting");
      resolve(ms)
    }, ms)
  })
}


async function createFileOfURL (url, type = 'pdf', config = {}) {
  if (!browser) {
    browser = await initBrowser()
  }
  const PdfConfig = {
    filename: 'pdf',
    ext: 'pdf',
    dir: '',
    nocache: false,
    width: '950px',
    height: '1360px',
    printBackground: true,
    margin: {
      top: 0,
      bottom: 0
    },
  }
  const ImgConfig = {
    filename: 'png',
    ext: 'png',
    dir: '',
    nocache: false,
    width: '1280',
    height: '800',
    fullPage: true
  }
  config = Object.assign( type === 'pdf' ? PdfConfig : ImgConfig, config)
  // 文件路径
  const outPath = path.join(PATH_FILES, config.dir)
  if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath);
  }
  const outConfig = Object.assign({ path: `${config.filename}.${config.ext}` }, config)
  outConfig.path = path.join(outPath, outConfig.path)
  // 检查缓存
  if (!config.nocache) {
    const result = checkCache(outConfig.path)
    if (result) {
      logger.log.debug('命中缓存文件')
      return result
    }
  }
  const page = await browser.newPage();
  try {
    await page.setDefaultNavigationTimeout(0)
    await page.goto(url, {waitUntil: 'networkidle2'});
    await wait(config.delay || 1000)
    logger.log.debug('等待生成', new Date().toLocaleString())

    if (type === 'pdf') {
      await page.pdf(outConfig);
    } else {
      if (!Number.isNaN(Number(outConfig.width))) {
        await page.setViewport({
          width: Number(outConfig.width),
          height: Number(outConfig.height)
        })
      }
      await page.screenshot(outConfig)
    }

    await page.close();

    logger.log.debug('当前时间', new Date().toLocaleString())
    return outConfig.path
  } catch (e) {
    logger.log.debug(e)
    await page.close();
  }
}

module.exports = createFileOfURL





