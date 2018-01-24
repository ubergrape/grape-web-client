import Emitter from 'component-emitter'
import Wamp from 'wamp1'
import Backoff from 'backo'
import debug from 'debug'
import WebSocket from 'websocket-wrapper'
import prettyBytes from 'pretty-bytes'

const log = debug('ws')
const prefix = 'http://domain/'
const pingInterval = 10000

export default class WampClient {
  constructor(options = {}) {
    this.out = new Emitter()
    this.backoff = new Backoff(options.backoff)
    this.pingInterval = options.pingInterval || pingInterval
    this.url = options.url
    this.reset()
  }

  connect() {
    if (this.wamp) return this.out
    log('connect')
    this.open()
    this.intervalId = setInterval(this.ping, this.pingInterval)
    return this.out
  }

  disconnect() {
    log('disconnect')
    this.close()
    this.onDisconnected()
    this.reset()
  }

  reset() {
    this.wamp = null
    this.socket = null
    this.id = null
    this.reopening = false
    this.connected = false
    if (this.intervalId) clearInterval(this.intervalId)
  }

  open() {
    this.socket = new WebSocket(this.url)
    this.socket.on('error', this.onSocketError)
    this.socket.on('close', this.onSocketClose)
    this.wamp = new Wamp(
      this.socket,
      {omitSubscribe: true},
      this.onOpen
    )
    this.wamp.on('error', this.onError)
    this.wamp.on('event', this.onEvent)
  }

  close() {
    this.wamp.off()
    this.socket.off()
    this.socket.close(3001)
  }

  reopen() {
    if (this.reopening) return
    this.reopening = true
    const backoff = this.backoff.duration()
    if (backoff >= this.backoff.max) this.onDisconnected()
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
    if (!this.connected || this.reopening) return
    if (this.waitingForPong) {
      this.waitingForPong = false
      this.onError(new Error('Didn\'t receive a pong.'))
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

  /**
   * Add domain prefix to the path.
   *
   * Why do we need this again?
   */
  call(...args) {
    let callback = args.pop()

    if (log.enabled) {
      const originCallback = callback
      const start = Date.now()
      callback = (...callbackArgs) => {
        log(
          'stats %s %s ms %s',
          args[0],
          Date.now() - start,
          prettyBytes(JSON.stringify(callbackArgs[1]).length)
        )
        originCallback(...callbackArgs)
      }
    }

    const argsClone = [...args, callback]
    argsClone[0] = prefix + args[0]

    this.wamp.call(...argsClone)
  }

  onOpen = ({sessionId}) => {
    this.backoff.reset()
    this.onConnected()
    if (sessionId !== this.id) {
      this.id = sessionId
      log('new session id %s', this.id)
      this.out.emit('set:id', this.id)
    }
  }

  onConnected = () => {
    if (this.connected) return
    this.connected = true
    log('connected')
    this.out.emit('connected')
  }

  onDisconnected = () => {
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
    const event = name.split('/').pop().replace('#', '.')
    log('received event "%s"', event, data)
    this.out.emit('data', {...data, event})
  }

  onError = (err) => {
    log(err)
    this.out.emit('error', err)
    this.close()
    this.reopen()
  }

  onSocketError = (event) => {
    log('socket error', event)
    const err = new Error('Socket error.')
    err.event = event
    this.onError(err)
  }

  onSocketClose = (event) => {
    log('socket close', event)
    this.close()
    this.reopen()
  }
}
