// 零时解决 ESLint 报错 ;
module.exports = {
  lintOnSave: false,
  css: {
    extract: false
  },
  // 默认打包入口的设置
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
    })
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }
}
