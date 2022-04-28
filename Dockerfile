# 构建基础镜像
    FROM alpine:3.15 AS base

    # 设置环境变量
    ENV NODE_ENV=production \
        APP_PATH=/project/puppeteer-pdf-png-serve \
        PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
        PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

    # 设置工作目录
    WORKDIR $APP_PATH

    # 安装 nodejs 和 yarn
    RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
    RUN apk add --no-cache --update \
          chromium=99.0.4844.84-r0 \
          nss \
          freetype \
          harfbuzz \
          ca-certificates \
          ttf-freefont \
          nodejs=16.14.2-r0  \
          yarn=1.22.17-r0

# 使用基础镜像 装依赖阶段
    FROM base AS install

    # 拷贝 package.json 到工作跟目录下
    COPY package.json .

    # 安装依赖
    RUN yarn config set registry https://registry.npm.taobao.org --global
    RUN yarn config set disturl https://npm.taobao.org/dist --global
    RUN yarn

# 最终阶段，也就是输出的镜像是这个阶段构建的，前面的阶段都是为这个阶段做铺垫
    FROM base

    # 拷贝 装依赖阶段 生成的 node_modules 文件夹到工作目录下
    COPY --from=install $APP_PATH/node_modules ./node_modules

    # 将当前目录下的所有文件（除了.dockerignore排除的路径），都拷贝进入镜像的工作目录下
    COPY . .

    EXPOSE 8088

    # 启动
    CMD yarn serve
