const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'? '/Monaco-EasyCodeEditor/': '/',
  outputDir: 'dist',
  lintOnSave: true,
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin()
    ]
  }
}
