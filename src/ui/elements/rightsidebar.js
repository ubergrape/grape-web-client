import Emitter from 'emitter'

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
    const elName = modeElementMap[this.mode]
    const el = this.elements[elName]
    el.props = {
      ...el.props,
      ...props
    }
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
          users: this.channel.users.toArray(),
          user: this.user,
          roomCreator: this.channel.creator,
          toggleRoomInvite: ::this.toggleRoomInvite,
          kickMember: ::this.kickMember
        })
        break
      case 'search':
        this.setProps({
          show: true,
          items: this.searchResults
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
    this.setProps({show: true})
    this.emit('searchFiles', {
      channel: this.channel.id,
      limit: 200
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

  onGotSearchPayload({results}) {
    this.searchResults = results
    this.update()
  }

  onSearchFilesPayload(data) {
    this.setProps({items: data.results})
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
