const { resolve } = require('path')
const esbuild = require('esbuild')

esbuild.build({
  entryPoints: [resolve(__dirname, 'index.js')],
  bundle: true,
  outfile: resolve(__dirname, './bundle.js'),
  target: 'es6',
  sourcemap: true,
  watch: true,
})
