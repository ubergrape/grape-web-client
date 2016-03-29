import Emitter from 'emitter'
import Wamp from 'wamp1'
import Backoff from 'backo'
import debug from 'debug'
import WebSocket from 'websocket'

const log = debug('ws')
const path = '/ws'
const protocol = location.protocol === 'http:' ? 'ws://' : 'wss://'
const uri = protocol + location.host + path
const prefix = 'http://domain/'
const pingInterval = 10000

export default class WampClient {
  constructor(options = {}) {
    this.out = new Emitter()
    this.backoff = new Backoff(options.backoff)
    this.wamp = null
    this.id = null
    this.reopening = false
    this.connected = false
  }

  connect() {
    if (this.wamp) return this.out
    this.open()
    setInterval(::this.ping, pingInterval)
    return this.out
  }

  open() {
    this.socket = new WebSocket(uri)
    this.socket.on('error', ::this.onError)
    this.socket.on('close', ::this.onClose)
    this.wamp = new Wamp(
      this.socket,
      {omitSubscribe: true},
      ::this.onOpen
    )
    this.wamp.on('error', ::this.onError)
    this.wamp.on('event', ::this.onEvent)
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
  ping() {
    if (!this.connected || this.reopening) return
    log('ping')
    this.call('ping', (err, res) => {
      if (err) return this.onError(err)
      log(res)
    })
  }

  /**
   * Add domain prefix to the path.
   *
   * Why do we need this again?
   */
  call(...args) {
    args[0] = prefix + args[0]
    this.wamp.call.apply(this.wamp, args)
  }

  onOpen({sessionId}) {
    this.backoff.reset()
    this.onConnected()
    if (sessionId !== this.id) {
      this.id = sessionId
      log('new session id %s', this.id)
      this.out.emit('set:id', this.id)
    }
  }

  onConnected() {
    if (this.connected) return
    this.connected = true
    log('connected')
    this.out.emit('connected')
  }

  onDisconnected() {
    if (!this.connected) return
    this.id = null
    this.connected = false
    log('disconnected')
    this.out.emit('disconnected')
  }

  /**
   * We get a url as even name. For compatibility with long polling clinet
   * we convert it to event name.
   */
  onEvent(url, data) {
    data.event = url.split('/').pop().replace('#', '.')
    log('received event "%s"', data.event, data)
    this.out.emit('data', data)
  }

  onError(err) {
    log('error', err)
    this.out.emit('error', err)
    this.onClose()
  }

  onClose() {
    this.wamp.off()
    this.socket.off()
    this.socket.close(3001)
    this.reopen()
  }
}
