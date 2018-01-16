import parseUrl from 'grape-web/lib/parse-url'
import * as router from 'react-router-redux'
import find from 'lodash/collection/find'

import conf from '../conf'
import * as types from '../constants/actionTypes'
import {channelsSelector, pmsSelector} from '../selectors'
import {findLastUsedChannel} from './utils'

import {setChannel, handleChannelNotFound} from './'

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

    // In the embdeded chat we open all URLs in a new window.
    if (path && conf.embed) {
      window.open(`${conf.server.serviceUrl}${path}`, '_blank')
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
    dispatch(goTo({path: parseUrl(message.link).pathname}))
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
      if (!channel) channel = {id: channelOrChannelId}
    }
    const slug = channel.slug || channel.mate.username

    dispatch(goTo({
      ...options,
      path: `/chat/channel/${channel.id}/${slug}`
    }))
    dispatch(setChannel(channel.id))
  }
}

export const goToPmChannel = (mateId, options) => (dispatch, getState) => {
  const channels = pmsSelector(getState())
  const channel = find(channels, ({mate}) => mate.id === mateId)
  if (channel) dispatch(goToChannel(channel, options))
  else dispatch(handleChannelNotFound())
}

export const goToLastUsedChannel = () => (dispatch, getState) => {
  const channels = channelsSelector(getState())
  const channel = findLastUsedChannel(channels)
  dispatch(goToChannel(channel))
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

export const handleChangeRoute = ({name, params}) => (dispatch, getState) => {
  dispatch({
    type: types.HANDLE_CHANGE_ROUTE,
    payload: {name, params}
  })

  switch (name) {
    case 'pm': {
      dispatch(goToPmChannel(params.mateId, {replace: true}))
      break
    }
    case 'channel': {
      const channels = channelsSelector(getState())
      const channel = find(channels, {id: params.channelId})
      if (channel) dispatch(setChannel(params.channelId, params.messageId))
      else dispatch(handleChannelNotFound())
      break
    }
    default:
      dispatch(goToLastUsedChannel())
  }
}
