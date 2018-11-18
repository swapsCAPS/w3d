const path               = require('path')
const HtmlWebpackPlugin  = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ThreeWebpackPlugin = require('@wildpeaks/three-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const outputPath = path.resolve(__dirname, 'dist')


module.exports = {
  entry: './src/index.js',

  output: {
    filename:      '[name].bundeltje.js',
    path:          outputPath,
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ThreeWebpackPlugin(),
    new CopyWebpackPlugin([ { from: './src/assets/*.bin', to: `${outputPath}/bin`, flatten: true } ]),

    new HtmlWebpackPlugin({
      title: 'w3d',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader', // creates style nodes from JS strings
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        }, {
          loader: 'less-loader', // compiles Less to CSS
        }],
      },
      {
        test:    /\.(jpe?g|png)$/i,
        loaders: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            query:  {
              pngquant: {
                quality: '65-90',
                speed:   4,
              },
            },
          },
        ],
      },
      {
        test:    /\.(gltf|bin)$/i,
        loaders: [
          'file-loader',
        ],
      },
    ],
  },
}
