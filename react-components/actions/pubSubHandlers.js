import * as types from '../constants/actionTypes'
import {defaultAvatar, invitedAvatar} from '../constants/app'
import {isMentioned, formatMessage} from './utils'
import find from 'lodash/collection/find'
import {addSharedFiles, removeSharedFiles} from './sharedFiles'
import {addMention, removeMention} from './mentions'

import {
  orgSelector,
  usersSelector,
  userSelector
} from '../selectors'

import store from '../app/store'

const noopAction = {type: types.NOOP}

export function handleNewMessage(message) {
  return dispatch => {
    const fMessage = formatMessage(message)
    if (fMessage.attachments.length) {
      dispatch(addSharedFiles(fMessage))
    }
    if (isMentioned(fMessage)) {
      dispatch(addMention(fMessage))
    }

    dispatch({
      type: types.NEW_MESSAGE,
      payload: {
        message: fMessage
      }
    })
  }
}

export function handleRemovedMessage({id}) {
  return dispatch => {
    dispatch(removeSharedFiles(id))
    dispatch(removeMention(id))
    dispatch({
      type: types.REMOVE_MESSAGE,
      payload: {
        messageId: id
      }
    })
  }
}

export function handleReadChannel(data) {
  const user = userSelector(store.getState())
  return {
    type: types.READ_CHANNEL,
    payload: {
      isCurrentUser: user.id === data.user,
      channelId: data.channel
    }
  }
}

export function handleJoinOrg({user, organization: orgId}) {
  const state = store.getState()
  const users = usersSelector(state)
  const org = orgSelector(state)

  const _user = find(users, ({id}) => id === user.id)
  if (_user || org.id !== orgId) {
    return noopAction
  }

  const avatar = user.isOnlyInvited ? invitedAvatar : (user.avatar || defaultAvatar)

  return {
    type: types.NEW_USER_IN_ORG,
    payload: {
      ...user,
      avatar,
      slug: `@${user.username}`,
      pm: null,
      active: true,
      status: 0
    }
  }
}

export function handleLeftOrg({user: userId, organization: orgId}) {
  const state = store.getState()
  const org = orgSelector(state)

  if (org.id !== orgId) return noopAction

  return {
    type: types.USER_LEFT_ORG,
    payload: userId
  }
}

export function handleMembershipUpdate({membership}) {
  const {
    organization,
    user: userId,
    role,
    title
  } = membership

  const {id} = orgSelector(store.getState())
  if (id !== organization) return noopAction

  return {
    type: types.UPDATE_MEMBERSHIP,
    payload: {
      userId,
      update: {
        role,
        title
      }
    }
  }
}

export function handleNewChannel({channel}) {
  return {
    type: types.NEW_CHANNEL,
    payload: channel
  }
}

export function handleJoinedChannel({user: userId, channel: channelId}) {
  const users = usersSelector(store.getState())
  const user = find(users, ({id}) => id === userId)
  return {
    type: types.ADD_USER_TO_CHANNEL,
    payload: {
      channelId,
      user
    }
  }
}

export function handleLeftChannel({user: userId, channel: channelId}) {
  const users = usersSelector(store.getState())
  const user = find(users, ({id}) => id === userId)
  return {
    type: types.REMOVE_USER_FROM_CHANNEL,
    payload: {
      channelId,
      user
    }
  }
}

export function handleUpateChannel({channel}) {
  const {id, type, name, slug, description} = channel
  return {
    type: types.UPDATE_CHANNEL,
    payload: {
      id,
      type,
      name,
      slug,
      description
    }
  }
}

export function handleRemoveRoom({channel: id}) {
  return {
    type: types.REMOVE_ROOM,
    payload: id
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

export function handleUserUpdated({user}) {
  // TODO: handle if user change username and
  // he is current mate in active PM and
  // redirect at the new PM URL in this case
  return {
    type: types.UPDATE_USER,
    payload: user
  }
}
