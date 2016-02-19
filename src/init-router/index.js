import page from 'page'
import find from 'lodash/collection/find'
import * as alerts from '../../react-components/constants/alerts'

import store from '../../react-components/app/store'
import {roomsSelector, pmsSelector} from '../../react-components/selectors'

export default function init(ui) {
  const baseURL = '/chat'
  const currUser = ui.user
  const state = store.getState()
  const navRoomList = roomsSelector(state)
  const navPMList = pmsSelector(state)
  page.stop()
  page.base(baseURL)
  page('/', pickChannel)
  page('/@:creator/@:mate', goToPM)
  page('/@:creator/@:mate/:message', goToPM)
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
    } else {
      if (!navPMList.length) return ui.emit('emptyOrg')
      redirectSlug = navPMList[0].slug
    }
    page.replace(baseURL + '/' + redirectSlug)
  }

  /**
   * Add channel creator slug to url
   * @param  {Object} ctx page context
   */
  function redirectWithCreator(ctx) {
    const {mate, message} = ctx.params
    const mateUser = findPM(mate)
    let firstSlug
    let secondSlug

    if (mateUser.pm) {
      firstSlug = mateUser.pm.creator.slug
      secondSlug = currUser.slug === firstSlug ? mateUser.slug : currUser.slug
    } else {
      firstSlug = mateUser.slug
      secondSlug = currUser.slug
    }

    page.redirect(
      `/${firstSlug}/${secondSlug}${message ? '/' + message : ''}`
    )
  }

  function goToPM(ctx) {
    const {creator, mate} = ctx.params
    const creatorSlug = `@${creator}`
    const mateSlug = `@${mate}`

    // Not allowed discussion for currUser
    if (creatorSlug !== currUser.slug && mateSlug !== currUser.slug) {
      return notFound()
    }

    const message = ctx.params.message || null
    let user = findPM(creatorSlug === currUser.slug ? mate : creator)
    if (user) {
      if (user === currUser) {
        return ui.onInvalidUrl(alerts.MESSAGE_TO_SELF)
      }
      else if (user.pm) {
        return ui.emit('selectchannel', user.pm, message)
      }
      ui.emit('openpm', user, () => {
        ui.emit('selectchannel', user.pm, message)
      })
    } else {
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
    ui.onInvalidUrl(alerts.URL_NOT_FOUND)
  }
}
