import Emitter from 'emitter'
import find from 'lodash/collection/find'
import page from 'page'

import * as convertCase from '../../api/convertCase'
import '../../../react-components/shared-files'
import '../../../react-components/message-search'
import '../../../react-components/room-info'
import '../../../react-components/user-profile'

const modeElementMap = {
  profile: 'userProfile',
  file: 'sharedFiles',
  members: 'roomInfo',
  search: 'messageSearch',
  mentions: 'messageSearch'
}

export default class RightSidebar extends Emitter {
  constructor() {
    super()
    this.elements = this.createElements()
    this.el = this.elements.sidebar
    this.mode = null
    this.channel = null
    this.user = null
    this.lastMessagesQuery = null
    this.lastMessagesTotal = null
  }

  createElements() {
    const sidebar = document.createElement('div')
    sidebar.className = 'right-sidebar'
    const sharedFiles = document.createElement('grape-shared-files')
    sidebar.appendChild(sharedFiles)
    const messageSearch = document.createElement('grape-message-search')
    sidebar.appendChild(messageSearch)
    const roomInfo = document.createElement('grape-room-info')
    sidebar.appendChild(roomInfo)
    const userProfile = document.createElement('grape-user-profile')
    sidebar.appendChild(userProfile)
    return {sidebar, sharedFiles, messageSearch, roomInfo, userProfile}
  }

  setProps(props) {
    const el = this.getCurrElement()
    el.props = {
      ...el.props,
      ...props
    }
  }

  getCurrElement() {
    const elName = modeElementMap[this.mode]
    return this.elements[elName]
  }

  hide() {
    this.setProps({show: false})
    this.mode = null
    this.emit('hide')
  }

  show(mode) {
    if (this.mode === mode) return
    if (this.mode) this.setProps({show: false})
    this.mode = mode
    this.setupMode()
    this.emit('show')
  }

  setupMode() {
    if (!this.mode) return
    switch (this.mode) {
      case 'mentions':
        this.lastMessagesQuery = null
        this.lastMessagesTotal = null
        this.setProps({
          show: true,
          total: null,
          items: [],
          query: this.user.slug,
          title: 'Mentions',
          onRequest: ::this.onRequestMentions,
          onSelect: ::this.onSelectMessage,
          onClose: ::this.onClose
        })
        break
      case 'search':
        this.lastMessagesQuery = null
        this.lastMessagesTotal = null
        this.setProps({
          show: true,
          total: null,
          items: [],
          query: null,
          title: 'Search Results',
          onRequest: ::this.onRequestMessages,
          onSelect: ::this.onSelectMessage,
          onClose: ::this.onClose
        })
        break
      case 'profile':
        this.setProps({
          ...convertCase.toCamel(this.channel.users[0].toJSON()),
          show: true,
          onClose: ::this.onClose
        })
        break
      case 'file':
        this.setProps({
          show: true,
          onRequestFiles: ::this.onRequestFiles,
          // Reset items when switching rooms.
          items: [],
          onClose: ::this.onClose
        })
        break
      case 'members':
        const channel = convertCase.toCamel(this.channel.toJSON())
        if (channel.creator) {
          channel.creator = convertCase.toCamel(channel.creator.toJSON())
        }
        channel.users = channel.users.toArray().map(user => convertCase.toCamel(user.toJSON()))
        this.setProps({
          show: true,
          channel,
          user: convertCase.toCamel(this.user.toJSON()),
          onInvite: ::this.onInviteMember,
          onKickMember: ::this.onKickMember,
          onLeave: ::this.onLeaveRoom,
          onClose: ::this.onClose
        })
        break
      default:
    }
  }

  loadFiles(params) {
    this.emit('searchFiles', {...params, channel: this.channel.id})
  }

  onLeaveRoom() {
    this.emit('leaveRoom', this.channel.id)
  }

  onInviteMember() {
    this.emit('toggleRoomInvite', this.channel)
  }

  onToggle(mode) {
    if (mode === this.mode) this.hide()
    else this.show(mode)
  }

  onSelectChannel(channel) {
    this.channel = channel
    if (this.mode) this.setProps({show: false})
    if (this.mode === 'members' && channel.type === 'pm') {
      this.mode = 'profile'
    }
    else if (this.mode === 'profile' && channel.type === 'room') {
      this.mode = 'members'
    }
    this.setupMode()
  }

  onSearchPayload(data) {
    let messages = data.results.map(message => {
      return {
        id: message.id,
        channel: message.channel.name ? message.channel.name : message.channel.users[0].displayName,
        author: message.author.displayName,
        avatar: message.author.avatar,
        time: message.time,
        body: message.text,
        slug: message.channel.slug ? message.channel.slug : message.channel.users[0].slug
      }
    })

    if (!data.offsetDate) this.lastMessagesTotal = data.offsetTotal

    // Its a "load more", add previous messages before.
    if (this.lastMessagesQuery === data.query) {
      const prevMessages = this.getCurrElement().props.items || []
      messages = [...prevMessages, ...messages]
    }

    this.lastMessagesQuery = data.query
    this.setProps({
      items: messages,
      total: this.lastMessagesTotal
    })
  }

  onLoadMentionsPayload(data) {
    data.query = this.user.slug
    this.onSearchPayload(data)
  }

  onRequestMessages(params) {
    this.emit('search', params)
  }

  onRequestMentions(params) {
    this.emit('loadMentions', params)
  }

  onKickMember({id}) {
    this.emit('kickMember', {
      channelId: this.channel.id,
      userId: id
    })
  }

  onSearchFilesPayload(data) {
    const nextItems = data.results.map(item => {
      let author = find(this.channel.users, ({id}) => id === item.author.id).displayName
      return {
        ...item,
        author,
        channelName: this.channel.name
      }
    })
    const prevItems = this.getCurrElement().props.items || []
    const items = [...prevItems, ...nextItems]
    this.setProps({items, total: data.total})
  }

  onRequestFiles(params) {
    this.loadFiles(params)
  }

  onSearchFilesError(err) {
    // TODO render error
    console.log(err)
  }

  onLoadMentionsError(err) {
    // TODO render error
    console.log(err)
  }

  onSetUser(user) {
    this.user = user
    this.setupMode()
  }

  onShow(mode) {
    this.show(mode)
  }

  onClose() {
    this.hide()
  }

  onSearch({query}) {
    if (!query || query.length < 2) {
      this.setProps({
        items: [],
        total: null
      })
      return
    }
    this.setProps({query})
  }

  onSelectMessage(message) {
    page(`/chat/${message.slug}/${message.id}`)
  }
}
