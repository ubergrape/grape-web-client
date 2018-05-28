import pick from 'lodash/object/pick'
import find from 'lodash/collection/find'
import findIndex from 'lodash/array/findIndex'
import * as api from '../utils/backend/api'

import * as types from '../constants/actionTypes'
import {
  orgSelector,
  usersSelector,
  userSelector,
  channelSelector,
  joinedRoomsSelector,
  channelsSelector
} from '../selectors'
import {
  normalizeMessage,
  countMentions,
  pinToFavorite
} from './utils'
import {
  goTo,
  addChannel,
  addSharedFiles,
  removeSharedFiles,
  addMention,
  removeMention,
  addNewUser
} from './'

const addNewMessage = message => (dispatch, getState) => {
  const state = getState()
  const user = userSelector(state)
  const rooms = joinedRoomsSelector(state)
  const nMessage = normalizeMessage(message, state)
  const mentionsCount = countMentions(nMessage, user, rooms)

  if (nMessage.attachments.length) dispatch(addSharedFiles(nMessage))
  if (mentionsCount) dispatch(addMention(nMessage))
  dispatch({
    type: types.UPDATE_CHANNEL_STATS,
    payload: {
      message: nMessage,
      mentionsCount,
      isCurrentUser: user.id === nMessage.author.id
    }
  })
  // We remove a message first, because if user sends a message, it is
  // added immediately, with a generated clientsideId.
  // Then we receive the same message from the server which might contain
  // additional information and a server-side id.
  dispatch({
    type: types.REMOVE_MESSAGE,
    payload: message.clientsideId
  })
  dispatch({
    type: types.ADD_NEW_MESSAGE,
    payload: nMessage
  })

  // Mark own message as sent.
  if (nMessage.author.id === user.id) {
    dispatch({
      type: types.MARK_MESSAGE_AS_SENT,
      payload: {
        messageId: nMessage.id,
        channelId: nMessage.channelId
      }
    })
  }
}

export const handleNewMessage = message => (dispatch, getState) => {
  const state = getState()
  const channels = channelSelector(state)
  const user = userSelector(state)

  if (message.author.id === user.id || findIndex(channels, {id: message.author.id}) !== -1) {
    dispatch(addNewMessage(message))
    return
  }
  dispatch(addNewUser(message.author.id))
    .then(() => {
      dispatch(addNewMessage(message))
    })
}

export function handleRemovedMessage({id}) {
  return (dispatch) => {
    dispatch(removeSharedFiles(id))
    dispatch(removeMention(id))
    dispatch({
      type: types.REMOVE_MESSAGE,
      payload: id
    })
  }
}

export function handleReadChannel({user: userId, channel: channelId}) {
  return (dispatch, getState) => {
    const user = userSelector(getState())

    dispatch({
      type: types.MARK_CHANNEL_AS_READ,
      payload: {
        isCurrentUser: userId === user.id,
        userId,
        channelId
      }
    })
  }
}

export function handleMembershipUpdate({membership}) {
  return (dispatch, getState) => {
    const {
      organization,
      user: userId,
      role,
      title
    } = membership

    const {id} = orgSelector(getState())
    if (id !== organization) return


    dispatch({
      type: types.UPDATE_MEMBERSHIP,
      payload: {
        userId,
        update: {
          role,
          title
        }
      }
    })

    const user = userSelector(getState())
    if (userId === user.id) dispatch(goTo('/'))
  }
}

export function handleNewChannel({channel}) {
  return addChannel(channel)
}

const addUserToChannel = payload => (dispatch) => {
  dispatch({
    type: types.ADD_USER_TO_CHANNEL,
    payload
  })
}

export function handleJoinedChannel({user: userId, channel: channelId}) {
  return (dispatch, getState) => {
    const users = usersSelector(getState())
    const currentUser = userSelector(getState())
    const isCurrentUser = currentUser.id === userId
    const user = isCurrentUser ? currentUser : find(users, ({partner}) => partner.id === userId)

    // If user exist in get_overview call
    if (user) {
      dispatch(addUserToChannel({channelId, user, userId, isCurrentUser}))
      return
    }
    api
      .getUser(orgSelector(getState()).id, userId)
      .then((foundUser) => {
        dispatch(addUserToChannel({channelId, user: foundUser, userId, isCurrentUser}))
      })
  }
}

export function handleLeftChannel({user: userId, channel: channelId}) {
  return (dispatch, getState) => {
    dispatch({
      type: types.REMOVE_USER_FROM_CHANNEL,
      payload: {channelId, userId}
    })

    const rooms = joinedRoomsSelector(getState())
    if (!rooms.length) dispatch(goTo('/chat'))
  }
}

const newNotification = (notification, channel) => (dispatch, getState) => {
  const users = usersSelector(getState())
  dispatch({
    type: types.HANDLE_NOTIFICATION,
    payload: {
      ...notification,
      channel,
      inviter: find(users, {id: notification.inviterId})
    }
  })
}

export function handleNotification(notification) {
  return (dispatch, getState) => {
    const channels = channelsSelector(getState())
    const channel = find(channels, {id: notification.channelId})
    if (channel) {
      dispatch(newNotification(notification, channel))
      return
    }
    dispatch(addNewUser(notification.author.id))
      .then(() => {
        const updatedChannels = channelsSelector(getState())
        const addedChannel = find(updatedChannels, {id: notification.channelId})
        dispatch(newNotification(notification, addedChannel))
      })
  }
}

export function handleUpateChannel({channel}) {
  const updatable = ['id', 'type', 'name', 'description', 'isPublic', 'color', 'icon', 'slug']
  return {
    type: types.UPDATE_CHANNEL,
    payload: pick(channel, updatable)
  }
}

export function handleRemoveRoom({channel: id}) {
  return (dispatch, getState) => {
    const {id: currentId} = channelSelector(getState())
    dispatch({
      type: types.REMOVE_ROOM,
      payload: id
    })
    if (id === currentId) dispatch(goTo('/chat'))
  }
}

const changeUserStatue = payload => (dispatch) => {
  dispatch({
    type: types.CHANGE_USER_STATUS,
    payload
  })
}

export const handleUserStatusChange = ({status, user: userId}) => (dispatch, getState) => {
  const users = usersSelector(getState())
  const user = find(users, {id: userId})
  if (user) {
    dispatch(changeUserStatue({status, userId}))
    return
  }
  dispatch(addNewUser(userId))
    .then(() => {
      dispatch(changeUserStatue({status, userId}))
    })
}

export function handleUserUpdate({user}) {
  // TODO: handle if user change username and
  // he is current mate in active PM and
  // redirect at the new PM URL in this case
  return {
    type: types.UPDATE_USER,
    payload: user
  }
}

export function handleFavoriteChange({changed}) {
  return {
    type: types.CHANGE_FAVORITED,
    payload: changed.map(pinToFavorite)
  }
}
