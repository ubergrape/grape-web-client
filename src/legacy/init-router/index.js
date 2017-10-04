import page from 'page'
import find from 'lodash/collection/find'
import * as alerts from '../../constants/alerts'

import getStore from '../../app/store'
import {navigationSelector} from '../../selectors'
import conf from '../../conf'

export default function init(ui) {
  page.stop()

  if (conf.embed) {
    page('*', (ctx, next) => {
      if (ctx.init) return
      ctx.handled = false
      const url = `${conf.server.serviceUrl}${ctx.path}`
      // Will open a new tab if happens synchronously after click.
      window.open(url, '_blank')
    })
    page({decodeURLComponents: false, click: false})
    return
  }

  const currUser = ui.user
  const baseURL = '/chat'

  page.base(baseURL)
  page('/', pickChannel)
  page('/@:creator/@:mate', goToPM)
  page('/@:creator/@:mate/:message', goToPM)
  page('/@:mate', redirectWithCreator)
  page('/@:mate/:message', redirectWithCreator)
  page('/:room', goToRoom)
  page('/:room/:message', goToRoom)
  page('*', notFound)
  page({decodeURLComponents: false})

  function pickChannel() {
    const state = getStore().getState()
    const {recent, favorited} = navigationSelector(state)
    const channels = favorited.concat(recent)
    if (!channels.length) return ui.emit('emptyOrg')
    channels.sort((a, b) => b.latestMessageTime - a.latestMessageTime)
    page.replace(baseURL + '/' + channels[0].slug)
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

  function goToPM(ctx, next) {
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
    next()
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
