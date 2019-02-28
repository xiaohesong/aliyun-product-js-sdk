import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

export default [
  // CommonJS
  {
    input: './index.js',
    output: { file: 'lib/aliyun-product-js-sdk.js', format: 'cjs', indent: false },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [babel()]
  },

  // ES
  {
    input: './index.js',
    output: { file: 'es/aliyun-product-js-sdk.js', format: 'es', indent: false },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [babel()]
  },

  // ES for Browsers
  {
    input: './index.js',
    output: { file: 'es/aliyun-product-js-sdk.mjs', format: 'es', indent: false },
    plugins: [
      nodeResolve({
        jsnext: true
      })
    ]
  },

  // UMD Development
  {
    input: './index.js',
    output: {
      file: 'dist/aliyun-product-js-sdk.js',
      format: 'umd',
      name: 'AliyunOssProSdk',
      indent: false
    },
    plugins: [
      babel({
        exclude: 'node_modules/**'
      })
    ]
  },

  // UMD Production
  {
    input: './index.js',
    output: {
      file: 'dist/aliyun-product-js-sdk.min.js',
      format: 'umd',
      name: 'AliyunOssProSdk',
      indent: false
    },
    plugins: [
      nodeResolve({
        jsnext: true
      }),
      babel({
        exclude: 'node_modules/**'
      })
    ]
  }
]
