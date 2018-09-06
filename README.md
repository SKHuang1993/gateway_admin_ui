# Gateway Admin UI

> Gateway 可视化管理界面

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 基本使用方法

Gateway 后端核心服务请查阅 [fagongzi/gateway](https://github.com/fagongzi/gateway)

Admin UI 由[唱道](https://www.ttsing.com)技术团队开发、整理（VUE、Element、VUErouter、axios组件开发完成）

一、部署docker以及Gateway镜像

Gateway的镜像（核心后端服务）采用的是https://github.com/fagongzi/gateway，使用 docker pull fagongzi/gateway 命令下载Docker镜像，使用 docker run -d -p 0.0.0.0:80:80 -p 9093:9093 fagongzi/gateway 运行镜像。

Gateway的镜像运行后，会启动两个端口80、9093

80端口：Proxy的http端口，这个端口就是直接为终端用户服务的

9093端口：APIServer的对外GRPC的端口，即为Admin UI服务的，需要在Nginx代理进行相关转发配置


二、部署Admin UI、Nginx代理

dist目录为最新编译后的项目，直接通过Nginx代理、绑定即可。

``` bash
server{
     listen 3000;#Admin UI端口
     server_name localhost;
     root /Volumes/Data/gitlab/changdao_go_gateway/src/web/dist;#dist目录

     location /Web/ {#必须为Web
          proxy_pass http://localhost:9093/;#转发至Gateway 9093端口
     }
}
```

三、访问Admin UI

根据自己配置的Admin UI端口，访问即可，例如localhost:3000






