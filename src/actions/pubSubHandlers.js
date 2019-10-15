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
  incomingCallSelector,
} from '../selectors'
import { normalizeMessage, countMentions, pinToFavorite } from './utils'
import {
  goTo,
  addChannel,
  addSharedFiles,
  removeSharedFiles,
  addMention,
  removeMention,
  addNewChannel,
  endSound,
  goToLastUsedChannel,
  showSidebar,
  setInitialDataLoading,
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

export const handleNewSystemMessage = message => dispatch => {
  const { channelId, messageId } = message
  api.getMessage(channelId, messageId).then(res => {
    dispatch(handleNewMessage(res))
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
    const channels = joinedChannelsSelector(getState())
    const isCurrentUser = currentUser.id === userId
    const channel = find(channels, { id: channelId })

    if (!channel) {
      dispatch(addNewChannel(channelId))
    }

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

export const handleNotification = notification => dispatch => {
  dispatch({
    type: types.HANDLE_NOTIFICATION,
    payload: { ...notification },
  })
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

const changeUserStatus = payload => dispatch => {
  dispatch({
    type: types.CHANGE_USER_STATUS,
    payload,
  })
}

export const handleUserStatusChange = ({ status, user: id }) => (
  dispatch,
  getState,
) => {
  const users = usersSelector(getState())
  const user = find(users, { partner: { id } })
  if (user) {
    dispatch(changeUserStatus({ status, id }))
  }
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

export const handleIncomingCall = payload => (dispatch, getState) => {
  const { authorId } = payload
  const currUser = userSelector(getState())

  dispatch({
    type: types.CLOSE_INCOMING_CALL,
  })
  dispatch({
    type: types.CLOSE_CALL_STATUS,
  })

  dispatch({
    type: types.HANDLE_INCOMING_CALL,
    payload,
  })

  if (currUser.id !== authorId) {
    dispatch({
      type: types.SHOW_INCOMING_CALL,
    })

    const { time, channel, author, event } = payload
    const notification = {
      dispatcher: 'incoming',
      channel,
      author,
      event,
      time,
    }

    dispatch(handleNotification(notification))
  }
}

export const handleMissedCall = payload => (dispatch, getState) => {
  const { authorId, callId } = payload
  const { incoming } = incomingCallSelector(getState())

  if (incoming.callId !== callId) return

  const currUser = userSelector(getState())

  if (currUser.id !== authorId) {
    dispatch(endSound())
    dispatch({
      type: types.CLOSE_INCOMING_CALL,
    })
    dispatch({
      type: types.CLEAR_INCOMING_CALL_DATA,
    })

    const { time, channel, author, event } = payload
    const notification = {
      dispatcher: 'missed',
      channel,
      author,
      event,
      time,
    }

    dispatch(handleNotification(notification))
  }
}

export const handleHungUpCall = payload => (dispatch, getState) => {
  const { incoming } = incomingCallSelector(getState())
  const { callId } = payload

  if (incoming.callId !== callId) return

  dispatch(endSound())
  dispatch({
    type: types.CLOSE_INCOMING_CALL,
  })
  dispatch({
    type: types.CLEAR_INCOMING_CALL_DATA,
  })
  dispatch({
    type: types.CLOSE_CALL_STATUS,
  })
}

export const handleJoinedCall = payload => (dispatch, getState) => {
  const { incoming } = incomingCallSelector(getState())
  const { authorId, channelId, callId } = payload

  if (incoming.callId !== callId) return

  dispatch(endSound())
  dispatch({
    type: types.CLOSE_INCOMING_CALL,
  })

  const user = userSelector(getState())

  if (user.id !== authorId) {
    dispatch({
      type: types.HANDLE_JOINED_CALL,
      payload,
    })
    return
  }

  const channels = channelsSelector(getState())
  const channel = find(channels, { id: channelId })
  const users = usersSelector(getState())

  const callerId = channel.users.filter(id => id !== user.id)
  const caller = find(users, { partner: { id: callerId[0] } })

  if (caller) {
    dispatch({
      type: types.HANDLE_JOINED_CALL,
      payload: {
        ...payload,
        authorDisplayName: caller.partner.displayName,
        authorAvatarUrl: caller.partner.avatar,
      },
    })
  }
}

export const handleRejectedCall = payload => (dispatch, getState) => {
  const { incoming } = incomingCallSelector(getState())
  const { callId } = payload

  if (incoming.callId !== callId) return

  dispatch(endSound())
  dispatch({
    type: types.CLOSE_INCOMING_CALL,
  })
  dispatch({
    type: types.CLEAR_INCOMING_CALL_DATA,
  })
}
