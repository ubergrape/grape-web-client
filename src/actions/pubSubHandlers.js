import pick from 'lodash/pick'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import * as api from '../utils/backend/api'

import * as types from '../constants/actionTypes'
import {
  orgSelector,
  usersSelector,
  userSelector,
  channelSelector,
  joinedRoomsSelector,
  channelsSelector,
  joinedChannelsSelector,
} from '../selectors'
import { normalizeMessage, countMentions, pinToFavorite } from './utils'
import {
  goTo,
  addChannel,
  addSharedFiles,
  removeSharedFiles,
  addMention,
  removeMention,
  addNewUser,
  goToLastUsedChannel,
  showSidebar,
  setIntialDataLoading,
} from './'

const addNewMessage = message => (dispatch, getState) => {
  const state = getState()
  const user = userSelector(state)
  const rooms = joinedRoomsSelector(state)
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
    payload: nMessage,
  })
}

export const handleNewMessage = message => (dispatch, getState) => {
  const state = getState()
  const channels = channelSelector(state)
  const user = userSelector(state)
  // This is a special case for activity messages. These are special messages and the only
  // one having the property type attached to it. It is showed in the
  // "Development activities" channel and therefor it's not necessary to invoke addNewUser
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
  dispatch(addNewUser(message.author.id)).then(() => {
    dispatch(addNewMessage(message))
  })
}

export function handleRemovedMessage({ id }) {
  return dispatch => {
    dispatch(removeSharedFiles(id))
    dispatch(removeMention(id))
    dispatch({
      type: types.REMOVE_MESSAGE,
      payload: id,
    })
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

export function handleNewChannel({ channel }) {
  return addChannel(channel)
}

const addUserToChannel = payload => dispatch => {
  dispatch({
    type: types.ADD_USER_TO_CHANNEL,
    payload,
  })
}

export function handleJoinedChannel({ user: userId, channel: channelId }) {
  return (dispatch, getState) => {
    const currentUser = userSelector(getState())
    const isCurrentUser = currentUser.id === userId

    api.getUser(orgSelector(getState()).id, userId).then(foundUser => {
      dispatch(
        addUserToChannel({ channelId, user: foundUser, userId, isCurrentUser }),
      )
    })
  }
}

const handleCurrentUserLeftChannel = () => (dispatch, getState) => {
  const channels = joinedChannelsSelector(getState())
  if (channels) {
    dispatch(goToLastUsedChannel())
  } else {
    dispatch(setIntialDataLoading(false))
    dispatch(showSidebar(false))
    dispatch(goTo('/chat'))
  }
}

export function handleLeftChannel({ user: userId, channel: channelId }) {
  return dispatch => {
    dispatch({
      type: types.REMOVE_USER_FROM_CHANNEL,
      payload: { channelId, userId },
    })
    dispatch(handleCurrentUserLeftChannel())
  }
}

const newNotification = (notification, channel) => (dispatch, getState) => {
  const users = usersSelector(getState())
  dispatch({
    type: types.HANDLE_NOTIFICATION,
    payload: {
      ...notification,
      channel,
      inviter: find(users, { id: notification.inviterId }),
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
    dispatch(addNewUser(notification.author.id)).then(() => {
      const updatedChannels = channelsSelector(getState())
      const addedChannel = find(updatedChannels, { id: notification.channelId })
      dispatch(newNotification(notification, addedChannel))
    })
  }
}

export function handleUpateChannel({ channel }) {
  const updatable = [
    'id',
    'type',
    'name',
    'description',
    'isPublic',
    'color',
    'icon',
    'slug',
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
    dispatch(handleCurrentUserLeftChannel())
  }
}

const changeUserStatue = payload => dispatch => {
  dispatch({
    type: types.CHANGE_USER_STATUS,
    payload,
  })
}

export const handleUserStatusChange = ({ status, user: userId }) => (
  dispatch,
  getState,
) => {
  const users = usersSelector(getState())
  const user = find(users, { id: userId })
  if (user) {
    dispatch(changeUserStatue({ status, userId }))
    return
  }
  dispatch(addNewUser(userId)).then(() => {
    dispatch(changeUserStatue({ status, userId }))
  })
}

export function handleUserUpdate({ user }) {
  // TODO: handle if user change username and
  // he is current mate in active PM and
  // redirect at the new PM URL in this case
  return {
    type: types.UPDATE_USER,
    payload: user,
  }
}

export function handleFavoriteChange({ changed }) {
  return {
    type: types.CHANGE_FAVORITED,
    payload: changed.map(pinToFavorite),
  }
}
