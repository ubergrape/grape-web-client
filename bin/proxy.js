/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const Proxy = require('http-mitm-proxy')
const parseArgs = require('minimist')
/* eslint-enable import/no-extraneous-dependencies */
const moment = require('moment')
const http = require('http')
const https = require('https')
const fs = require('fs')
const crypto = require('crypto')

const caFolder = './ca'
// const chatgrapeCACertsFileName = 'chatgrape-labs.pem'
const mozillaCACertsURL = 'https://curl.haxx.se/ca/cacert.pem'
const mozillaCACertsFileName = 'mozilla-root-certs.pem'
const updateAfter = [7, 'days']
/* eslint-disable no-bitwise */
// Disable insecure SSL protocols. Also for some reasons
// Safari won't connect when SSLv3 is enabled.
const secureOptions =
  crypto.constants.SSL_OP_NO_SSLv3 | crypto.constants.SSL_OP_NO_SSLv2
/* eslint-enable no-bitwise */

// Parse argv params.
const argv = parseArgs(process.argv.slice(2))
const listenOnPort = argv.port || '3128'
const devHost = argv.devHost || 'localhost'
const devPort = argv.devPort || '8081'
const devPath = argv.devPath || '/dist/app'
const helpRequested = argv.h || argv.help

const proxy = Proxy()
const keepAlive = true
const httpAgent = new http.Agent({ keepAlive })

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
    https
      .get(url, response => {
        response.pipe(file)
        file.on('finish', () => {
          file.close(resolve)
        })
      })
      .on('error', err => {
        fs.unlink(dest)
        reject(err)
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
  // const ca = [
  //   `${caFolder}/${mozillaCACertsFileName}`,
  //   `${caFolder}/${chatgrapeCACertsFileName}`,
  // ].map(f => fs.readFileSync(f))

  // Disable SSLv3
  return new https.Agent({ keepAlive, secureOptions })
}

function onError(ctx, err) {
  // Silence timeout errors to reduce noise.
  if (err.message === 'socket hang up') return
  console.error('proxy error:', err)
}

function onRequest(ctx, callback) {
  ctx.use(Proxy.gunzip)

  // Find requests we want to rewrite.
  // eslint-disable-next-line prefer-destructuring
  const host = ctx.clientToProxyRequest.headers.host
  // eslint-disable-next-line prefer-destructuring
  const url = ctx.clientToProxyRequest.url
  let file

  if (
    /((staging|development|dev[0-9]+|test[0-9]+)\.chatgrape\.com|ug-cdn\.com|jira.ubergrape.com)$/.test(
      host,
    )
  ) {
    const match = url.match(/\/static\/app\/(.*)/)
    // eslint-disable-next-line prefer-destructuring
    if (match) file = match[1]
  }

  // We use unpkg cdn for the embedded chat demo for e.g.
  if (host === 'unpkg.com' && /grape-web-client/.test(url)) {
    const match = url.match(/\/dist\/app\/(.*)/)
    // eslint-disable-next-line prefer-destructuring
    if (match) file = match[1]
  }

  if (!file) return callback()

  // Rewrite request.
  const options = ctx.proxyToServerRequestOptions
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

getMozillaCACerts()
  .then(() => {
    console.log(`Start proxy server at 0.0.0.0:${listenOnPort}`)
    proxy.onError(onError)
    proxy.onRequest(onRequest)
    proxy.listen({ port: listenOnPort, httpsAgent: getHttpsAgent() })
  })
  .catch(err => {
    console.log(err)
    process.exit(1)
  })
