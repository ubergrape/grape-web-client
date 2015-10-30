import Emitter from 'emitter'
import find from 'lodash/collection/find'
import page from 'page'

import '../../../react-components/shared-files'
import '../../../react-components/message-search'
import '../../../react-components/room-info'
import '../../../react-components/user-profile'

const modeElementMap = {
  profile: 'userProfile',
  file: 'sharedFiles',
  members: 'roomInfo',
  search: 'messageSearch'
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
      case 'profile':
        this.setProps({
          show: true,
          user: this.channel.users[0]
        })
        break
      case 'file':
        this.setProps({
          show: true,
          onRequestFiles: ::this.onRequestFiles,
          // Reset items when switching rooms.
          items: []
        })
        break
      case 'members':
        this.setProps({
          show: true,
          channel: this.channel,
          user: this.user,
          onInvite: ::this.onInviteMember,
          onKickMember: ::this.onKickMember,
          onLeave: ::this.onLeaveRoom
        })
        break
      case 'search':
        this.setProps({
          show: true,
          onRequestMessages: ::this.onRequestMessages,
          onSelect: ::this.onSelectMessage
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
    let results = data.results.map(result => {
      return {
        id: result.id,
        channelName: result.channel.name,
        author: result.author.displayName,
        avatar: result.author.avatar,
        time: result.time,
        body: result.text,
        slug: result.channel.slug ? result.channel.slug : result.channel.users[0].slug
      }
    })

    if (!data.offsetDate) this.lastMessagesTotal = data.offsetTotal

    // Its a "load more", add previous results before.
    if (this.lastMessagesQuery === data.query) {
      const prevItems = this.getCurrElement().props.items || []
      results = [...prevItems, ...results]
    }

    this.lastMessagesQuery = data.query
    this.setProps({
      items: results,
      total: this.lastMessagesTotal
    })
  }

  onRequestMessages(params) {
    this.emit('search', params)
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
  }

  onSetUser(user) {
    this.user = user
    this.setupMode()
  }

  onShow(mode) {
    this.show(mode)
  }

  onSearch({query}) {
    this.setProps({query})
  }

  onSelectMessage(message) {
    page(`/chat/${message.slug}/${message.id}`)
  }
}
