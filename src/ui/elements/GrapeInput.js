import Emitter from 'emitter'
import template from 'template'
import events from 'events'
import qs from 'query'
import once from 'lodash/function/once'
import debounce from 'lodash/function/debounce'
import throttle from 'lodash/function/throttle'
import find from 'lodash/collection/find'
import clone from 'lodash/lang/clone'
import get from 'lodash/object/get'

import staticurl from 'staticurl'
import render from '../rendervdom'
import 'grape-browser'

const imagesBase = staticurl('app/cg/images')

const images = {
  emojiSheet: imagesBase + '/emoji_sheet_32_optimized.png',
  traubyReading: imagesBase + '/trauby-reading.png',
  traubyJuggling: imagesBase + '/trauby-juggling.png',
  noDetail: imagesBase + '/no-detail.png',
  spinner: staticurl('/images/preloader-onwhite.gif')
}

const defaultBrowserProps = {
  isLoading: false,
  browser: null,
  focused: false,
  disabled: false,
  data: null
}

const inputNodes = ['INPUT', 'TEXT', 'TEXTAREA', 'SELECT']

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
    this.searchDebounced = debounce(::this.search, 200)
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

  showSearchBrowser(key) {
    let props = this.input.props
    // Show browser immediately with empty state.
    this.setProps({
      browser: 'search',
      data: props.browser === 'search' ? props.data : null,
      isLoading: true
    })
    this.searchDebounced(key)
  }

  showUsersAndRooms(key) {
    let lowerKey = key.toLowerCase()
    let users = this.findUsers(lowerKey)
    let rooms = this.findRooms(lowerKey)
    let data = users.concat(rooms)
    this.setProps({
      browser: 'user',
      data: data
    })
  }

  showEmojiBrowser() {
    this.setProps({browser: 'emoji'})
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
        inRoom: roomUsers.includes(user),
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

    rooms = rooms.map(room => {
      const currentRoom = room === this.room
      return {
        id: room.id,
        type: 'room',
        name: currentRoom ? 'all' : room.name,
        slug: room.slug,
        currentRoom
      }
    })

    // Do the search and filter out current.
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
    let el = qs('.message[data-id="' + msg.id + '"]')
    el.classList.add('editing')
    this.el.classList.add('editing-previous')
    this.input.setTextContent(msg.text)
    this.previous = {
      msg: msg,
      el: el
    }
  }

  findPreviousMessage() {
    let history = this.room.history.slice().reverse()
    return find(history, msg => {
      return msg.author === this.user && !msg.attachments.length
    })
  }

  startTyping() {
    this.emit('setTyping', {
      channel: this.room,
      typing: true
    })
  }

  stopTyping() {
    this.emit('setTyping', {
      channel: this.room,
      typing: false
    })
  }

  onMarkdownTipsShow() {
    this.emit('showmarkdowntips')
  }

  onComplete(e) {
    let query = e.detail
    switch (query.trigger) {
      case '#':
        this.showSearchBrowser(query.key)
        break
      case '@':
        this.showUsersAndRooms(query.key)
        break
      default:
    }
  }

  onSelectFilter(e) {
    this.emit('autocomplete', e.detail.key, (err, data) => {
      if (err) return this.emit('error', err)
      this.setProps({
        browser: 'search',
        data: data
      })
    })
  }

  onEditPrevious() {
    let msg = this.findPreviousMessage()
    if (msg) this.editMessage(msg)
  }

  onAbort(e) {
    let data = e.detail

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
    this.emit('autocomplete', key, (err, data) => {
      if (err) return this.emit('error', err)
      this.setProps({
        browser: 'search',
        data: data
      })
    })
  }

  onSubmit(e) {
    let data = e.detail
    if (this.previous) {
      this.emit('update', this.previous.msg, data.content)
      this.completePreviousEdit()
    }
    else {
      let sendText = true
      let attachments = getImageAttachments(data.objects)
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
    this.showEmojiBrowser()
  }

  onOpenSearchBrowser(e) {
    e.preventDefault()
    this.showSearchBrowser('')
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
    }
    else {
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

function getImageAttachments(objects) {
  // Find embeddable images.
  let embeddableImages = objects.filter(obj => {
    return isImage(obj.mime_type) && get(obj, 'detail.preview.embeddable')
  })

  let attachments = embeddableImages.map(obj => {
    let image = obj.detail.preview.image
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

function isImage(mime) {
  return String(mime).substr(0, 5) === 'image'
}
