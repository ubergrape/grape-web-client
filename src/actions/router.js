import find from 'lodash/find'
import { openUrl, getMode } from 'grape-web/lib/x-platform'

import conf from '../conf'
import * as types from '../constants/actionTypes'
import { channelsSelector, channelSelector } from '../selectors'
import { findLastUsedChannel } from './utils'
import * as history from '../app/history'

import { openPm, openChannel } from './'

export function goTo(pathOrUrl, options = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: types.GO_TO,
      payload: options,
    })

    const currentChannel = channelSelector(getState())

    openUrl(pathOrUrl, {
      serviceUrl: conf.server.serviceUrl,
      mode: getMode(conf),
      currChannel: conf.channelId || currentChannel.id,
      replace: options.replace,
      onExternal: window.open,
      onRedirect: url => {
        window.location.href = url
      },
      onSilentChange: (path, { channelId, messageId, mateId, type }) => {
        if (type === 'channel') dispatch(openChannel(channelId, messageId))
        else dispatch(openPm(mateId))
      },
      onUpdateRouter: (path, method) => {
        history[method](path)
      },
    })
  }
}

export function goToMessage(message) {
  return dispatch => {
    dispatch(goTo(message.link))
  }
}

export function goToChannel(channelOrChannelId, options) {
  return (dispatch, getState) => {
    const { id: currentId } = channelSelector(getState())

    if (
      channelOrChannelId === currentId ||
      (channelOrChannelId.id && channelOrChannelId.id === currentId)
    )
      return

    if (!conf.embed) {
      dispatch({
        type: types.GO_TO_CHANNEL,
        payload: channelOrChannelId,
      })
    }

    let channel = channelOrChannelId

    if (typeof channelOrChannelId === 'number') {
      const channels = channelsSelector(getState())
      channel = find(channels, ({ id }) => id === channelOrChannelId)
      // Assume we don't have always have all channels in the future.
      if (!channel) channel = { id: channelOrChannelId, slug: '' }
    }

    const slug = channel.slug == null ? channel.partner.username : channel.slug
    dispatch(goTo(`/chat/channel/${channel.id}/${slug}`, options))
  }
}

export const goToLastUsedChannel = () => (dispatch, getState) => {
  const channels = channelsSelector(getState())
  const channel = findLastUsedChannel(channels)

  if (channel) dispatch(goToChannel(channel))
  else goTo('/chat')
}

export function goToPayment() {
  return dispatch => {
    dispatch({ type: types.GO_TO_PAYMENT })
    dispatch(goTo('/payment'))
  }
}

export function goToAddIntegrations() {
  return dispatch => {
    dispatch({ type: types.GO_TO_ADD_INTEGRATIONS })
    dispatch(goTo('/integrations'))
  }
}

export const handleChangeRoute = ({ name, params }) => dispatch => {
  dispatch({
    type: types.HANDLE_CHANGE_ROUTE,
    payload: { name, params },
  })

  switch (name) {
    case 'pm': {
      // We have yet to find the pm channel using user id and replace current route.
      dispatch(openPm(params.mateId, { replace: true }))
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
