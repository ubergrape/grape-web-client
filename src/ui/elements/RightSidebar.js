import Emitter from 'emitter'
import find from 'lodash/collection/find'

import '../../../react-components/file-browser'
import '../../../react-components/message-search'
import '../../../react-components/room-info'
import '../../../react-components/user-profile'

const modeElementMap = {
  profile: 'userProfile',
  file: 'fileBrowser',
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
    this.searchResults = []
    this.searchResultsTotal = 0
    this.lastQuery = null
  }

  createElements() {
    const sidebar = document.createElement('div')
    sidebar.className = 'right-sidebar'
    const fileBrowser = document.createElement('grape-file-browser')
    sidebar.appendChild(fileBrowser)
    const messageSearch = document.createElement('grape-message-search')
    sidebar.appendChild(messageSearch)
    const roomInfo = document.createElement('grape-room-info')
    sidebar.appendChild(roomInfo)
    const userProfile = document.createElement('grape-user-profile')
    sidebar.appendChild(userProfile)
    return {sidebar, fileBrowser, messageSearch, roomInfo, userProfile}
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
    if (this.mode) this.setProps({show: false})
    this.mode = mode
    this.update()
    this.emit('show')
  }

  update() {
    if (!this.mode) return
    switch (this.mode) {
      case 'profile':
        this.setProps({
          show: true,
          user: this.channel.users[0]
        })
        break
      case 'file':
        this.showFileBrowser()
        break
      case 'members':
        this.setProps({
          show: true,
          channel: this.channel,
          user: this.user,
          toggleRoomInvite: ::this.toggleRoomInvite,
          kickMember: ::this.kickMember
        })
        break
      case 'search':
        this.setProps({
          show: true,
          items: this.searchResults,
          itemsTotal: this.searchResultsTotal,
          showMoreMessages: ::this.showMoreMessages
        })
        break
      default:
    }
  }

  toggleRoomInvite() {
    this.emit('toggleRoomInvite', this.channel)
  }

  kickMember(e) {
    let userId = e.target.dataset.id
    this.emit('kickMember', this.channel.id, userId)
  }

  showFileBrowser() {
    this.setProps({
      show: true,
      onLoadMore: ::this.onLoadMoreFiles
    })
    this.loadFiles()
  }

  loadFiles() {
    const el = this.getCurrElement()
    const offset = el.props.items ? el.props.items.length : 0
    this.emit('searchFiles', {
      channel: this.channel.id,
      offset,
      limit: 30
    })
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
    this.update()
  }

  onSearchPayload(data) {
    if (this.lastQuery === data.q) {
      this.searchResults = this.searchResults.concat(data.results)
    }
    else {
      this.searchResults = data.results
      this.searchResultsTotal = data.total
    }
    this.lastQuery = data.q
    this.update()
  }

  showMoreMessages(limit, offset) {
    this.emit('search', {
      text: this.lastQuery,
      limit: limit,
      offset: offset
    })
  }

  onSearchFilesPayload(data) {
    const nextItems = data.results.map(item => {
      let author = find(this.channel.users, ({id}) => id === item.author.id).displayName
      return {
        ...item,
        author,
        channelName: this.channel.name,
      }
    })
    const prevItems = this.getCurrElement().props.items || []
    const items = [...prevItems, ...nextItems]
    this.setProps({
      items,
      hasMore: items.length !== data.total
    })
  }

  onLoadMoreFiles() {
    this.loadFiles()
  }

  onSearchFilesError(err) {
    // TODO render error
  }

  onSetUser(user) {
    this.user = user
    this.update()
  }

  onShow(mode) {
    this.show(mode)
  }
}
