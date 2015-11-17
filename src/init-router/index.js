import page from 'page'
import find from 'lodash/collection/find'

module.exports = setUpRouter

function setUpRouter(ui) {
  const baseURL = '/chat'
  const currUser = ui.user
  const navRoomList = ui.navigation.roomList.items
  const navPMList = ui.navigation.pmList.items
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
    let redirectRoom
    navRoomList.every((room) => {
      if (room.joined) {
        redirectRoom = room
        return false
      }
      return true
    })
    let redirectSlug
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
    const username = cxt.params.pm
    const user = findPM(username)
    const message = cxt.params.message ? cxt.params.message : null
    if (user) {
      if (user === currUser) {
        return ui.invalidUrlFeedback('message to self')
      }
      else if (user.pm) {
        return ui.emit('selectchannel', user.pm, message)
      }
      ui.emit('openpm', user, () => {
        ui.emit('selectchannel', user.pm, message)
      })
    }
    else {
      notFound()
    }
  }

  function findPM(username) {
    return find(ui.org.users, (user) => {
      return user.username === username
    })
  }

  function goToRoom(cxt) {
    const slug = cxt.params.room
    const room = findRoom(slug)
    const message = cxt.params.message ? cxt.params.message : null
    if (room) {
      if (room.joined) return ui.emit('selectchannel', room, message)
      ui.emit('joinroom', room, () => {
        ui.emit('selectchannel', room, message)
      })
    }
    else {
      notFound()
    }
  }

  function findRoom(slug) {
    return find(ui.org.rooms, (room) => {
      return room.slug === slug
    })
  }

  function notFound() {
    ui.invalidUrlFeedback('url not found')
  }
}
