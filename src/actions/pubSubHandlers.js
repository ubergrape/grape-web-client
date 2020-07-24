import pick from 'lodash/pick'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import intersection from 'lodash/intersection'

import conf from '../conf'
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
  sidebarSelector,
  joinedChannelsSelector,
  incomingCallSelector,
} from '../selectors'
import { normalizeMessage, normalizeChannelData, pinToFavorite } from './utils'
import {
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
  closeIncomingCall,
} from './'

/**
 * Count number of mentions that
 * match user id or joined room id when
 * some user or room is mentioned.
 */
const countMessageMentions = (message, user, rooms) => {
  const { mentions } = message
  let count = 0
  if (isEmpty(mentions)) return count

  if (mentions.user) {
    const userMentions = mentions.user.filter(userId => userId === user.id)
    count += userMentions.length
  }

  if (mentions.room) {
    const joinedRoomsIds = map(rooms, 'id')
    const roomMentions = intersection(mentions.room, joinedRoomsIds)
    count += roomMentions.length
  }

  return count
}

const addNewMessage = message => (dispatch, getState) => {
  const state = getState()
  const user = userSelector(state)
  const rooms = roomsSelector(state)
  const channel = channelSelector(state)
  const nMessage = normalizeMessage(message, state)
  const mentionsCount = countMessageMentions(nMessage, user, rooms)
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
      currentChannelId: channel.id,
    },
  })
}

export const handleNewMessage = data => (dispatch, getState) => {
  const channels = channelsSelector(getState())
  const org = orgSelector(getState())
  const {
    channel: channelId,
    organization,
    channelData: channel,
    ...rest
  } = data

  if (org.id !== organization) return

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

export const handleNewSystemMessage = message => (dispatch, getState) => {
  const org = orgSelector(getState())
  const { channelId, organizationId, messageId, channelData, channel } = message

  if (org.id !== organizationId) return

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

export const handleRemovedMessage = ({ organizationId, id, channelData }) => (
  dispatch,
  getState,
) => {
  const org = orgSelector(getState())
  const { id: channelId } = channelData

  if (org.id !== organizationId) return

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
        payload: normalizeChannelData({
          ...channel,
        }),
      })
    })
    .catch(err => dispatch(error(err)))
}

export const handleMessageUpdate = message => (dispatch, getState) => {
  const state = getState()
  const { labelsConfig, id } = orgSelector(state)

  if (id !== message.organization) return

  dispatch({
    type: types.UPDATE_MESSAGE,
    payload: normalizeMessage(message, state, labelsConfig),
  })
}

export const handleSystemMessageUpdate = message => (dispatch, getState) => {
  const state = getState()
  const org = orgSelector(state)
  const { channelId, messageId, organizationId } = message

  if (org.id !== organizationId) return

  api.getMessage(channelId, messageId).then(msg => {
    dispatch({
      type: types.UPDATE_MESSAGE,
      payload: normalizeMessage(msg, state),
    })
  })
}

export function handleReadChannel({
  organizationId,
  user: userId,
  channel: channelId,
}) {
  return (dispatch, getState) => {
    const state = getState()
    const user = userSelector(state)
    const org = orgSelector(state)
    const { id: currentChannelId } = channelSelector(state)

    if (org.id !== organizationId) return

    dispatch({
      type: types.MARK_CHANNEL_AS_READ,
      payload: {
        isCurrentUser: userId === user.id,
        userId,
        channelId,
        currentChannelId,
      },
    })
  }
}

export const handleMembershipUpdate = ({ membership }) => (
  dispatch,
  getState,
) => {
  const { organization, user: userId, role, title } = membership
  const org = orgSelector(getState())

  if (org.id !== organization) return

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

export const handleNewChannel = ({ organizationId, channel }) => (
  dispatch,
  getState,
) => {
  const org = orgSelector(getState())

  if (org.id !== organizationId) return

  dispatch(addChannel(channel))
}

export const handleJoinedChannel = ({
  channel: channelId,
  channelData: channel,
  userData: user,
  organizationId,
}) => (dispatch, getState) => {
  const state = getState()
  const org = orgSelector(state)
  const { id } = userSelector(state)
  const currentChannel = channelSelector(state)
  const channels = channelsSelector(state)

  if (!channel || org.id !== organizationId) return

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
      currentChannelId: currentChannel.id,
      isCurrentUser: id === user.id,
    },
  })
}

