import page from 'page'
import pick from 'lodash/object/pick'

import * as types from '../constants/actionTypes'
import {defaultAvatar, invitedAvatar} from '../constants/images'
import {
  normalizeMessage,
  countMentions,
  pinToFavorite,
  nullChannelIconToUndefined
} from './utils'
import find from 'lodash/collection/find'
import {addSharedFiles, removeSharedFiles} from './sharedFiles'
import {addMention, removeMention} from './mentions'
import {createChannel} from './common'

import {
  orgSelector,
  usersSelector,
  userSelector,
  channelSelector,
  joinedRoomsSelector
} from '../selectors'

const noopAction = {type: types.NOOP}

export function handleNewMessage(message) {
  return (dispatch, getState) => {
    const state = getState()
    const fMessage = normalizeMessage(message, state)
    const user = userSelector(state)
    const rooms = joinedRoomsSelector(state)
    const mentionsCount = countMentions(fMessage, user, rooms)
    if (fMessage.attachments.length) dispatch(addSharedFiles(fMessage))
    if (mentionsCount) dispatch(addMention(fMessage))
    dispatch({
      type: types.UPDATE_CHANNEL_STATS,
      payload: {
        message: fMessage,
        mentionsCount,
        isCurrentUser: user.id === fMessage.author.id
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
      payload: fMessage
    })
  }
}

export function handleRemovedMessage({id}) {
  return dispatch => {
    dispatch(removeSharedFiles(id))
    dispatch(removeMention(id))
    dispatch({
      type: types.REMOVE_MESSAGE,
      payload: id
    })
  }
}

export function handleReadChannel(data) {
  return (dispatch, getState) => {
    const user = userSelector(getState())
    dispatch({
      type: types.MARK_CHANNEL_AS_READ,
      payload: {
        isCurrentUser: user.id === data.user,
        channelId: data.channel
      }
    })

    // We use the channel read event triggered by the own user to
    // mark a message as sent.
    if (user.id === data.user) {
      dispatch({
        type: types.MARK_MESSAGE_AS_SENT,
        payload: {
          messageId: data.message,
          channelId: data.channel
        }
      })
    }
  }
}

export function handleJoinOrg({user, organization: orgId}) {
  return (dispatch, getState) => {
    const state = getState()
    const users = usersSelector(state)
    const org = orgSelector(state)

    const _user = find(users, ({id}) => id === user.id)
    if (_user || org.id !== orgId) {
      return dispatch(noopAction)
    }

    const avatar = user.isOnlyInvited ? invitedAvatar : (user.avatar || defaultAvatar)

    dispatch({
      type: types.ADD_USER_TO_ORG,
      payload: {
        ...user,
        avatar,
        slug: `@${user.username}`,
        pm: null,
        active: true,
        status: 0
      }
    })
  }
}

export function handleLeftOrg({user: userId, organization: orgId}) {
  return (dispatch, getState) => {
    const org = orgSelector(getState())

    if (org.id !== orgId) return dispatch(noopAction)

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
    if (id !== organization) return noopAction


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
    if (userId === user.id) location.pathname = '/'
  }
}

export function handleNewChannel({channel}) {
  return createChannel(channel)
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

    const rooms = joinedRoomsSelector(getState())
    if (!rooms.length) page('/chat/')
  }
}

export function handleUpateChannel({channel}) {
  const updatable = ['id', 'type', 'name', 'slug', 'description', 'isPublic', 'color', 'icon']
  return {
    type: types.UPDATE_CHANNEL,
    payload: nullChannelIconToUndefined(pick(channel, updatable))
  }
}

export function handleRemoveRoom({channel: id}) {
  return (dispatch, getState) => {
    const {id: currentId} = channelSelector(getState())
    dispatch({
      type: types.REMOVE_ROOM,
      payload: id
    })
    if (id === currentId) page('/chat/')
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
