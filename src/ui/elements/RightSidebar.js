import Emitter from 'emitter'
import find from 'lodash/collection/find'
import isEmpty from 'lodash/lang/isEmpty'
import intersection from 'lodash/array/intersection'
import pluck from 'lodash/collection/pluck'
import sortBy from 'lodash/collection/sortBy'
import page from 'page'

import staticUrl from 'staticurl'
import * as convertCase from '../../api/convertCase'
import '../../../react-components/shared-files'
import '../../../react-components/message-search'
import '../../../react-components/room-info'
import '../../../react-components/user-profile'

const images = {
  spinner: staticUrl('/images/preloader-onwhite.gif')
}

export default class RightSidebar extends Emitter {
  constructor() {
    super()
    this.elements = this.createElements()
    this.el = this.elements.sidebar
    this.mode = null
    this.channel = null
    this.user = null
    this.org = null
    this.lastMessagesQuery = null
    this.lastMessagesTotal = null
  }

  createElements() {
    const sidebar = document.createElement('div')
    sidebar.className = 'right-sidebar'
    const sharedFiles = document.createElement('grape-shared-files')
    sidebar.appendChild(sharedFiles)
    const search = document.createElement('grape-message-search')
    sidebar.appendChild(search)
    const roomInfo = document.createElement('grape-room-info')
    sidebar.appendChild(roomInfo)
    const userProfile = document.createElement('grape-user-profile')
    sidebar.appendChild(userProfile)
    return {sidebar, sharedFiles, search, mentions: search, roomInfo, userProfile}
  }

  setProps(props) {
    const el = this.getCurrElement()
    el.props = {
      ...el.props,
      ...props
    }
  }

  getCurrElement() {
    return this.elements[this.mode]
  }

  hide() {
    this.setProps({show: false})
    this.mode = null
    this.emit('hide')
  }

  show(mode) {
    if (this.mode === mode || !this.org) return
    if (this.mode) this.setProps({show: false})
    this.mode = mode
    this.setupMode()
    this.emit('show')
  }

  setupMode() {
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
          images,
          sort: -1,
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
          images,
          onRequest: ::this.onRequestMessages,
          onSelect: ::this.onSelectMessage,
          onClose: ::this.onClose
        })
        break
      case 'sharedFiles':
        this.setProps({
          show: true,
          onRequestFiles: ::this.onRequestFiles,
          // Reset items when switching rooms.
          items: [],
          images,
          onClose: ::this.onClose
        })
        break
      case 'userProfile':
        this.setProps({
          ...formatUser(this.channel.users[0]),
          show: true,
          onClose: ::this.onClose
        })
        break
      case 'roomInfo':
        this.setProps({
          show: true,
          channel: formatChannel(this.channel),
          user: formatUser(this.user),
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

  handleSearchPayload(data, sort = 1) {
    let messages = data.results.map(formatMessage)

    if (!data.offsetDate) this.lastMessagesTotal = data.offsetTotal

    // Its a "load more", add previous messages before.
    if (this.lastMessagesQuery === data.query) {
      const prevMessages = this.getCurrElement().props.items || []
      messages = [...prevMessages, ...messages]
    }

    messages = sortBy(messages, message => message.time * sort)

    this.lastMessagesQuery = data.query
    this.setProps({
      items: messages,
      total: this.lastMessagesTotal,
      isLoading: false
    })
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
    if (this.mode === 'roomInfo' && channel.type === 'pm') {
      this.mode = 'userProfile'
    }
    else if (this.mode === 'userProfile' && channel.type === 'room') {
      this.mode = 'roomInfo'
    }
    this.setupMode()
  }


  onSearchPayload(data) {
    this.handleSearchPayload(data)
  }

  onLoadMentionsPayload(data) {
    this.handleSearchPayload({...data, query: this.user.slug}, -1)
  }

  onNewMention(message) {
    const mentioned = isMentioned(message.mentions, this.user.id, this.org.rooms)
    if (!mentioned) return
    this.handleSearchPayload({
      results: [message],
      query: this.lastMessagesQuery,
      offsetTotal: (this.lastMessagesTotal || 0) + 1
    }, -1)
  }

  onRequestMessages(params) {
    this.setProps({isLoading: true})
    this.emit('search', params)
  }

  onRequestMentions(params) {
    this.setProps({isLoading: true})
    this.emit('loadMentions', params)
  }

  onKickMember({id}) {
    this.emit('kickMember', {
      channelId: this.channel.id,
      userId: id
    })
  }

  onSearchFilesPayload(data) {
    const nextItems = data.results.map(file => formatFile(this.channel, file))
    const prevItems = this.getCurrElement().props.items || []
    let items = [...prevItems, ...nextItems]
    items = sortBy(items, item => -item.time)

    this.setProps({
      items,
      total: data.total,
      isLoading: false
    })
  }

  onNewSharedFile(message) {
    const results = message.attachments.map(attachment => {
      return {...attachment, author: message.author}
    })
    this.onSearchFilesPayload({
      results,
      total: (this.getCurrElement().props || 0) + 1
    })
  }

  onRequestFiles(params) {
    this.setProps({isLoading: true})
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
    if (!this.mode) return
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

  onOrgReady(org) {
    this.org = org
  }

  onNewMessage(message) {
    switch (this.mode) {
      case 'mentions':
        this.onNewMention(message)
        break
      case 'sharedFiles':
        this.onNewSharedFile(message)
        break
      default:
    }
  }

  onMemberJoinedChannel() {
    if (this.mode !== 'roomInfo') return
    this.setProps({channel: formatChannel(this.channel)})
  }

  onMemberLeftChannel() {
    if (this.mode !== 'roomInfo') return
    this.setProps({channel: formatChannel(this.channel)})
  }
}

/**
 * Find out if mentions match user id when user mention
 * or when channel mention - matches one of the channel user has joined.
 */
function isMentioned(mentions, userId, channels) {
  if (isEmpty(mentions)) return false

  let mentioned = false

  if (mentions.user) {
    mentioned = mentions.user.some(_userId => userId === _userId)
    if (mentioned) return true
  }

  if (mentions.room) {
    const joinedChannels = channels.filter(channel => channel.joined)
    const joinedChannelIds = pluck(joinedChannels, 'id')
    mentioned = intersection(mentions.room, joinedChannelIds).length > 0
  }

  return mentioned
}

/**
 * Format a message for rendering.
 */
function formatMessage(message) {
  return {
    id: message.id,
    channel: message.channel.name ? message.channel.name : message.channel.users[0].displayName,
    author: message.author.displayName,
    avatar: message.author.avatar,
    time: message.time,
    content: message.text,
    slug: message.channel.slug ? message.channel.slug : message.channel.users[0].slug
  }
}

/**
 * Convert channel model to pure object and camelize.
 */
function formatChannel(channel) {
  const fChannel = convertCase.toCamel(channel.toJSON())
  if (fChannel.creator) {
    fChannel.creator = convertCase.toCamel(channel.creator.toJSON())
  }
  fChannel.users = channel.users.toArray().map(user => convertCase.toCamel(user.toJSON()))
  return fChannel
}

/**
 * Convert user model to pure object and camelize.
 */
function formatUser(user) {
  return convertCase.toCamel(user.toJSON())
}

/**
 * Format data for shared files.
 */
function formatFile(channel, file) {
  let author = find(channel.users, ({id}) => id === file.author.id).displayName
  return {
    ...file,
    author,
    channelName: channel.name,
    id: file.id || file.messageId,
    time: new Date(file.time)
  }
}
