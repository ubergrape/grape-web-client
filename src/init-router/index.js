import page from 'page'
import find from 'lodash/collection/find'

export default function init(ui) {
  const baseURL = '/chat'
  const currUser = ui.user
  const navRoomList = ui.navigation.roomList.items
  const navPMList = ui.navigation.pmList.items
  page.stop()
  page.base(baseURL)
  page('/', pickChannel)
  page('/@:creator@:mate', goToPM)
  page('/@:creator@:mate/:message', goToPM)
  page('/@:mate', redirectWithCreator)
  page('/@:mate/:message', redirectWithCreator)
  page('/:room', goToRoom)
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

  /**
   * Add `@currUser.slug` to url
   * @param  {Object} ctx page context
   */
  function redirectWithCreator(ctx) {
    const {mate, message} = ctx.params
    const user = findPM(ctx.params.mate)
    page.redirect(
      `/${user.pm.creator.slug}${user.slug}${message ? '/' + message : ''}`
    )
  }

  function goToPM(ctx) {
    const username = ctx.params.mate
    const user = findPM(username)
    const message = ctx.params.message ? ctx.params.message : null
    if (user) {
      if (user === currUser) {
        return ui.onInvalidUrl('message to self')
      }
      else if (user.mate) {
        return ui.emit('selectchannel', user.mate, message)
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

  function goToRoom(ctx) {
    const slug = ctx.params.room
    const room = findRoom(slug)
    const message = ctx.params.message ? ctx.params.message : null
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
    ui.onInvalidUrl('url not found')
  }
}
