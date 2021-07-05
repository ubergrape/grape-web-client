import Emitter from 'component-emitter'
import Wamp from '@ubergrape/wamp1'
import debug from 'debug'
import WebSocket from 'websocket-wrapper'
import prettyBytes from 'pretty-bytes'
import { isElectron } from 'grape-web/lib/x-platform/electron'

import Backoff from './Backoff'
import { reconnectionDelay } from '../../constants/delays'

const logWs = debug('ws')
const logWamp = debug('wamp')
const prefix = 'http://domain/'

// https://www.iana.org/assignments/websocket/websocket.xml#close-code-number
const wsCloseCodeMap = {
  1000: 'Normal Closure',
  1001: 'Going Away',
  1002: 'Protocol Error',
  1003: 'Unsupported Data',
  1005: 'No Status Received',
  1006: 'Abnormal Closure',
  1007: 'Invalid frame payload data',
  1008: 'Policy Violation',
  1009: 'Message Too Big',
  1010: 'Mandatory Extension',
  1011: 'Internal Error',
  1012: 'Service Restart',
  1013: 'Try Again Later',
  1014: 'Bad Gateway',
  1015: 'TLS Handshake',
}

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
    this.url = options.url
    this.openTime = null
    this.reconnectionRejected = false
    this.reset()
    this.watchOnlineStatus()
  }

  connect() {
    if (this.wamp) return this.out
    logWs('connected')
    this.open()
    return this.out
  }

  disconnect() {
    logWs('disconnected')
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
    if (this.controller) this.controller.abort()
  }

  open() {
    this.socket = new WebSocket(this.url)
    this.socket.on('error', this.onSocketError)
    this.socket.on('close', this.onSocketClose)
    this.wamp = new Wamp(this.socket, { omitSubscribe: true }, this.onOpen)
    this.wamp.on('error', this.onError)
    this.wamp.on('event', this.onEvent)
    this.wamp.on('call', this.onCall)
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
      logWs('reopening')
      this.open()
      return
    }

    logWs('reopen in %sms', backoff)
    onConnectionEvent('reopen in %sms', backoff)
    setTimeout(() => {
      this.reopening = false
      onConnectionEvent('reopening')
      logWs('reopening')
      this.reopening = false
      this.open()
    }, backoff)
  }

  onCall = (endpoint, args, callback) => {
    logWamp('onCall')
    if (endpoint === 'ping') callback('pong')
  }

  /**
   * Watch the connection status, as reported by the browser.
   * we only use this for logging currently
   */
  watchOnlineStatus = () => {
    window.addEventListener('online', this.onOnlineStatusChange)
    window.addEventListener('offline', this.onOnlineStatusChange)
  }

  /**
   * Add domain prefix to the path.
   *
   * Why do we need this again?
   */
  call(...args) {
    let callback = args.pop()

    if (logWamp.enabled) {
      const originCallback = callback
      const start = Date.now()
      callback = (...callbackArgs) => {
        const size = callbackArgs[1]
          ? JSON.stringify(callbackArgs[1]).length
          : 0
        logWamp(
          'stats %s %s ms %s',
          args[0],
          Date.now() - start,
          prettyBytes(size),
        )
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
      logWs('new session id %s', this.id)
      onConnectionEvent('new session id', this.id)
      this.out.emit('set:id', this.id)
    }
  }

  onConnected = () => {
    this.backoff.reset()
    if (this.connected) return
    this.connected = true
    onConnectionEvent('connected')
    logWs('connected')
    this.out.emit('connected')
  }

  onDisconnected = () => {
    if (!this.connected) return
    this.id = null
    this.connected = false
    onConnectionEvent('disconnected')
    logWs('disconnected')
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
    logWamp('received event "%s"', event, data)
    this.out.emit('data', { ...data, event })
  }

  onError = err => {
    onConnectionEvent('error', err)
    logWs(err)
    this.out.emit('error', err)
    if (this.reopening) return
    this.close()
    this.reopen()
  }

  onSocketError = event => {
    onConnectionEvent('socket error', event)
    logWs('socket error', event)
    const err = new Error('Socket error.')
    err.event = event
    this.onError(err)
  }

  onSocketClose = event => {
    onConnectionEvent('socket close', event)
    logWs(
      'socket close. Code: %s (%s). Reason: %s. Was Clean: %s',
      event.code,
      wsCloseCodeMap[event.code] || 'Unknown',
      event.reason || 'None',
      event.wasClean,
      event,
    )
    this.close()
    this.reopen()
  }

  onOnlineStatusChange = event => {
    logWs('browser connection status: %s', event.type, event)
  }
}
