import Emitter from 'emitter'
import page from 'page'

import channelSearch from '../../../react-components/channel-search'

export default class ChannelSearch extends Emitter {
  constructor() {
    super()
    this.el = document.createElement('grape-channel-search')
    this.state = {
      show: false,
      items: []
    }
    this.defaultProps = {
      onSelect: ::this.onSelect,
      onCreate: ::this.onCreate,
      onShow: ::this.onShow,
      onHide: ::this.onHide
    }
  }

  redraw() {
    this.el.props = {
      ...this.defaultProps,
      ...this.state
    }
  }

  onOrgReady(org) {
    this.state.items = getItems(org)
    this.redraw()
  }

  onSelect(item) {
    page('/chat/' + item.slug)
    this.onHide()
  }

  onCreate() {
    this.state.show = false
    this.redraw()
    this.emit('triggerRoomManager')
  }

  onShow() {
    this.state.show = true
    this.redraw()
  }

  onHide() {
    this.state.show = false
    this.redraw()
  }
}

function getItems(org) {
  let rooms = org.rooms.map(({id, name, slug}) => ({id, name, slug}))
  let users = org.users.map(({id, displayName, username}) => {
    return {
      id,
      name: displayName,
      slug: `@${username}`
    }
  })
  return [...users, ...rooms]
}