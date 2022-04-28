## puppeteer-pdf-png-serve

### Docker
> docker pull zhangyuhan2016/pdf-png-serve
```
ENV
APP_PATH=/project/puppeteer-pdf-png-serve

Prots 
8088

Volumes
$APP_PATH/web/logs
$APP_PATH/web/files
```

### CLI Start

```
yarn run serve
```

### Use Serve
```
 # PDF
 http://localhost:8088/api/to/pdf/filename?dir=pdf&url=https://www.baidu.com
 # IMG
 http://localhost:8088/api/to/img/filename?nocache=true&dir=img&url=https://www.baidu.com?search=test
```

### Preview Serve
```
# Logs
http://localhost:8088/logs/log.yyyy-MM-dd.log
# Files
http://localhost:8088/files/dir/filename.ext
```

### Tip
> If URL has parameters, be sure to pass as the last parameter

### Configs
```
# pdf default config
{
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
    }
    # more puppeteer page.pdf options
    path: filename.ext,
    ...
   
}
# img default config
{
    filename: 'png',
    ext: 'png',
    dir: '',
    nocache: false,
    width: '1280',
    height: '800',
    fullPage: true
    # more puppeteer page.screenshot options
    path: filename.ext,
    ...
}

```
