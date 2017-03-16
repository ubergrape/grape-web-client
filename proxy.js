/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const Proxy = require('http-mitm-proxy')
const parseArgs = require('minimist')
/* eslint-enable import/no-extraneous-dependencies */
const moment = require('moment')
const http = require('http')
const https = require('https')
const fs = require('fs')

const caFolder = './ca'
const chatgrapeCACertsFileName = 'chatgrape-labs.pem'
const mozillaCACertsURL = 'https://curl.haxx.se/ca/cacert.pem'
const mozillaCACertsFileName = 'mozilla-root-certs.pem'
const updateAfter = [7, 'days']

// Parse argv params.
const argv = parseArgs(process.argv.slice(2))
const listenOnPort = argv.port || '3128'
const devHost = argv.devHost || 'localhost'
const devPort = argv.devPort || '8080'
const devPath = argv.devPath || '/dist/app'
const helpRequested = argv.h || argv.help

const proxy = Proxy()
const keepAlive = true
const httpAgent = new http.Agent({keepAlive})

function printHelp() {
  console.log(`
    Start a proxy that intercepts dev and staging server requests and
    redirect relevant front-end request to the local dev server.

    Usage
      node ./proxy.js

    Options
      --port      Port to listen on
      --devHost   Host of dev server
      --devPort   Port of dev server
      --devPath   Public path of dev server
      -h, --help  Show help
  `)
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https.get(url, (response) => {
      response.pipe(file)
      file.on('finish', () => {
        file.close(resolve)
      })
    }).on('error', (err) => {
      fs.unlink(dest)
      reject(err.message)
    })
  })
}

function getMozillaCACerts() {
  const path = `${caFolder}/${mozillaCACertsFileName}`
  const pathTmp = `${path}.tmp`

  if (fs.existsSync(path)) {
    const fd = fs.openSync(path, 'r')
    const stats = fs.fstatSync(fd)
    const ctime = moment(stats.ctime)

    const isOld = ctime.isBefore(moment().subtract(...updateAfter))
    if (!isOld) return Promise.resolve()
    console.log(`Root CAs are older than ${updateAfter[0]} ${updateAfter[1]}`)
  }

  process.stdout.write('Downloading Mozilla Root CAs... ')
  return download(mozillaCACertsURL, pathTmp).then(() => {
    console.log('ok')
    fs.renameSync(pathTmp, path)
  })
}

function getHttpsAgent() {
  const ca = [
    `${caFolder}/${mozillaCACertsFileName}`,
    `${caFolder}/${chatgrapeCACertsFileName}`
  ].map(f => fs.readFileSync(f))
  return new https.Agent({keepAlive, ca})
}

function onError(ctx, err) {
  // Silence timeout errors to reduce noise.
  if (err.message === 'socket hang up') return
  console.error('proxy error:', err)
}

function onRequest(ctx, callback) {
  ctx.use(Proxy.gunzip)

  // Find requests we want to rewrite.
  const host = ctx.clientToProxyRequest.headers.host
  const url = ctx.clientToProxyRequest.url
  if (!/((staging|dev[0-9]+)\.chatgrape\.com|ug-cdn\.com)$/.test(host)) return callback()

  const match = url.match(/\/static\/app\/(.*)/)
  if (!match) return callback()

  // Rewrite request.
  const options = ctx.proxyToServerRequestOptions
  const file = match[1]
  options.hostname = devHost
  options.headers.host = devHost
  options.port = devPort
  options.protocol = 'http:'
  options.agent = httpAgent
  options.path = `${devPath}/${file}`

  console.log(`${host}${url} => ${devHost}:${devPort}${devPath}/${file}`)
  return callback()
}

if (helpRequested) {
  printHelp()
  process.exit()
}

getMozillaCACerts().then(() => {
  console.log(`Start proxy server at 0.0.0.0:${listenOnPort}`)
  proxy.onError(onError)
  proxy.onRequest(onRequest)
  proxy.listen({port: listenOnPort, httpsAgent: getHttpsAgent()})
}).catch((err) => {
  console.log(err)
  process.exit(1)
})
