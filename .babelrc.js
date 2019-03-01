module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          browsers: ['ie >= 11']
        },
        // exclude: [],
        modules: false,
        loose: true
      }
    ]
  ]
}