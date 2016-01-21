import Emitter from 'emitter'
import template from 'template'
import events from 'events'
import qs from 'query'
import once from 'lodash/function/once'
import debounce from 'lodash/function/debounce'
import throttle from 'lodash/function/throttle'
import find from 'lodash/collection/find'
import includes from 'lodash/collection/includes'
import clone from 'lodash/lang/clone'
import get from 'lodash/object/get'

import * as images from '../../../react-components/constants/images'
import render from '../rendervdom'
import 'grape-browser'
import getRank from '../utils/getRank'

const defaultBrowserProps = {
  isLoading: false,
  browser: null,
  focused: false,
  disabled: false,
  data: null
}

const inputNodes = ['INPUT', 'TEXT', 'TEXTAREA', 'SELECT']

function isImage(mime) {
  return String(mime).substr(0, 5) === 'image'
}

function getImageAttachments(objects) {
  // Find embeddable images.
  const imageObjects = objects.filter(obj => {
    return isImage(obj.mime_type) && get(obj, 'detail.preview.embeddable')
  })

  const attachments = imageObjects.map(obj => {
    const {image} = obj.detail.preview
    return {
      name: obj.name,
      url: obj.url,
      source: obj.service,
      mime_type: obj.mime_type,
      thumbnail_url: image.url,
      thumbnail_width: image.width,
      thumbnail_height: image.height
    }
  })

  return attachments
}

export default class GrapeInput extends Emitter {
  constructor() {
    super()
    this.room = null
    this.previous = null
    this.org = null
    this.redraw()
    this.placeholder = 'Enter a message ...'
    // Key is room id, value is unsent text message.
    this.unsent = {}
    this.isOrgEmpty = false
    this.images = clone(images)
    this.startTypingThrottled = throttle(::this.startTyping, 5000, {
      trailing: false
    })
    this.stopTypingDebounced = debounce(::this.stopTyping, 5000)
    window.addEventListener('keydown', ::this.onKeyDown)
  }

  init() {
    if (this.initialized) return
    this.initialized = true
    this.bindEvents()
    this.input = qs('grape-input', this.el)
    this.images.orgLogo = this.org.logo
    this.setProps({focused: true})
  }

  setProps(newProps, callback) {
    this.input.props = {
      defaultBrowserProps,
      images: this.images,
      customEmojis: this.org.custom_emojis,
      placeholder: this.placeholder,
      hasIntegrations: this.org.has_integrations,
      onRender: callback ? once(callback) : undefined,
      ...newProps
    }
  }

  bindEvents() {
    this.events = events(this.el, this)
    this.events.bind('click .js-markdown-tips', 'onMarkdownTipsShow')
    this.events.bind('mousedown .js-emoji-browser-button', 'onOpenEmojiBrowser')
    this.events.bind('mousedown .js-search-browser-button', 'onOpenSearchBrowser')
    this.events.bind('grapeComplete grape-input', 'onComplete')
    this.events.bind('grapeSelectFilter grape-input', 'onSelectFilter')
    this.events.bind('grapeEditPrevious grape-input', 'onEditPrevious')
    this.events.bind('grapeAbort grape-input', 'onAbort')
    this.events.bind('grapeChange grape-input', 'onChange')
    this.events.bind('grapeSubmit grape-input', 'onSubmit')
    this.events.bind('grapeFocus grape-input', 'onFocus')
    this.events.bind('grapeBlur grape-input', 'onBlur')
    this.events.bind('grapeResize grape-input', 'onResize')
    this.events.bind('grapeAddIntegration grape-input', 'onAddIntegration')
    this.events.bind('grapeInsertItem grape-input', 'onInsertItem')
  }

  disable() {
    if (this.input.props.disabled) return
    this.completePreviousEdit()
    this.el.classList.add('disabled')
    this.setProps({
      disabled: true,
      focused: false,
      placeholder: 'You can not reply to this conversation.'
    })
  }

