var path = require("path");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin'); // html模板 压缩

module.exports = {
  entry: "",
  output: {

  },

  plugins: [

    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    }),

    // 如果是多文件，需要多次 new HtmlWebpackPlugin({});
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/index.html"), // 以什么为 模板
      title: 'Output Management',
      filename: "index.html", // 打包后的html的名称 
      chunk: ['index.js'], // html生成后加入的js的文件名称
      meta: {
        'viewport': "",
      },
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false,
      }
    }),
  ],
}