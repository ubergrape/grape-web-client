import pick from 'lodash/object/pick'
import find from 'lodash/collection/find'

import * as types from '../constants/actionTypes'
import {
  orgSelector,
  usersSelector,
  userSelector,
  channelSelector,
  roomsSelector
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
  addUser
} from './'

export function handleNewMessage(message) {
  return (dispatch, getState) => {
    const state = getState()
    const nMessage = normalizeMessage(message, state)
    const user = userSelector(state)
    const rooms = roomsSelector(state)
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

export function handleJoinOrg({user, organization: orgId}) {
  return (dispatch, getState) => {
    const org = orgSelector(getState())

    if (org.id !== orgId) return

    dispatch(addUser(user))
  }
}

export function handleLeftOrg({user: userId, organization: orgId}) {
  return (dispatch, getState) => {
    const org = orgSelector(getState())

    if (org.id !== orgId) return

    dispatch({
      type: types.REMOVE_USER_FROM_ORG,
      payload: userId
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
    if (userId === user.id) dispatch(goTo({path: '/'}))
  }
}

export function handleNewChannel({channel}) {
  return addChannel(channel)
}

export function handleJoinedChannel({user: userId, channel: channelId}) {
  return (dispatch, getState) => {
    const users = usersSelector(getState())
    const currentUser = userSelector(getState())
    const isCurrentUser = currentUser.id === userId
    const user = isCurrentUser ? currentUser : find(users, ({id}) => id === userId)
    dispatch({
      type: types.ADD_USER_TO_CHANNEL,
      payload: {
        channelId,
        user,
        isCurrentUser
      }
    })
  }
}

export function handleLeftChannel({user: userId, channel: channelId}) {
  return (dispatch, getState) => {
    const users = usersSelector(getState())
    const currentUser = userSelector(getState())
    const isCurrentUser = currentUser.id === userId
    const user = isCurrentUser ? currentUser : find(users, ({id}) => id === userId)

    dispatch({
      type: types.REMOVE_USER_FROM_CHANNEL,
      payload: {
        channelId,
        user,
        isCurrentUser
      }
    })

    const rooms = roomsSelector(getState())
    if (!rooms.length) dispatch(goTo({path: '/chat'}))
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
    if (id === currentId) dispatch(goTo({path: '/chat'}))
  }
}

export function handleUserStatusChange({status, user: userId}) {
  return {
    type: types.CHANGE_USER_STATUS,
    payload: {
      status,
      userId
    }
  }
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
