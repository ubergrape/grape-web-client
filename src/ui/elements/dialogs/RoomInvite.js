import Dialog from './dialog'
import events from 'events'
import qs from 'query'
import closest from 'closest'
import ItemList from '../../utils/itemlist'
import keyname from 'keyname'
import render from '../../rendervdom'
import template from 'template'
import find from 'lodash/collection/find'

export default function RoomInvite(context) {
  this.template_path = 'dialogs/room-invite.jade'
  this.formContent = {}
  this.query = null
  Dialog.call(this, context)
}

RoomInvite.prototype = Object.create(Dialog.prototype)

let protoInit = RoomInvite.prototype.init

RoomInvite.prototype.init = function () {
  protoInit.call(this)

  let context = this.context
  let userList = this.userList = new ItemList({
    template: 'dialogs/userlist.jade'
  })
  userList.setItems(context.users)
  userList.order('displayName')
  this.uninvitedUsers = context.users

  if (!this.uninvitedUsers.length) return

  replace(qs('.invite-list', this.dialog.el), userList.el)
  this.redrawFormContent([], '')
  replace(qs('.form-content', this.dialog.el), this.formContent.el)
}

function replace(from, to) {
  from.parentNode.replaceChild(to, from)
}

RoomInvite.prototype.bind = function () {
  this.events = events(this.el, this)
  this.events.bind('click .form-content', 'focusInput')
  this.events.bind('click .invite-to-room .user', 'onUserClick')
  this.events.bind('click .btn-invite', 'inviteToRoom')
  this.events.bind('keyup .input-invite', 'onKeyUp')
  this.events.bind('keydown .input-invite', 'onKeyDown')

  let onKeyUp = function (e) {
    this.navigate(e)
  }.bind(this)

  this.dialog.on('hide', function () {
    document.removeEventListener('keyup', onKeyUp)
  })
  this.dialog.on('show', function () {
    if (!this.userList.items.length) return
    document.addEventListener('keyup', onKeyUp)
    this.focusInput()
  }.bind(this))
}

RoomInvite.prototype.onUserClick = function (e) {
  let itemID = Number(closest(e.target, 'li', true).getAttribute('data-id'))
  let item = find(this.userList.items, ({id}) => id === itemID)
  this.toggleUser(item)
}

RoomInvite.prototype.toggleUser = function (item) {
  this.userList.toggleItem(item)
  this.redrawFormContent(this.userList.highlighted, '')
  this.filterUsers()
  this.query = ''
  this.userList.selectItem(null)
  this.focusInput()
}

RoomInvite.prototype.navigate = function (e) {
  e.preventDefault()
  let userList = this.userList
  let items = userList.items.filter(function (item) {
    return userList.highlighted.indexOf(item) === -1
  })
  let selectedIndex = items.indexOf(userList.selected)

  switch (keyname(e.keyCode)) {
    case 'up':
      if (!userList.selected) return
      let isSelectedFirst = selectedIndex === 0
      if (isSelectedFirst) userList.selectItem(items[items.length - 1])
      else userList.selectItem(items[selectedIndex - 1])
      break

    case 'down':
      if (!userList.selected) {
        userList.selectItem(items[0])
      }
      else {
        let isSelectedLast = selectedIndex === items.length - 1
        if (isSelectedLast) userList.selectItem(items[0])
        else userList.selectItem(items[selectedIndex + 1])
      }
      break

    case 'enter':
      if (!userList.selected) return
      this.toggleUser(userList.selected)
      break

    default:
      break
  }
}

RoomInvite.prototype.focusInput = function () {
  qs('.input-invite', this.dialog.el).focus()
}

RoomInvite.prototype.onKeyDown = function (e) {
  let filterInput = qs('.input-invite', this.dialog.el)
  let query = filterInput.value
  if (!filterInput.selectionEnd && keyname(e.keyCode) === 'backspace') {
    this.userList.highlighted.pop()
    this.redrawFormContent(this.userList.highlighted, query)
    this.focusInput()
  }
}

RoomInvite.prototype.onKeyUp = function () {
  let filterInput = qs('.input-invite', this.dialog.el)
  let query = filterInput.value
  if (query !== this.query) this.filterUsers(query)
  this.query = query
  filterInput.style.width = 20 + filterInput.value.length * 7 + 'px'
  this.userList.redraw()
}

RoomInvite.prototype.filterUsers = function (query) {
  if (query) {
    let suggestions = this.uninvitedUsers.filter(function (user) {
      return user.username.toLowerCase().indexOf(query) !== -1
        || user.displayName.toLowerCase().indexOf(query) !== -1
    })
    suggestions.sort(function (a) {
      if (a.username.toLowerCase().startsWith(query)
        || a.displayName.toLowerCase().startsWith(query)) {
        return -1
      }
      return 1
    })
    this.userList.items = suggestions
    this.userList.selectItem(suggestions[0])
  }
  else {
    this.userList.items = this.uninvitedUsers
    this.userList.selectItem(null)
  }
}

RoomInvite.prototype.inviteToRoom = function () {
  let usernames = this.userList.highlighted.map(function (user) {
    return user.username
  })
  if (!usernames.length) return
  this.emit('inviteToRoom', this.context.room, usernames)
}

RoomInvite.prototype.onRoomInviteSuccess = function () {
  this.dialog.hide()
}

RoomInvite.prototype.redrawFormContent = function (items, query) {
  render(
    this.formContent,
    template('dialogs/invite-form-content.jade', {
      items: items,
      query: query
    })
  )
}