const handleCurrentUserLeftChannel = () => (dispatch, getState) => {
  const isJoinedChannels = joinedChannelsSelector(getState())

  dispatch(goToLastUsedChannel())
  if (!isJoinedChannels) {
    dispatch(setIntialDataLoading(false))
    dispatch(showSidebar(false))
  }
}

export const handleLeftChannel = ({
  user: userId,
  channel: channelId,
  organizationId,
}) => (dispatch, getState) => {
  const state = getState()
  const org = orgSelector(state)
  const user = userSelector(state)
  const currentChannel = channelSelector(state)
  const isCurrentUser = user.id === userId

  if (org.id !== organizationId) return

  dispatch({
    type: types.REMOVE_USER_FROM_CHANNEL,
    payload: {
      channelId,
      userId,
      isCurrentUser,
      currentChannelId: currentChannel.id,
    },
  })

  if (isCurrentUser) dispatch(handleCurrentUserLeftChannel())
}

export const handleNotification = data => (dispatch, getState) => {
  if (conf.embed) return

  const state = getState()
  const org = orgSelector(state)
  const { id } = channelSelector(state)

  if (org.id !== data.organizationId) return

  dispatch({
    type: types.HANDLE_NOTIFICATION,
    payload: {
      ...data,
      currentChannelId: id,
    },
  })
}

export const handleUpdateChannel = ({ channel }) => {
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

export const handleRemoveRoom = ({ organizationId, channel: channelId }) => (
  dispatch,
  getState,
) => {
  const state = getState()
  const org = orgSelector(state)
  const { id: currentChannelId } = channelSelector(state)

  if (org.id !== organizationId) return

  dispatch({
    type: types.REMOVE_ROOM,
    payload: {
      channelId,
      currentChannelId,
    },
  })

  if (channelId === currentChannelId) {
    const isJoinedChannels = joinedChannelsSelector(getState())
    dispatch(goToLastUsedChannel())
    if (!isJoinedChannels) {
      dispatch(setIntialDataLoading(false))
      dispatch(showSidebar(false))
    }
  }
}

export const handleUserStatusChange = ({
  organizationId,
  status,
  user: id,
}) => (dispatch, getState) => {
  const state = getState()
  const users = pmsSelector(state)
  const user = userSelector(state)
  const org = orgSelector(state)
  const { show, showSubview } = sidebarSelector(state)

  if (org.id !== organizationId) return

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

  if (show && showSubview === 'members') {
    dispatch({
      type: types.CHANGE_SIDEBAR_USER_STATUS,
      payload: { status, id },
    })
  }
}

export const handleUserUpdate = ({ user, organizationId }) => (
  dispatch,
  getState,
) => {
  const org = orgSelector(getState())

  if (org.id !== organizationId) return

  // TODO: handle if user change username and
  // he is current mate in active PM and
  // redirect at the new PM URL in this case
  dispatch({
    type: types.UPDATE_USER,
    payload: user,
  })
}

export const handleFavoriteChange = ({ organizationId, changed }) => (
  dispatch,
  getState,
) => {
  const org = orgSelector(getState())

  if (org.id !== organizationId) return

  dispatch({
    type: types.CHANGE_FAVORITED,
    payload: changed.map(pinToFavorite),
  })
}

export const handleTypingNotification = ({
  user: userId,
  userData: { displayName, id },
  channel: channelId,
  organizationId,
  typing,
}) => (dispatch, getState) => {
  const state = getState()
  const user = userSelector(state)
  const org = orgSelector(state)

  // Its a notification from current user.
  // We call that action directly from subscription sometimes.
  if (userId === user.id || !typing || org.id !== organizationId) return

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

export const handleMessageLabeled = message => (dispatch, getState) => {
  const org = orgSelector(getState())

  if (org.id !== message.organizationId) return

  dispatch({
    type: types.HANDLE_MESSAGE_LABELED,
    payload: message,
  })
}

export const handleIncomingCall = payload => (dispatch, getState) => {
  if (conf.embed) return

  const { time, channel, author, event, organizationId } = payload
  const currUser = userSelector(getState())
  const org = orgSelector(getState())

  if (org.id !== organizationId) return

  dispatch(closeIncomingCall())
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
      organizationId,
      channel,
      author,
      event,
      time,
    }

    dispatch(handleNotification(notification))
  }
}

