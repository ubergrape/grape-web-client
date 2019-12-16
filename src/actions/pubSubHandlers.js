import pick from 'lodash/pick'
import find from 'lodash/find'

import * as api from '../utils/backend/api'
import * as types from '../constants/actionTypes'
import { typingThrottlingDelay } from '../constants/delays'
import {
  orgSelector,
  pmsSelector,
  userSelector,
  channelSelector,
  roomsSelector,
  channelsSelector,
  joinedChannelsSelector,
  incomingCallSelector,
} from '../selectors'
import { normalizeMessage, countMentions, pinToFavorite } from './utils'
import {
  goTo,
  error,
  addChannel,
  addSharedFiles,
  removeSharedFiles,
  addMention,
  removeMention,
  endSound,
  goToLastUsedChannel,
  showSidebar,
  setIntialDataLoading,
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

export const handleNewMessage = data => (dispatch, getState) => {
  const channels = channelsSelector(getState())
  const { channel: channelId, channelData: channel, ...rest } = data

  const message = {
    channelId,
    channel,
    ...rest,
  }

  if (!find(channels, { id: channelId })) {
    dispatch(addChannel(channel))
  }

  dispatch(addNewMessage(message))
}

export const handleNewSystemMessage = message => dispatch => {
  const { channelId, messageId, channelData, channel } = message
  api.getMessage(channelId, messageId).then(res => {
    dispatch(
      handleNewMessage({
        channel,
        channelData,
        ...res,
      }),
    )
  })
}

export const handleRemovedMessage = ({ id, channelData }) => dispatch => {
  const { id: channelId } = channelData

  dispatch(removeSharedFiles(id))
  dispatch(removeMention(id))
  dispatch({
    type: types.REMOVE_MESSAGE,
    payload: id,
  })

  api
    .getChannel(channelId)
    .then(channel => {
      dispatch({
        type: types.UPDATE_CHANNEL_UNREAD_COUNTER,
        payload: {
          ...channel,
        },
      })
    })
    .catch(err => dispatch(error(err)))
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

export const handleNewChannel = ({ channel }) => dispatch => {
  dispatch(addChannel(channel))
}

export const handleJoinedChannel = ({
  channel: channelId,
  channelData: channel,
  userData: user,
}) => (dispatch, getState) => {
  const { id } = userSelector(getState())
  const channels = channelsSelector(getState())

  if (!channel) return

  if (!find(channels, { id: channelId })) {
    dispatch(
      addChannel({
        ...channel,
        temporaryInNavigation: Date.now(),
      }),
    )
  }

  dispatch({
    type: types.ADD_USER_TO_CHANNEL,
    payload: {
      channel,
      user,
      isCurrentUser: id === user.id,
    },
  })
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
  return (dispatch, getState) => {
    const user = userSelector(getState())
    const isCurrentUser = user.id === userId

    dispatch({
      type: types.REMOVE_USER_FROM_CHANNEL,
      payload: { channelId, userId, isCurrentUser },
    })

    if (isCurrentUser) dispatch(handleCurrentUserLeftChannel())
  }
}

export const handleNotification = payload => dispatch => {
  dispatch({
    type: types.HANDLE_NOTIFICATION,
    payload,
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

export const handleUserStatusChange = ({ status, user: id }) => (
  dispatch,
  getState,
) => {
  const users = pmsSelector(getState())
  const user = userSelector(getState())

  if (find(users, { partner: { id } })) {
    dispatch({
      type: types.CHANGE_USER_STATUS,
      payload: { status, id },
    })
  }

  if (user.id === id) {
    dispatch({
      type: types.CHANGE_CURRENT_USER_STATUS,
      payload: status,
    })
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

export const handleTypingNotification = ({
  user: userId,
  userData: { displayName, id },
  channel: channelId,
  typing,
}) => (dispatch, getState) => {
  const user = userSelector(getState())

  // Its a notification from current user.
  // We call that action directly from subscription sometimes.
  if (userId === user.id || !typing) return

  dispatch({
    type: types.HANDLE_USER_TYPING,
    payload: {
      channelId,
      user: {
        id,
        displayName,
        expires: Date.now() + typingThrottlingDelay,
      },
    },
  })
}

export const handleIncomingCall = payload => (dispatch, getState) => {
  const { time, channel, author, event } = payload
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

  if (currUser.id !== author.id) {
    dispatch({
      type: types.SHOW_INCOMING_CALL,
    })

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
  const { author, callId, time, channel, event } = payload
  const { data } = incomingCallSelector(getState())

  if (data.callId !== callId) return

  const currUser = userSelector(getState())

  if (currUser.id !== author.id) {
    dispatch(endSound())
    dispatch({
      type: types.CLOSE_INCOMING_CALL,
    })
    dispatch({
      type: types.CLEAR_INCOMING_CALL_DATA,
    })

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
  const { data } = incomingCallSelector(getState())
  const { author, channel, callId } = payload

  const user = userSelector(getState())

  if (
    (channel.type === 'pm' && data.callId === callId) ||
    (channel.type === 'room' && user.id === author.id)
  ) {
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
}

export const handleJoinedCall = payload => (dispatch, getState) => {
  const { data } = incomingCallSelector(getState())
  const { author, callId, channel } = payload

  if (channel.type === 'pm' && data.callId !== callId) return

  const user = userSelector(getState())

  if (user.id === author.id) {
    dispatch(endSound())
    dispatch({
      type: types.CLOSE_INCOMING_CALL,
    })
  }

  if (channel.type === 'room') {
    if (user.id === author.id) {
      dispatch({
        type: types.HANDLE_JOINED_CALL,
        payload,
      })
    }
    return
  }

  if (user.id !== author.id) {
    dispatch({
      type: types.HANDLE_JOINED_CALL,
      payload,
    })
    return
  }

  const channels = channelsSelector(getState())
  const { partner } = find(channels, { id: channel.id })

  if (partner) {
    dispatch({
      type: types.HANDLE_JOINED_CALL,
      payload,
    })
  }
}

export const handleRejectedCall = payload => (dispatch, getState) => {
  const { data } = incomingCallSelector(getState())
  const { callId } = payload

  if (data.callId === callId) {
    dispatch(endSound())
    dispatch({
      type: types.CLOSE_INCOMING_CALL,
    })
    dispatch({
      type: types.CLEAR_INCOMING_CALL_DATA,
    })
  }
}

export const handleStartedCall = data => dispatch => {
  dispatch({
    type: types.ADD_CALL,
    payload: data.channel.id,
  })
}

export const handleFinishedCall = data => dispatch => {
  dispatch({
    type: types.REMOVE_CALL,
    payload: data.channel.id,
  })
}
