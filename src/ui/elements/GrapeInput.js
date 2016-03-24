import Emitter from 'emitter'
import template from 'template'
import events from 'events'
import qs from 'query'
import once from 'lodash/function/once'
import debounce from 'lodash/function/debounce'
import throttle from 'lodash/function/throttle'
import find from 'lodash/collection/find'
import includes from 'lodash/collection/includes'
import uniq from 'lodash/array/uniq'
import clone from 'lodash/lang/clone'
import get from 'lodash/object/get'
import 'grape-browser'
import {openUrl} from 'grape-web/lib/x-platform'

import * as images from '../../../react-components/constants/images'
import render from '../rendervdom'
import getRank from '../utils/getRank'

const inputNodes = ['INPUT', 'TEXT', 'TEXTAREA', 'SELECT']

function isImage(mime) {
  return String(mime).substr(0, 5) === 'image'
}

function getImageAttachments(objects) {
  // Find embeddable images.
  const imageObjects = objects.filter(obj => {
    return isImage(obj.mimeType) && get(obj, 'detail.preview.embeddable')
  })

  const attachments = imageObjects.map(obj => {
    const {image} = obj.detail.preview
    return {
      name: obj.name,
      url: obj.url,
      source: obj.service,
      mimeType: obj.mimeType,
      thumbnailUrl: image.url,
      thumbnailWidth: image.width,
      thumbnailHeight: image.height
    }
  })

  return attachments
}

/**
 * Merge results of multiple autocomplete searches.
 */
