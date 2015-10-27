import Emitter from 'emitter'

import '../../../react-components/file-browser'
import '../../../react-components/message-search'
import '../../../react-components/right-sidebar'
import '../../../react-components/room-info'
import '../../../react-components/user-profile'

export default class RightSidebar extends Emitter {
  constructor() {
    super()
    this.elements = this.create()
    this.el = this.elements.sidebar
/*
    this.el.props = {
      onToggle: ::this.onToggle,
      hide: ::this.hide,
      show: ::this.show,
      toggleRoomInvite: ::this.toggleRoomInvite,
      onShow: ::this.onShow,
      kickMember: ::this.kickMember,
      mode: null,
      channel: null,
      cUser: null,
      searchItems: []
    }
    */
  }

  create() {
    const sidebar = document.createElement('div')
    sidebar.className = 'right-sidebar'
    const fileBrowser = document.createElement('grape-file-browser')
    sidebar.appendChild(fileBrowser)
    /*
    const messageSearch = document.createElement('grape-message-search')
    sidebar.appendChild(messageSearch)
    const roomInfo = document.createElement('grape-room-info')
    sidebar.appendChild(roomInfo)
    const userProfile = document.createElement('grape-user-profile')
    sidebar.appendChild(userProfile)
    */
    return {sidebar, fileBrowser/*, messageSearch, roomInfo, userProfile*/}
  }

  setProps(props) {
    this.el.props = {
      ...this.el.props,
      ...props
    }
  }

  hide() {
    this.setProps({
      mode: null
    })
    this.emit('hide')
  }

  show(mode) {
    this.setProps({
      mode: mode,
      channel: this.el.props.channel
    })
    this.emit('show')
  }

  toggleRoomInvite() {
    this.emit('toggleRoomInvite', this.el.props.channel)
  }

  kickMember(ev) {
    let channelID = this.el.props.channel.id
    let userID = ev.target.getAttribute('data-id')
    this.emit('kickMember', channelID, userID)
  }

  onToggle(mode) {
    if (mode === this.el.props.mode) this.hide()
    else this.show(mode)
  }

  onShow(mode) {
    this.show(mode)
  }

  onSelectChannel(channel) {
    let mode = this.el.props.mode
    if (mode === 'members' && channel.type === 'pm') {
      mode = 'profile'
    }
    else if (mode === 'profile' && channel.type === 'room') {
      mode = 'members'
    }
    this.setProps({
      mode: mode,
      channel: channel
    })
  }

  onGotSearchPayload(payload) {
    this.setProps({
      searchItems: payload.results
    })
  }

  onSetUser(user) {
    this.setProps({
      cUser: user
    })
  }
}