export const handleMissedCall = payload => (dispatch, getState) => {
  if (conf.embed) return

  const { author, call, time, channel, event, organizationId } = payload
  const state = getState()
  const { data } = incomingCallSelector(state)
  const org = orgSelector(state)

  if (data.call.id !== call.id || org.id !== organizationId) return

  const currUser = userSelector(getState())

  if (currUser.id !== author.id) {
    dispatch(endSound())
    dispatch(closeIncomingCall())
    dispatch({
      type: types.CLEAR_INCOMING_CALL_DATA,
    })

    const notification = {
      dispatcher: 'missed',
      organizationId,
      channel,
      author,
      event,
      time,
    }

    dispatch(handleNotification(notification))
  }
}

export const handleHungUpCall = payload => (dispatch, getState) => {
  if (conf.embed) return

  const { author, channel, call, organizationId } = payload
  const state = getState()
  const { data } = incomingCallSelector(state)
  const user = userSelector(state)
  const org = orgSelector(state)

  if (org.id !== organizationId) return

  if (
    (channel.type === 'pm' && data.call.id === call.id) ||
    (channel.type === 'room' && user.id === author.id)
  ) {
    dispatch(endSound())
    dispatch(closeIncomingCall())
    dispatch({
      type: types.CLEAR_INCOMING_CALL_DATA,
    })
    dispatch({
      type: types.CLOSE_CALL_STATUS,
    })
  }
}

export const handleJoinedCall = payload => (dispatch, getState) => {
  if (conf.embed) return

  const { author, call, channel, organizationId } = payload
  const state = getState()
  const { data } = incomingCallSelector(state)
  const org = orgSelector(state)
  const user = userSelector(state)

  if (
    (channel.type === 'pm' && data.call.id !== call.id) ||
    org.id !== organizationId
  )
    return

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

  const channels = channelsSelector(state)
  const { partner } = find(channels, { id: channel.id })

  if (partner) {
    dispatch({
      type: types.HANDLE_JOINED_CALL,
      payload: {
        ...payload,
        author: {
          avatar: partner.avatar,
          displayName: partner.displayName,
          id: partner.id,
        },
      },
    })
  }
}

export const handleRejectedCall = payload => (dispatch, getState) => {
  if (conf.embed) return

  const { call, organizationId } = payload
  const state = getState()
  const { data } = incomingCallSelector(state)
  const org = orgSelector(state)

  if (org.id !== organizationId) return

  if (data.call.id === call.id) {
    dispatch(endSound())
    dispatch(closeIncomingCall())
    dispatch({
      type: types.CLEAR_INCOMING_CALL_DATA,
    })
  }
}

export const handleStartedCall = payload => (dispatch, getState) => {
  if (conf.embed) return

  const { author, channel, call } = payload
  const user = userSelector(getState())

  if (user.id === author.id) {
    dispatch({
      type: types.HANDLE_JOINED_CALL,
      payload,
    })
  }

  dispatch({
    type: types.ADD_CALL,
    payload: {
      channel,
      call,
    },
  })
}

export const handleFinishedCall = payload => (dispatch, getState) => {
  if (conf.embed) return

  const {
    call,
    channel: { id },
  } = payload
  const channels = channelsSelector(getState())

  const channel = find(channels, { id })

  if (!channel) return

  if (channel.calls[0].id === call.id) {
    dispatch({
      type: types.CLOSE_CALL_STATUS,
    })
  }

  dispatch({
    type: types.REMOVE_CALL,
    payload: id,
  })
}