  enable() {
    if (!this.input.props.disabled) return
    this.el.classList.remove('disabled')
    this.setProps({
      disabled: false,
      placeholder: this.placeholder
    })
  }

  redraw() {
    render(this, template('grapeInput.jade', {
      isOrgEmpty: this.isOrgEmpty
    }))
  }

  showSearchBrowser({key, setTrigger}) {
    const {props} = this.input
    this.abortedSearch = false
    // Show browser immediately with empty state.
    this.setProps({
      browser: 'search',
      data: props.browser === 'search' ? props.data : null,
      isLoading: true,
      setTrigger
    })
    this.search(key)
  }

  showUsersAndRooms(key) {
    const lowerKey = key.toLowerCase()
    const users = this.findUsers(lowerKey)
    const rooms = this.findRooms(lowerKey)
    const data = users.concat(rooms)
    this.setProps({
      browser: 'user',
      data: data
    })
  }

  showEmojiBrowser({ignoreSuggest, setTrigger}) {
    this.setProps({
      browser: 'emoji',
      ignoreSuggest,
      setTrigger
    })
  }

  showEmojiSuggest({key, emoji}) {
    const data = emoji.filter(key).map(smile => {
      return {
        ...smile,
        rank: getRank('emoji', key, smile.name)
      }
    })

    this.setProps({
      browser: 'emojiSuggest',
      maxCompleteItems: 6,
      data
    })
  }

  getRoomObject(key, room = this.room) {
    const fallback = !arguments[1]
    return {
      id: room.id,
      type: 'room',
      name: fallback ? 'room' : room.name,
      slug: room.slug,
      isPrivate: !room.is_public,
      rank: fallback ? 3 : getRank('room', key, room.name),
      currentRoom: room === this.room
    }
  }

  findUsers(key) {
    let users = this.org.users.toArray()

    // Remove unactive users.
    users = users.filter(user => user.active)

    // Map to a unified data structure.
    users = users.map(user => {
      let name = user.username
      if (user.firstName) {
        name = user.firstName
        if (user.lastName) name += ' ' + user.lastName
      }

      const roomUsers = this.room.users.toArray()

      return {
        id: user.id,
        name: name,
        username: user.username,
        iconURL: user.avatar,
        inRoom: includes(roomUsers, user),
        rank: getRank('user', key, name, user.username),
        type: 'user'
      }
    })

    // Do the search.
    users = users.filter(user => {
      if (user.name.toLowerCase().indexOf(key) >= 0 ||
        user.username.toLowerCase().indexOf(key) >= 0) {
        return true
      }
    })

    return users
  }

  findRooms(key) {
    let rooms = this.org.rooms.toArray()

    rooms = rooms.map(this.getRoomObject.bind(this, key))

    // Add current room as `@room`.
    rooms.push(this.getRoomObject(key))

    // Do the search.
    rooms = rooms.filter(room => {
      return room.name.toLowerCase().indexOf(key) >= 0
    })

    return rooms
  }

  completePreviousEdit() {
    if (!this.previous) return
    this.previous.el.classList.remove('editing')
    this.el.classList.remove('editing-previous')
    this.input.setTextContent('')
    this.previous = null
  }

  editMessage(msg) {
    this.completePreviousEdit()
    const el = qs('.message[data-id="' + msg.id + '"]')
    el.classList.add('editing')
    this.el.classList.add('editing-previous')
    this.input.setTextContent(msg.text)
    this.previous = {
      msg: msg,
      el: el
    }
  }

  findPreviousMessage() {
    const history = this.room.history.slice().reverse()
    return find(history, msg => {
      return msg.author === this.user && !msg.attachments.length
    })
  }

  startTyping() {
    if (this.room) {
      this.emit('setTyping', {
        channel: this.room,
        typing: true
      })
    }
  }

  stopTyping() {
    if (this.room) {
      this.emit('setTyping', {
        channel: this.room,
        typing: false
      })
    }
  }

  onMarkdownTipsShow() {
    this.emit('showmarkdowntips')
  }

