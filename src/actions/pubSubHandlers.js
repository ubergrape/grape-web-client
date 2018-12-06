import pick from 'lodash/pick'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import * as api from '../utils/backend/api'

import * as types from '../constants/actionTypes'
import {
  orgSelector,
  pmsSelector,
  userSelector,
  channelSelector,
  roomsSelector,
  channelsSelector,
  joinedChannelsSelector,
} from '../selectors'
import { normalizeMessage, countMentions, pinToFavorite } from './utils'
import {
  goTo,
  addSharedFiles,
  removeSharedFiles,
  addMention,
  removeMention,
  addNewChannel,
  goToLastUsedChannel,
  showSidebar,
  setInitialDataLoading,
} from './'

const addNewMessage = message => (dispatch, getState) => {
  const state = getState()
  const user = userSelector(state)
  const rooms = roomsSelector(state)
  const nMessage = normalizeMessage(message, state)
  const mentionsCount = countMentions(nMessage, user, rooms)
  const currentChannel = channelSelector(state)

  if (nMessage.attachments.length && currentChannel.id === nMessage.id)
    dispatch(addSharedFiles(nMessage))
  if (mentionsCount) dispatch(addMention(nMessage))
  dispatch({
    type: types.UPDATE_CHANNEL_STATS,
    payload: {
      message: nMessage,
      mentionsCount,
      isCurrentUser: user.id === nMessage.author.id,
    },
  })

  dispatch({
    type: types.ADD_NEW_MESSAGE,
    payload: {
      message: nMessage,
      currentUserId: user.id,
    },
  })
}

export const handleNewMessage = message => (dispatch, getState) => {
  const state = getState()
  const channels = channelSelector(state)
  const user = userSelector(state)
  // This is a special case for activity messages. These are special messages and the only
  // one having the property type attached to it. It is showed in the
  // "Development activities" channel and therefor it's not necessary to invoke addNewChannel
  // which would result in the undesired API call open_pm.
  if (message.type) {
    dispatch(addNewMessage(message))
    return
  }
  if (
    message.author.id === user.id ||
    findIndex(channels, { id: message.author.id }) !== -1
  ) {
    dispatch(addNewMessage(message))
    return
  }
  dispatch(addNewChannel(message.channel)).then(() => {
    dispatch(addNewMessage(message))
  })
}

export function handleRemovedMessage({ id, channel }) {
  return dispatch => {
    dispatch(removeSharedFiles(id))
    dispatch(removeMention(id))
    dispatch({
      type: types.REMOVE_MESSAGE,
      payload: id,
    })
    // setTimeout should be there because of backend updating issues.
    // It can be removed if GRAPE-15530 issue resolved.
    setTimeout(() => {
      api.getChannel(channel).then(res => {
        const {
          unread,
          lastMessage: { time },
        } = res
        dispatch({
          type: types.UPDATE_CHANNEL_UNREAD_COUNTER,
          payload: {
            id: channel,
            unread,
            time,
          },
        })
      })
    }, 1000)
  }
}

export function handleReadChannel({ user: userId, channel: channelId }) {
  return (dispatch, getState) => {
    const user = userSelector(getState())

    dispatch({
      type: types.MARK_CHANNEL_AS_READ,
      payload: {
        isCurrentUser: userId === user.id,
        userId,
        channelId,
      },
    })
  }
}

export function handleMembershipUpdate({ membership }) {
  return (dispatch, getState) => {
    const { organization, user: userId, role, title } = membership

    const { id } = orgSelector(getState())
    if (id !== organization) return

    dispatch({
      type: types.UPDATE_MEMBERSHIP,
      payload: {
        userId,
        update: {
          role,
          title,
        },
      },
    })

    const user = userSelector(getState())
    if (userId === user.id) dispatch(goToLastUsedChannel())
  }
}

export const handleNewChannel = ({ channel }) => addNewChannel(channel.id)

const addUserToChannel = payload => dispatch => {
  dispatch({
    type: types.ADD_USER_TO_CHANNEL,
    payload,
  })
}

export function handleJoinedChannel({ user: userId, channel: channelId }) {
  return (dispatch, getState) => {
    const currentChannel = channelSelector(getState())
    if (currentChannel.id === channelId) {
      api.getUser(orgSelector(getState()).id, userId).then(user => {
        dispatch(addUserToChannel({ user }))
      })
    }
  }
}

const handleCurrentUserLeftChannel = () => (dispatch, getState) => {
  const channels = joinedChannelsSelector(getState())
  if (channels) {
    dispatch(goToLastUsedChannel())
  } else {
    dispatch(setInitialDataLoading(false))
    dispatch(showSidebar(false))
    dispatch(goTo('/chat'))
  }
}

export function handleLeftChannel({ user: userId, channel: channelId }) {
  return (dispatch, getState) => {
    const user = userSelector(getState())
    dispatch({
      type: types.REMOVE_USER_FROM_CHANNEL,
      payload: { channelId, userId },
    })
    if (user.id === userId) dispatch(handleCurrentUserLeftChannel())
  }
}

const newNotification = (notification, channel) => (dispatch, getState) => {
  const users = pmsSelector(getState())
  dispatch({
    type: types.HANDLE_NOTIFICATION,
    payload: {
      ...notification,
      channel,
      inviter: find(users, { partner: { id: notification.inviterId } }),
    },
  })
}

export function handleNotification(notification) {
  return (dispatch, getState) => {
    const channels = channelsSelector(getState())
    const channel = find(channels, { id: notification.channelId })
    if (channel) {
      dispatch(newNotification(notification, channel))
      return
    }
    dispatch(addNewChannel(notification.id)).then(() => {
      const updatedChannels = channelsSelector(getState())
      const addedChannel = find(updatedChannels, { id: notification.channelId })
      dispatch(newNotification(notification, addedChannel))
    })
  }
}

export function handleUpdateChannel({ channel }) {
  const updatable = [
    'id',
    'type',
    'name',
    'description',
    'isPublic',
    'color',
    'icon',
    'slug',
    'permissions',
  ]
  return {
    type: types.UPDATE_CHANNEL,
    payload: pick(channel, updatable),
  }
}

export function handleRemoveRoom({ channel: id }) {
  return (dispatch, getState) => {
    const { id: currentId } = channelSelector(getState())
    dispatch({
      type: types.REMOVE_ROOM,
      payload: id,
    })
    if (id === currentId) dispatch(goTo('/chat'))
  }
}

const changeChannelStatus = payload => dispatch => {
  dispatch({
    type: types.CHANGE_CHANNEL_STATUS,
    payload,
  })
}

export const handlePmChannelStatusChange = ({ status, user: userId }) => (
  dispatch,
  getState,
) => {
  const channels = channelsSelector(getState())
  const user = find(channels, { id: userId })
  if (user) {
    dispatch(changeChannelStatus({ status, userId }))
    return
  }
  dispatch(addNewChannel(userId)).then(() => {
    dispatch(changeChannelStatus({ status, userId }))
  })
}

export function handlePmChannelUpdate({ user }) {
  // TODO: handle if user change username and
  // he is current mate in active PM and
  // redirect at the new PM URL in this case
  return {
    type: types.UPDATE_PM_CHANNEL,
    payload: user,
  }
}

export function handleFavoriteChange({ changed }) {
  return {
    type: types.CHANGE_FAVORITED,
    payload: changed.map(pinToFavorite),
  }
}
