// node scripts/dev.js ...rest
const args = require('minimist')(process.argv.slice(2))
const { resolve } = require('path')
const esbuild = require('esbuild')

const target = args._[0] || 'reactivity'
const format = args.f || 'global'
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))
const outputFormat = format.startsWith('global')
  ? 'iife'
  : format === 'cjs'
  ? 'cjs'
  : 'esm'

const outfile = resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${format}.js`,
)

esbuild
  .build({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile,
    bundle: true,
    sourcemap: true,
    format: outputFormat,
    globalName: pkg.buildOptions?.name,
    platform: format === 'cjs' ? 'node' : 'browser',
    watch: {
      onRebuild(error) {
        if (error) console.warn('onRebuild err: ', error)
        else console.log('rebuild...')
      },
    },
  })
  .then(() => {
    console.log('esbuild building...')
  })
