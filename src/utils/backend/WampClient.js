import Emitter from 'component-emitter'
import Wamp from 'wamp1'
import debug from 'debug'
import WebSocket from 'websocket-wrapper'
import prettyBytes from 'pretty-bytes'
import { isElectron } from 'grape-web/lib/x-platform/electron'

import Backoff from './Backoff'
import { reconnectionDelay } from '../../constants/delays'

const log = debug('ws')
const prefix = 'http://domain/'
const pingInterval = 10000

let onConnectionEvent = () => {}

if (isElectron) {
  if (window.grapeAppBridge) {
    ;({ onConnectionEvent } = window.grapeAppBridge)
  }
  if (window.GrapeAppBridge) {
    ;({ onConnectionEvent } = window.GrapeAppBridge)
  }
}

export default class WampClient {
  constructor(options = {}) {
    this.out = new Emitter()
    this.backoff = new Backoff(options.backoff)
    this.pingInterval = options.pingInterval || pingInterval
    this.url = options.url
    this.openTime = null
    this.reconnectionRejected = false
    this.reset()
  }

  connect() {
    if (this.wamp) return this.out
    log('connected')
    this.open()
    this.intervalId = setInterval(this.ping, this.pingInterval)
    return this.out
  }

  disconnect() {
    log('disconnected')
    this.close()
    this.onDisconnected()
    this.reset()
  }

  reset() {
    onConnectionEvent('reset')
    this.wamp = null
    this.socket = null
    this.id = null
    this.openTime = null
    this.reopening = false
    this.connected = false
    if (this.intervalId) clearInterval(this.intervalId)
  }

  open() {
    this.socket = new WebSocket(this.url)
    this.socket.on('error', this.onSocketError)
    this.socket.on('close', this.onSocketClose)
    this.wamp = new Wamp(this.socket, { omitSubscribe: true }, this.onOpen)
    this.wamp.on('error', this.onError)
    this.wamp.on('event', this.onEvent)
  }

  close() {
    this.wamp.off()
    this.socket.off()
    this.socket.close(3001)
    this.out.emit('setReconnectingState')
  }

  reopen() {
    if (this.reopening) return
    this.reopening = true
    const backoff = this.backoff.duration()
    this.out.emit('setTimer', backoff)
    this.onError(new Error('Reopen'))
    this.out.emit('setReconnectingState')
    if (backoff >= this.backoff.max) this.onDisconnected()

    if (Date.now() - this.openTime < reconnectionDelay) {
      this.reconnectionRejected = true
      setTimeout(() => {
        this.reopening = false
        this.reopen()
      }, backoff)
      return
    } else if (this.reconnectionRejected) {
      this.reconnectionRejected = false
      this.reopening = false
      onConnectionEvent('reopening')
      log('reopening')
      this.open()
      return
    }

    log('reopen in %sms', backoff)
    onConnectionEvent('reopen in %sms', backoff)
    setTimeout(() => {
      onConnectionEvent('reopening')
      log('reopening')
      this.reopening = false
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
      onConnectionEvent("Didn't receive a pong")
      this.onError(new Error("Didn't receive a pong."))
      return
    }
    onConnectionEvent('ping')
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

  onOpen = ({ sessionId }) => {
    this.onConnected()
    if (sessionId !== this.id) {
      this.id = sessionId
      this.openTime = Date.now()
      this.out.emit('setOpenTime', this.openTime)
      log('new session id %s', this.id)
      onConnectionEvent('new session id', this.id)
      this.out.emit('set:id', this.id)
    }
  }

  onConnected = () => {
    this.backoff.reset()
    if (this.connected) return
    this.connected = true
    onConnectionEvent('connected')
    log('connected')
    this.out.emit('connected')
  }

  onDisconnected = () => {
    if (!this.connected) return
    this.id = null
    this.connected = false
    onConnectionEvent('disconnected')
    log('disconnected')
    this.out.emit('disconnected')
  }

  /**
   * We get a url as event name. For compatibility with long polling clinet
   * we convert it to event name.
   */
  onEvent = (name, data) => {
    const event = name
      .split('/')
      .pop()
      .replace('#', '.')
    log('received event "%s"', event, data)
    this.out.emit('data', { ...data, event })
  }

  onError = err => {
    onConnectionEvent('error', err)
    log(err)
    this.out.emit('error', err)
    if (this.reopening) return
    this.close()
    this.reopen()
  }

  onSocketError = event => {
    onConnectionEvent('socket error', event)
    log('socket error', event)
    const err = new Error('Socket error.')
    err.event = event
    this.onError(err)
  }

  onSocketClose = event => {
    onConnectionEvent('socket close', event)
    log('socket close', event)
    this.close()
    this.reopen()
  }
}
