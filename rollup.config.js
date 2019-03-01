import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import commonjs from 'rollup-plugin-commonjs'

import pkg from './package.json'

export default [
  // CommonJS
  {
    input: './index.js',
    output: { file: 'library/aliyun-product.js', format: 'cjs', indent: false },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      babel({
        runtimeHelpers: true
      }),
      commonjs({
        include: 'node_modules/**'
      }),
    ]
  },

  // ES
  {
    input: './index.js',
    output: { file: 'es/aliyun-product.js', format: 'es', indent: false },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true
      }),
      commonjs({
        include: 'node_modules/**'
      })
    ]
  },

  // ES for Browsers
  {
    input: './index.js',
    output: { file: 'es/aliyun-product.mjs', format: 'es', indent: false },
    plugins: [
      nodeResolve({
        jsnext: true
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      }),
      commonjs({
        include: 'node_modules/**'
      }),
    ]
  },

  // UMD Development
  // {
  //   input: './index.js',
  //   output: {
  //     file: 'dist/aliyun-product.js',
  //     format: 'umd',
  //     name: 'AliyunOssProSdk',
  //     indent: false
  //   },
  //   plugins: [
  //     babel({
  //       exclude: 'node_modules/**',
  //       runtimeHelpers: true
  //     })
  //   ]
  // },

  // UMD Production
  {
    input: './index.js',
    output: {
      file: 'dist/aliyun-product.min.js',
      format: 'umd',
      name: 'AliyunOssProSdk',
      indent: false
    },
    plugins: [
      nodeResolve({
        jsnext: true
      }),
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      }),
      commonjs({
        include: 'node_modules/**'
      }),
    ]
  }
]
