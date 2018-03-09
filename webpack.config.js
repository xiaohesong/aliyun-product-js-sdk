var webpack = require('webpack');
var path = require('path')

const { NODE_ENV } = process.env;

const filename = `aliyun-product${NODE_ENV === 'production' ? '.min' : ''}.js`;

const plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  }),
];

NODE_ENV === 'production'  && plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      screw_ie8: true,
      warnings: false,
    },
  })
);

module.exports = {
  entry: ['babel-polyfill', './index.js'],

  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    library: 'AliyunProduct',
    libraryTarget: 'umd',
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
                    "presets": [
                        "es2015",
                        "stage-0"
                    ],
                    plugins: [
                      ["transform-runtime", {
                        "helpers": false, // defaults to true
                        "polyfill": false, // defaults to true
                        "regenerator": true, // defaults to true
                        "moduleName": "babel-runtime" // defaults to "babel-runtime"
                      }]
                   ]
              }
      }
    ]
  },

  plugins,
};