  onComplete(e) {
    const {detail} = e
    switch (detail.trigger) {
      case '#':
        this.showSearchBrowser({key: detail.key})
        break
      case '@':
        this.showUsersAndRooms(detail.key)
        break
      case ':':
        this.showEmojiSuggest(detail)
        break
      default:
    }
  }

  onSelectFilter(e) {
    this.abortedSearch = false
    this.emit('autocomplete', e.detail.key, (err, data) => {
      if (err) return this.emit('error', err)
      if (!this.abortedSearch) {
        this.setProps({
          browser: 'search',
          data: data
        })
      }
    })
  }

  onEditPrevious() {
    const msg = this.findPreviousMessage()
    if (msg) this.editMessage(msg)
  }

  onAbort(e) {
    const data = e.detail
    this.abortedSearch = true
    // Don't abort editing if browser has been open.
    if (!data.browser) this.completePreviousEdit()
    if (data.browser === 'search' && data.reason === 'esc') {
      window.analytics.track('abort autocomplete', data)
    }
  }

  onChange() {
    this.startTypingThrottled()
    this.stopTypingDebounced()
  }

  search(key) {
    this.abortedSearch = false
    this.emit('autocomplete', key, (err, data) => {
      if (err) return this.emit('error', err)
      if (!this.abortedSearch) {
        this.setProps({
          browser: 'search',
          data: data
        })
      }
    })
  }

  onSubmit(e) {
    const data = e.detail

    if (this.previous) {
      this.emit('update', this.previous.msg, data.content)
      this.completePreviousEdit()
    } else {
      let sendText = true
      const attachments = getImageAttachments(data.objects)
      // If a message text contains only media objects we will render a preview
      // in the history for, there is no need to send this objects as text.
      if (data.objectsOnly && attachments.length === data.objects.length) {
        sendText = false
      }
      // Separate message to make it separately editable and removable.
      if (sendText) this.emit('input', this.room, data.content)
      if (attachments.length) {
        this.emit('input', this.room, '', {attachments: attachments})
      }
      this.input.setTextContent('')
    }
  }

  onFocus() {
    this.setProps({focused: true})
  }

  onBlur() {
    this.stopTyping()
    this.setProps({focused: false})
  }

  onResize() {
    this.emit('resize')
  }

  onOpenEmojiBrowser(e) {
    e.preventDefault()
    this.showEmojiBrowser({ignoreSuggest: true, setTrigger: true})
  }

  onOpenSearchBrowser(e) {
    e.preventDefault()
    this.showSearchBrowser({value: '', setTrigger: true})
  }

  onOrgReady(org) {
    this.org = org
    this.init()
  }

  onSetUser(user) {
    this.user = user
    this.redraw()
  }

  onAddIntegration() {
    location.href = '/integrations/'
  }

  onInsertItem(e) {
    window.analytics.track('insert autocomplete object', e.detail)
  }

  onSelectChannel(room) {
    if (this.isOrgEmpty) {
      this.isOrgEmpty = false
      this.redraw()
    }
    if (this.room) {
      this.unsent[this.room.id] = this.input.getTextContent()
    }
    this.completePreviousEdit()
    if (!room || (room.type === 'pm' && !room.users[0].active)) {
      this.disable()
    } else {
      this.enable()
      this.room = room
      this.setProps({focused: true}, () => {
        this.input.setTextContent(this.unsent[room.id] || '', {silent: true})
      })
    }
  }

  onInputRender() {
    this.in.emit('inputRendered')
  }

  onEditMessage(msg) {
    this.setProps({focused: true}, () => {
      this.editMessage(msg)
    })
  }

  /**
   * Focus grape input to make user type in it when he started to type somewhere
   * outside, but not in some other input cabable field.
   */
  onKeyDown(e) {
    // For e.g. when trying to copy text from history.
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
    if (inputNodes.indexOf(e.target.nodeName) >= 0 || e.target.isContentEditable) return
    this.setProps({focused: true})
  }

  onEmptyOrg() {
    this.isOrgEmpty = true
    this.redraw()
  }
}
