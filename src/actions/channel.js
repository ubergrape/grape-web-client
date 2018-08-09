import find from 'lodash/find'
import * as types from '../constants/actionTypes'
import { maxChannelDescriptionLength } from '../constants/app'
import * as alerts from '../constants/alerts'
import * as api from '../utils/backend/api'
import {
  joinedRoomsSelector,
  userSelector,
  channelSelector,
  channelsSelector,
  orgSelector,
  pmsSelector,
  manageGroupsSelector,
  emptyChatSelector,
} from '../selectors'
import {
  normalizeChannelData,
  normalizeUserData,
  roomNameFromUsers,
} from './utils'
import {
  error,
  goToChannel,
  goToLastUsedChannel,
  loadNotificationSettings,
  addUser,
  setChannel,
  handleBadChannel,
  showNoContent,
} from './'

const removeManageGroupChannel = channelId => (dispatch, getState) => {
  const { groups, show } = manageGroupsSelector(getState())
  if (find(groups, ({ id }) => id === channelId) && show) {
    dispatch({
      type: types.REMOVE_MANAGE_GROUPS_CHANNEL,
      payload: channelId,
    })
  }
}

export function addChannel(channel) {
  return {
    type: types.ADD_CHANNEL,
    payload: {
      ...normalizeChannelData(channel),
      unread: channel.unread || 0,
    },
  }
}

export const leaveChannel = channelId => dispatch => {
  dispatch({
    type: types.REQUEST_LEAVE_CHANNEL,
    payload: channelId,
  })

  return api
    .leaveChannel(channelId)
    .then(() => {
      dispatch({
        type: types.LEAVE_CHANNEL,
        payload: channelId,
      })
      dispatch(removeManageGroupChannel(channelId))
      dispatch(goToLastUsedChannel())
    })
    .catch(err => dispatch(error(err)))
}

export const kickMemberFromChannel = params => dispatch => {
  dispatch({
    type: types.REQUEST_KICK_MEMBER_FROM_CHANNEL,
    payload: params,
  })

  const { channelId, userId } = params

  return api
    .kickMemberFromChannel(channelId, userId)
    .then(() => {
      dispatch({
        type: types.KICK_MEMBER_FROM_CHANNEL,
        payload: params,
      })
    })
    .catch(err => dispatch(error(err)))
}

export function loadRoomInfo({ channel }) {
  return dispatch => dispatch(loadNotificationSettings({ channel }))
}

export const loadChannelMembers = () => (dispatch, getState) => {
  const channel = channelSelector(getState())

  dispatch({
    type: types.REQUEST_CHANNEL_MEMBERS,
    payload: channel.id,
  })

  api
    .listMembers(channel.id)
    .then(res => res.results)
    .then(users => users.map(normalizeUserData))
    .then(payload => {
      dispatch({
        type: types.HANDLE_CHANNEL_MEMBERS,
        payload,
      })
    })
    .catch(err => dispatch(error(err)))
}

export function invitedToChannel(emailAddresses, channelId) {
  return {
    type: types.INVITED_TO_CHANNEL,
    payload: {
      emailAddresses,
      channelId,
    },
  }
}

export const joinChannel = id => dispatch => {
  dispatch({
    type: types.REQUEST_JOIN_CHANNEL,
    payload: id,
  })
  api
    .joinChannel(id)
    .then(() => {
      dispatch(removeManageGroupChannel(id))
    })
    .catch(err => dispatch(error(err)))
}

export const updateChannelPartnerInfo = channel => dispatch => {
  dispatch({
    type: types.UPDATE_CHANNEL_PARTNER_INFO,
    payload: channel,
  })
}

export function inviteToChannel(emailAddresses, options = {}) {
  return (dispatch, getState) => {
    const id = options.id || channelSelector(getState()).id
    return api
      .inviteToChannel(emailAddresses, id)
      .then(() => dispatch(invitedToChannel(emailAddresses, id)))
      .catch(err => dispatch(error(err)))
  }
}

export function requestRoomCreate() {
  return {
    type: types.REQUEST_ROOM_CREATE,
  }
}

export function handleRoomCreateError(message) {
  return {
    type: types.HANDLE_ROOM_CREATE_ERROR,
    payload: message,
  }
}

export function clearRoomCreateError() {
  return {
    type: types.CLEAR_ROOM_CREATE_ERROR,
  }
}

export const openPm = (userId, options) => (dispatch, getState) => {
  const org = orgSelector(getState())
  const channels = pmsSelector(getState())
  const currUser = userSelector(getState())

  // An attempt to open a conversation with own user.
  if (currUser.id === userId) {
    dispatch(handleBadChannel(alerts.MESSAGE_TO_SELF))
    return
  }

  const foundChannel = find(channels, ({ partner }) => partner.id === userId)
  if (foundChannel) {
    dispatch(goToChannel(foundChannel, options))
    return
  }

  dispatch({
    type: types.REQUEST_OPEN_PM,
    payload: userId,
  })

  api
    .openPm(org.id, userId)
    .then(({ id, users }) => Promise.all([users, api.getChannel(id)]))
    .then(([users, pmChannel]) => {
      dispatch(addUser(pmChannel))
      dispatch(
        addChannel({
          ...pmChannel,
          users,
        }),
      )
      // Using id because after adding, channel was normalized.
      dispatch(goToChannel(pmChannel.id, options))
    })
    .catch(err => {
      dispatch(handleRoomCreateError(err.message))
    })
}

