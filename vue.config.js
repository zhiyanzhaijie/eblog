const path = require('path')
// const px2rem = require('postcss-plugin-px2rem')
function resolve(dir) {
  return path.join(__dirname, dir)
}

//是否为生产环境
const isProd = process.env.NODE_ENV.startsWith('prod')
// cdn
const cdn = {
  css: [
    'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.7/theme-chalk/index.min.css',
  ],
  js: [
    'https://cdn.bootcdn.net/ajax/libs/vue/2.6.14/vue.min.js',
    'https://cdn.bootcdn.net/ajax/libs/vuex/3.6.2/vuex.min.js',
    'https://cdn.bootcdn.net/ajax/libs/vue-router/3.5.1/vue-router.min.js',
    'https://cdn.bootcdn.net/ajax/libs/axios/0.26.1/axios.min.js',
    'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.7/index.min.js',
  ],
}
// externals
const externals = {
  axios: 'axios',
  'element-ui': 'ELEMENT',
  vue: 'Vue',
  vuex: 'Vuex',
  'vue-router': 'VueRouter',
}
module.exports = {
  chainWebpack: (config) => {
    config.when(isProd, (config) => {
      // 改变入口
      config.entry('app').clear().add('./src/main-prod.js')
      config.set('externals', externals)
      config.plugin('html').tap((args) => {
        args[0].cdn = cdn
        return args
      })
    })
    // 开发环境
    config.when(!isProd, (config) => {
      // 改变入口
      config.entry('app').clear().add('./src/main-dev.js')
    })

    config.resolve.alias.set('@', resolve('src'))
  },
  // 配置代理
  devServer: {
    proxy: {
      '/admin': {
        target: 'http://127.0.0.1:7001',
        ws: true,
        changeOrigin: true,
      },
    },
  },
}
