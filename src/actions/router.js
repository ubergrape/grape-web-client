import parseUrl from 'grape-web/lib/parse-url'
import * as router from 'react-router-redux'
import find from 'lodash/collection/find'
import {matchPath} from 'react-router-dom'

import conf from '../conf'
import * as types from '../constants/actionTypes'
import {channelsSelector} from '../selectors'
import {findLastUsedChannel} from './utils'
import {channelRoute, pmRoute} from '../constants/routes'
import {isChatUrl} from '../components/grapedown/utils'

import {setChannel, openPm, openChannel, handleBadChannel} from './'

const goToFromEmbedded = path => (dispatch) => {
  const {pathname, hostname} = parseUrl(path)
  const match = matchPath(pathname, {path: channelRoute}) ||
    matchPath(pathname, {path: pmRoute})
  // We need to open a new window if the path path doesn't match those routes in embedded mode.
  if (!match) {
    window.open(path)
    return
  }
  const {channelId, mateId, messageId} = match.params
  // When mention another people, open link to pm in new tab
  if (mateId) {
    window.open(`${conf.server.serviceUrl}${path}`)
    return
  }
  // Open link in the same window, because channelId of parsed link and opened chanelId similar
  if (Number(channelId) === conf.channelId) {
    // We need open external links like `https://github.com/chat/channel/channelId`
    // with same channelId as curent channel in new tab.
    if (!isChatUrl(path)) {
      window.open(path)
      return
    }
    /* When path doesn't contain a messageId, we don't have to do anything,
    because we are already in this channel
    Examples: @room, https://github.com/chat/channel/channelId */
    if (!messageId) return
    dispatch(openChannel(Number(channelId), messageId))
    return
  }
  if (match && !isChatUrl(path)) {
    // Open in a new tab when external website link pathname is similar to channelRoute constant,
    // but hostnames is diferent. Like a 'github.com/chat/channelId'
    if (location.hostname !== hostname) {
      window.open(path)
      return
    }
    // '/chat/channelId:messageId'
    // For example mentions of a channel. Like an '@Office'.
    window.open(`${conf.server.serviceUrl}${path}`)
    return
  }
  window.open(path)
}

export function goTo(options) {
  return (dispatch) => {
    dispatch({
      type: types.GO_TO,
      payload: options
    })

    const {path, url, target} = options

    // If it is a URL and not a path, always open in a new window.
    if (url) {
      if (target) window.open(url, target)
      else location.href = url
      return
    }

    if (path && conf.embed) {
      dispatch(goToFromEmbedded(path))
      return
    }

    // All /chat URLs are handled by the router.
    if (path.substr(0, 5) === '/chat') {
      if (options.replace) dispatch(router.replace(path))
      else dispatch(router.push(path))
      return
    }

    // Locations outside of SPA open with full page reload.
    location.pathname = path
  }
}

export function goToMessage(message) {
  return (dispatch) => {
    dispatch({
      type: types.GO_TO_MESSAGE,
      payload: message
    })
    dispatch(goTo({path: parseUrl(message.link).href}))
  }
}

export function goToChannel(channelOrChannelId, options) {
  return (dispatch, getState) => {
    dispatch({
      type: types.GO_TO_CHANNEL,
      payload: channelOrChannelId
    })

    let channel = channelOrChannelId

    if (typeof channelOrChannelId === 'number') {
      const channels = channelsSelector(getState())
      channel = find(channels, ({id}) => id === channelOrChannelId)
      // Assume we don't have always have all channels in the future.
      if (!channel) channel = {id: channelOrChannelId, slug: ''}
    }
    const slug = channel.slug == null ? channel.mate.username : channel.slug

    dispatch(goTo({
      ...options,
      path: `/chat/channel/${channel.id}/${slug}`
    }))
    dispatch(setChannel(channel.id))
  }
}

export const goToLastUsedChannel = () => (dispatch, getState) => {
  const channels = channelsSelector(getState())
  const channel = findLastUsedChannel(channels)
  if (channel) dispatch(goToChannel(channel))
  else dispatch(handleBadChannel())
}

export function goToPayment() {
  return (dispatch) => {
    dispatch({type: types.GO_TO_PAYMENT})
    dispatch(goTo({path: '/payment'}))
  }
}

export function goToAddIntegrations() {
  return (dispatch) => {
    dispatch({type: types.GO_TO_ADD_INTEGRATIONS})
    dispatch(goTo({path: '/integrations'}))
  }
}

export const handleChangeRoute = ({name, params}) => (dispatch) => {
  dispatch({
    type: types.HANDLE_CHANGE_ROUTE,
    payload: {name, params}
  })

  switch (name) {
    case 'pm': {
      // We have yet to find the pm channel using user id and replace current route.
      dispatch(openPm(params.mateId, {replace: true}))
      break
    }
    case 'channel': {
      dispatch(openChannel(params.channelId, params.messageId))
      break
    }
    default:
      dispatch(goToLastUsedChannel())
  }
}
