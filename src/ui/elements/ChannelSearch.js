import Emitter from 'emitter'
import page from 'page'
import pick from 'lodash/object/pick'

import '../../../react-components/channel-search'

export default class ChannelSearch extends Emitter {
  constructor() {
    super()
    this.el = document.createElement('grape-channel-search')
    this.el.props = {
      onSelect: ::this.onSelect,
      onCreate: ::this.onCreate,
      onShow: ::this.onShow,
      onHide: ::this.onHide,
      show: false,
      items: []
    }
  }

  setProps(props) {
    this.el.props = {
      ...this.el.props,
      ...props
    }
  }

  hide() {
    this.setProps({show: false})
  }

  onOrgReady(org) {
    this.org = org
  }

  onSetUser(user) {
    this.user = user
  }

  onSelect(item) {
    page('/chat/' + item.slug)
    this.onHide()
  }

  onCreate() {
    this.hide()
    this.emit('triggerRoomManager')
  }

  onShow() {
    this.setProps({
      show: true,
      items: filterItem(getItems(this.org), this.user)
    })
  }

  onHide() {
    this.hide()
  }
}

function getItems(org) {
  let users = org.users.filter(({active}) => active)
  users = users.map(({id, slug, displayName, avatar}) => {
    return {
      id,
      slug,
      type: 'user',
      name: displayName,
      iconUrl: avatar
    }
  })
  let rooms = org.rooms.filter(({joined}) => joined)
  rooms = rooms.map(room => {
    let item = pick(room, 'id', 'name', 'slug', 'color', 'abbr')
    item.type = 'room'
    return item
  })
  return [...users, ...rooms]
}

function filterItem(items, user) {
  // Remove current user.
  return items.filter(({id}) => id !== user.id)
}
