import Emitter from 'component-emitter'
import Wamp from 'wamp1'
import debug from 'debug'
import WebSocket from 'websocket-wrapper'
import prettyBytes from 'pretty-bytes'

import Backoff from './Backoff'

const log = debug('ws')
const prefix = 'http://domain/'
const pingInterval = 10000

export default class WampClient {
  constructor(options = {}) {
    console.log('WampClient constructor')
    this.out = new Emitter()
    this.backoff = new Backoff(options.backoff)
    this.pingInterval = options.pingInterval || pingInterval
    this.url = options.url
    this._reset()
  }

  // public
  connect() {
    console.log('WampClient connect')
    if (this.wamp) return this.out
    log('connected')
    this.open()
    this.intervalId = setInterval(this.ping, this.pingInterval)
    return this.out
  }

  // public
  disconnect() {
    console.log('WampClient disconnect')
    log('disconnected')
    this._close()
    this._onDisconnected()
    this._reset()
  }

  _reset() {
    console.log('WampClient reset')
    this.wamp = null
    this.socket = null
    this.id = null // public
    this.reopening = false
    this.connected = false
    if (this.intervalId) clearInterval(this.intervalId)
  }

  // public?
  open() {
    console.log('WampClient open')

    const onOpenCallback = ({ sessionId }) => {
      console.log('WampClient onOpenCallback')
      this.backoff.reset()
      if (this.connected) return
      this.connected = true
      log('connected')
      this.out.emit('connected')
      if (sessionId !== this.id) {
        this.id = sessionId
        log('new session id %s', this.id)
        this.out.emit('set:id', this.id)
      }
    }

    this.socket = new WebSocket(this.url)
    this.socket.on('error', this.onSocketError)
    this.socket.on('close', this.onSocketClose)
    this.wamp = new Wamp(this.socket, { omitSubscribe: true }, onOpenCallback)
    this.wamp.on('error', this.onError)
    this.wamp.on('event', this.onEvent)
  }

  _close() {
    console.log('WampClient close')
    this.wamp.off()
    // eslint-disable-next-line no-console, no-underscore-dangle
    console.log(`Close Socket A: `, this.socket, this.socket._socket)
    this.socket.off()
    // eslint-disable-next-line no-console, no-underscore-dangle
    console.log(`Close Socket B: `, this.socket, this.socket._socket)
    this.socket.close(3001)
  }

  // public 
  reopen() {
    console.log('WampClient reopen')
    if (this.reopening) return
    this.reopening = true
    const backoff = this.backoff.duration()
    this.out.emit('set:timer', backoff)
    if (backoff >= this.backoff.max) this._onDisconnected()
    log('reopen in %sms', backoff)
    setTimeout(() => {
      this.reopening = false
      log('reopening')
      this.open()
    }, backoff)
  }

  /**
   * Ping is needed for server. Otherwise it doesn't know when to cleanupn the
   * session.
   */
  ping = () => {
    console.log('WampClient ping')
    if (!this.connected || this.reopening) return
    if (this.waitingForPong) {
      this.waitingForPong = false
      this.onError(new Error("Didn't receive a pong."))
      return
    }
    log('ping')
    this.waitingForPong = true
    this.call('ping', (err, res) => {
      this.waitingForPong = false
      if (err) return this.onError(err)
      return log(res)
    })
  }

  // public
  /**
   * Add domain prefix to the path.
   *
   * Why do we need this again?
   */
  call(...args) {
    console.log('WampClient call')
    let callback = args.pop()

    if (log.enabled) {
      const originCallback = callback
      const start = Date.now()
      callback = (...callbackArgs) => {
        const size = callbackArgs[1]
          ? JSON.stringify(callbackArgs[1]).length
          : 0
        log('stats %s %s ms %s', args[0], Date.now() - start, prettyBytes(size))
        originCallback(...callbackArgs)
      }
    }

    const argsClone = [...args, callback]
    argsClone[0] = prefix + args[0]

    this.wamp.call(...argsClone)
  }

  _onDisconnected = () => {
    console.log('WampClient _onDisconnected')
    if (!this.connected) return
    this.id = null
    this.connected = false
    log('disconnected')
    this.out.emit('disconnected')
  }

  /**
   * We get a url as event name. For compatibility with long polling clinet
   * we convert it to event name.
   */
  onEvent = (name, data) => {
    console.log('WampClient onEvent:', name)
    const event = name
      .split('/')
      .pop()
      .replace('#', '.')
    log('received event "%s"', event, data)
    this.out.emit('data', { ...data, event })
  }

  onError = err => {
    console.log('WampClient onError:', err)
    log(err)
    this.out.emit('error', err)
    this._close()
    this.reopen()
  }

  onSocketError = event => {
    console.log('WampClient onError:', event)
    log('socket error', event)
    const err = new Error('Socket error.')
    err.event = event
    this.onError(err)
  }

  onSocketClose = event => {
    console.log('WampClient onSocketClose:', event)
    log('socket close', event)
    this._close()
    this.reopen()
  }
}
