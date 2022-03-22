const path = require('path')
// const px2rem = require('postcss-plugin-px2rem')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack: (config) => {
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
  // css: {
  //   loaderOptions: {
  //     portcss: {
  //       plugins: [px2rem(px2remOptions)],
  //     },
  //   },
  // },
}