function mergeSearchResults(values) {
  const defaultData = {
    results: [],
    services: [],
    search: {
      queries: [],
      text: '',
      type: 'plain'
    }
  }

  return values.reduce((data, {results, services, search}) => {
    data.results = [...data.results, ...results]
    data.services = uniq([...data.services, ...services], 'id')
    data.search.queries = uniq([...data.search.queries, ...search.queries], 'id')
    // Always remove filter from the search string.
    // Waiting for the new api to remove it
    // TODO https://github.com/ubergrape/chatgrape/issues/3394
    data.search.text = search.text.substr(search.text.indexOf(':') + 1)
    data.search.type = search.type === 'external' ? 'external' : 'plain'
    return data
  }, defaultData)
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
      images: this.images,
      customEmojis: this.org.custom_emojis,
      placeholder: this.placeholder,
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
    this.events.bind('grapeLoadServices grape-input', 'onLoadServices')
    this.events.bind('grapeLoadServicesResultsAmounts grape-input', 'onLoadServicesResultsAmounts')
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

  showSearchBrowser({search, setTrigger, filters = []}) {
    const {props} = this.input
    let isLoading = false
    let data

    if (search || filters.length) {
      this.search(search, filters)
      isLoading = true
      data = props.data
    }

    this.browserAborted = false

    // Show browser immediately with empty state.
    this.setProps({
      browser: 'search',
      focused: true,
      data,
      isLoading,
      setTrigger
    })
  }

  showUsersAndRooms(search) {
    const lowerSearch = search.toLowerCase()
    const users = this.findUsers(lowerSearch)
    const rooms = this.findRooms(lowerSearch)
    const data = users.concat(rooms)
    this.setProps({
      browser: 'user',
      focused: true,
      data: data
    })
  }

  showEmojiBrowser({ignoreSuggest, setTrigger}) {
    this.setProps({
      browser: 'emoji',
      focused: false,
      ignoreSuggest,
      setTrigger
    })
  }

  showEmojiSuggest({search, emoji}) {
    const data = emoji.filter(search).map(smile => {
      return {
        ...smile,
        rank: getRank('emoji', search, smile.name)
      }
    })

    this.setProps({
      browser: 'emojiSuggest',
      focused: true,
      maxSuggestions: 6,
      data
    })
  }

  getRoomObject(search, room = this.room) {
    const fallback = !arguments[1]
    return {
      id: room.id,
      type: 'room',
      name: fallback ? 'room' : room.name,
      slug: room.slug,
      isPrivate: !room.is_public,
      rank: fallback ? 3 : getRank('room', search, room.name),
      currentRoom: room === this.room
    }
  }

  findUsers(search) {
    let users = this.org.users.toArray()

    // Remove unactive users.
    users = users.filter(user => user.active)

    // Remove own user.
    users = users.filter(user => user.id !== this.user.id)

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
        rank: getRank('user', search, name, user.username),
        type: 'user'
      }
    })

    // Do the search.
    users = users.filter(user => {
      if (user.name.toLowerCase().indexOf(search) >= 0 ||
        user.username.toLowerCase().indexOf(search) >= 0) {
        return true
      }
    })

    return users
  }

  findRooms(search) {
    let rooms = this.org.rooms.toArray()

    rooms = rooms.map(this.getRoomObject.bind(this, search))

    // Add current room as `@room` if its not a pm channel.
    if (this.room.type === 'room') rooms.push(this.getRoomObject(search))

    // Do the search.
    rooms = rooms.filter(room => {
      return room.name.toLowerCase().indexOf(search) >= 0
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

  updateUnsent() {
    this.unsent[this.room.id] = this.input.getTextContent()
  }

  clearUnsent() {
    this.unsent[this.room.id] = ''
  }

  getUnsent(room) {
    return this.unsent[room.id] || ''
  }

  onMarkdownTipsShow() {
    this.emit('showmarkdowntips')
  }

  onComplete(e) {
    const {detail} = e
    switch (detail.trigger) {
      case '#':
        this.showSearchBrowser(detail)
        break
      case '@':
        this.showUsersAndRooms(detail.search)
        break
      case ':':
        this.showEmojiSuggest(detail)
        break
      default:
    }
  }

  onLoadServices() {
    this.emit('autocomplete', '', {show: 'all'}, (err, data) => {
      if (err) return this.emit('error', err)
      this.setProps({
        browser: 'search',
        focused: true,
        services: data.services
      })
    })
  }

  onLoadServicesResultsAmounts(e) {
    this.emit('autocomplete', e.detail.search, {show: 'all'}, (err, data) => {
      if (err) return this.emit('error', err)
      e.detail.callback(data.services)
    })
  }

  onEditPrevious() {
    const msg = this.findPreviousMessage()
    if (msg) this.editMessage(msg)
  }

  onAbort(e) {
    const data = e.detail
    this.browserAborted = true
    // Don't abort editing if browser has been open.
    if (!data.browser) this.completePreviousEdit()
    if (data.browser === 'search' && data.reason === 'esc') {
      window.analytics.track('abort autocomplete', data)
    }

    this.setProps({
      browser: null,
      focused: true
    })
  }

  onChange() {
    this.startTypingThrottled()
    this.stopTypingDebounced()
  }

  search(search, filters = []) {
    this.browserAborted = false
    let searches

    if (filters.length) {
      searches = filters.map(filter => {
        return this.searchPromise(`${filter}:${search}`, {showAll: false})
      })
    } else {
      searches = [this.searchPromise(search)]
    }

    Promise
      .all(searches)
      .then(results => {
        if (this.browserAborted) return
        this.setProps({
          browser: 'search',
          focused: false,
          data: mergeSearchResults(results)
        })
      })
      .catch(err => {
        this.emit('error', err)
      })
  }

  searchPromise(search, options) {
    return new Promise((resolve, reject) => {
      this.emit('autocomplete', search, options, (err, data) => {
        if (err) return reject(err)
        resolve(data)
      })
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
      this.clearUnsent()
    }
  }

  onFocus() {
    if (!this.preventExtraFocus) this.setProps({focused: true})
    // `preventExtraFocus` fix bug when focus is set at the endless loop
    // https://github.com/ubergrape/chatgrape/issues/3528
    this.preventExtraFocus = true
  }

  onBlur() {
    this.stopTyping()
    this.setProps({focused: false})
    this.preventExtraFocus = false
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
    openUrl(location.origin + '/integrations')
  }

  onInsertItem(e) {
    window.analytics.track('insert autocomplete object', e.detail)
  }

  onSelectChannel(room) {
    if (this.isOrgEmpty) {
      this.isOrgEmpty = false
      this.redraw()
    }
    if (this.room) this.updateUnsent()
    this.completePreviousEdit()
    if (!room || (room.type === 'pm' && !room.users[0].active)) {
      this.disable()
    } else {
      this.enable()
      this.room = room
      this.setProps({focused: true}, () => {
        this.input.setTextContent(this.getUnsent(room), {silent: true})
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
    if (inputNodes.indexOf(e.target.nodeName) >= 0) return
    this.setProps({focused: true})
  }

  onEmptyOrg() {
    this.isOrgEmpty = true
    this.redraw()
  }
}
