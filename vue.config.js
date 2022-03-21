const path = require('path')

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
}
