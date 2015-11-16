var page = require('page')
var find = require('lodash/collection/find')

module.exports = setUpRouter

function setUpRouter(ui) {
  var baseURL = '/chat'
  var currUser = ui.user
  var navRoomList = ui.navigation.roomList.items
  var navPMList = ui.navigation.pmList.items
  page.stop()
  page.base(baseURL)
  page('/', pickChannel)
  page('/@:pm', goToPM)
  page('/:room', goToRoom)
  page('/@:pm/:message', goToPM)
  page('/:room/:message', goToRoom)
  page('*', notFound)
  page({
    decodeURLComponents: false
  })

  function pickChannel() {
    var redirectRoom
    navRoomList.every(function(room) {
      if (room.joined) {
        redirectRoom = room
        return false
      }
      return true
    })
    var redirectSlug
    if (redirectRoom) {
      redirectSlug = redirectRoom.slug
    }
    else {
      if (!navPMList.length) return ui.emit('emptyOrg')
      redirectSlug = navPMList[0].slug
    }
    page.replace(baseURL + '/' + redirectSlug)
  }

  function goToPM(cxt) {
    var username = cxt.params.pm
    var user = findPM(username)
    var message = cxt.params.message ? cxt.params.message : null
    if (user) {
      if (user === currUser) {
        return ui.invalidUrlFeedback('message to self')
      }
      else if (user.pm) {
        return ui.emit('selectchannel', user.pm, message)
      }
      ui.emit('openpm', user, function() {
        ui.emit('selectchannel', user.pm, message)
      })
    }
    else {
      notFound()
    }
  }

  function findPM(username) {
    var selectedUser = find(ui.org.users, function(user) {
      return user.username === username
    })
    return selectedUser
  }

  function goToRoom(cxt) {
    var slug = cxt.params.room
    var room = findRoom(slug)
    var message = cxt.params.message ? cxt.params.message : null
    if (room) {
      if (room.joined) return ui.emit('selectchannel', room, message)
      ui.emit('joinroom', room, function() {
        ui.emit('selectchannel', room, message)
      })
    }
    else {
      notFound()
    }
  }

  function findRoom(slug) {
    var selectedRoom = find(ui.org.rooms, function(room) {
      return room.slug === slug
    })
    return selectedRoom
  }

  function notFound() {
    ui.invalidUrlFeedback('url not found')
  }
}
