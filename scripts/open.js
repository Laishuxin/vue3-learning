const args = require('minimist')(process.argv.slice(2))
const open = require('open')
const { resolve } = require('path')
const target = args._[0] || 'reactivity'
const file = args.f || 'index.html'

// Opens the URL in the default browser.
async function main() {
  await open(resolve(__dirname, `../packages/${target}/__demo__/${file}`))
  console.log(
    'open: ',
    resolve(__dirname, `../packages/${target}/__demo__/${file}`),
  )
}

main()