export const openChannel = (channelId, messageId) => (dispatch, getState) => {
  const channels = channelsSelector(getState())
  const foundChannel = find(channels, { id: channelId })
  if (foundChannel) {
    const { id, type, isPublic, joined } = foundChannel
    if (type === 'room' && isPublic && !joined) {
      dispatch(joinChannel(id))
    }
    dispatch(setChannel(id, messageId))
    return
  }

  dispatch({
    type: types.REQUEST_CHANNEL_AND_USERS,
    payload: { channelId, messageId },
  })

  api
    .getChannel(channelId)
    .then(channel => {
      if (channel.type === 'pm') {
        const currUser = userSelector(getState())
        const userIds = [currUser.id, channel.partner.id]
        return { ...channel, users: userIds }
      }

      // TODO we will have to load th room members here once we get rid
      // of `org.channels`. Right now all joined channels are loaded.
      return {}
    })
    .then(pmChannel => {
      if (Object.keys(pmChannel).length) {
        dispatch(addUser(pmChannel))
        dispatch(addChannel(pmChannel))
        dispatch(setChannel(pmChannel.id, messageId))
        return
      }

      // It should be a channel user didn't join yet.
      dispatch(joinChannel(channelId))
    })
    .catch(() => dispatch(handleBadChannel()))
}

export function createRoomWithUsers(room, users) {
  return (dispatch, getState) => {
    dispatch(requestRoomCreate())

    const user = userSelector(getState())
    const isChatEmpty = emptyChatSelector(getState())
    const emailAddresses = users.map(({ email }) => email)
    let newRoom

    return api
      .createRoom({
        ...room,
        name: room.name || roomNameFromUsers([user, ...users]),
      })
      .then(_newRoom => {
        newRoom = _newRoom
        return api.joinChannel(newRoom.id)
      })
      .then(
        () =>
          newRoom ? api.inviteToChannel(emailAddresses, newRoom.id) : null,
      )
      .then(() => {
        if (newRoom) {
          dispatch(goToChannel(newRoom.id))
          dispatch(invitedToChannel(emailAddresses, newRoom.id))
          if (isChatEmpty) {
            dispatch(showNoContent(true))
          }
        }
      })
      .catch(err => {
        dispatch(handleRoomCreateError(err.message))
      })
  }
}

export function renameRoom(id, name) {
  return dispatch =>
    api
      .renameRoom(id, name)
      .then(() => {
        dispatch({
          type: types.REQUEST_ROOM_RENAME,
          payload: {
            id,
            name,
          },
        })
      })
      .catch(({ message }) =>
        dispatch({
          type: types.HANDLE_ROOM_RENAME_ERROR,
          payload: message,
        }),
      )
}

export function setRoomDescription(id, description) {
  return dispatch => {
    if (description.length > maxChannelDescriptionLength) {
      return dispatch(
        error({
          message: `Description should be shorter than ${maxChannelDescriptionLength} symbols.`,
        }),
      )
    }

    return api
      .setRoomDescription(id, description)
      .then(() => {
        dispatch({
          type: types.SET_ROOM_DESCRIPTION,
          payload: {
            id,
            description,
          },
        })
      })
      .catch(err => dispatch(error(err)))
  }
}

export function setRoomPrivacy(id, isPublic) {
  return dispatch =>
    api
      .setRoomPrivacy(id, isPublic)
      .then(() => {
        dispatch({
          type: types.SET_ROOM_PRIVACY,
          payload: {
            id,
            isPublic,
          },
        })
      })
      .catch(err => dispatch(error(err)))
}

export function setRoomColor(id, color) {
  return dispatch =>
    api
      .setRoomColor(id, color)
      .then(() => {
        dispatch({
          type: types.SET_ROOM_COLOR,
          payload: {
            id,
            color,
          },
        })
      })
      .catch(err => dispatch(error(err)))
}

export function setRoomIcon(id, icon) {
  return dispatch =>
    api
      .setRoomIcon(id, icon)
      .then(() => {
        dispatch({
          type: types.SET_ROOM_ICON,
          payload: {
            id,
            icon,
          },
        })
      })
      .catch(err => dispatch(error(err)))
}

export function showRoomDeleteDialog(id) {
  return (dispatch, getState) => {
    const room = find(joinedRoomsSelector(getState()), { id })
    dispatch({
      type: types.SHOW_ROOM_DELETE_DIALOG,
      payload: room,
    })
  }
}

export function hideRoomDeleteDialog() {
  return {
    type: types.HIDE_ROOM_DELETE_DIALOG,
  }
}

export function deleteChannel({ roomId, roomName }) {
  return dispatch =>
    api
      .deleteChannel(roomId, roomName)
      .then(() => {
        dispatch(goToLastUsedChannel())
      })
      .catch(err => dispatch(error(err)))
}

export function clearRoomRenameError() {
  return {
    type: types.CLEAR_ROOM_RENAME_ERROR,
  }
}
