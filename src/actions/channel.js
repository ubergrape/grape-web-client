import find from 'lodash/collection/find'
import * as types from '../constants/actionTypes'
import {maxChannelDescriptionLength} from '../constants/app'
import * as api from '../utils/backend/api'
import {
  joinedRoomsSelector, userSelector, channelSelector, usersSelector,
  orgSelector
} from '../selectors'
import {
  normalizeChannelData,
  roomNameFromUsers
} from './utils'
import {
  error, goToChannel, goToLastUsedChannel, loadNotificationSettings, addUser
} from './'

export function addChannel(channel) {
  return {
    type: types.ADD_CHANNEL,
    payload: {
      ...normalizeChannelData(channel),
      unread: channel.unread || 0
    }
  }
}

export const leaveChannel = channelId => (dispatch) => {
  dispatch({
    type: types.REQUEST_LEAVE_CHANNEL,
    payload: channelId
  })

  return api
    .leaveChannel(channelId)
    .then(() => {
      dispatch({
        type: types.LEAVE_CHANNEL,
        payload: channelId
      })
      dispatch(goToLastUsedChannel())
    })
    .catch(err => dispatch(error(err)))
}

export const kickMemberFromChannel = params => (dispatch) => {
  dispatch({
    type: types.REQUEST_KICK_MEMBER_FROM_CHANNEL,
    payload: params
  })

  const {channelId, userId} = params

  return api
    .kickMemberFromChannel(channelId, userId)
    .then(() => {
      dispatch({
        type: types.KICK_MEMBER_FROM_CHANNEL,
        payload: params
      })
    })
    .catch(err => dispatch(error(err)))
}

export function loadRoomInfo({channel}) {
  return dispatch => dispatch(loadNotificationSettings({channel}))
}

export const loadChannelMembers = () => (dispatch, getState) => {
  const state = getState()
  const users = usersSelector(state)
  const channel = channelSelector(state)
  dispatch({
    type: types.HANDLE_CHANNEL_MEMBERS,
    payload: users.filter(user => Boolean(find(channel.users, {id: user.id})))
  })
}

export function invitedToChannel(emailAddresses, channelId) {
  return {
    type: types.INVITED_TO_CHANNEL,
    payload: {
      emailAddresses,
      channelId
    }
  }
}

export const joinChannel = id => (dispatch) => {
  dispatch({
    type: types.REQUEST_JOIN_CHANNEL,
    payload: id
  })
  api
    .joinChannel(id)
    .catch(err => dispatch(error(err)))
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
    type: types.REQUEST_ROOM_CREATE
  }
}

export function handleRoomCreateError(message) {
  return {
    type: types.HANDLE_ROOM_CREATE_ERROR,
    payload: message
  }
}

export function clearRoomCreateError() {
  return {
    type: types.CLEAR_ROOM_CREATE_ERROR
  }
}

export const openPm = userId => (dispatch, getState) => {
  const org = orgSelector(getState())

  dispatch({
    type: types.REQUEST_OPEN_PM,
    payload: userId
  })

  Promise.all([
    api.getUser(org.id, userId),
    api.openPm(org.id, userId)
  ])
    .then(([user, channel]) => {
      dispatch(addUser(user))
      dispatch(addChannel(channel))
      dispatch(goToChannel(channel.id))
    })
    .catch((err) => {
      dispatch(handleRoomCreateError(err.message))
    })
}

export function createRoomWithUsers(room, users) {
  return (dispatch, getState) => {
    dispatch(requestRoomCreate())

    const user = userSelector(getState())
    const emailAddresses = users.map(({email}) => email)
    let newRoom

    return api
      .createRoom({
        ...room,
        name: room.name || roomNameFromUsers([user, ...users])
      })
      .then((_newRoom) => {
        newRoom = _newRoom
        return api.joinChannel(newRoom.id)
      })
      .then(() => (newRoom ? api.inviteToChannel(emailAddresses, newRoom.id) : null))
      .then(() => {
        if (newRoom) {
          dispatch(goToChannel(newRoom.id))
          dispatch(invitedToChannel(emailAddresses, newRoom.id))
        }
      })
      .catch((err) => {
        dispatch(handleRoomCreateError(err.message))
      })
  }
}

export function renameRoom(id, name) {
  return dispatch => api
      .renameRoom(id, name)
      .then(() => {
        dispatch({
          type: types.REQUEST_ROOM_RENAME,
          payload: {
            id,
            name
          }
        })
      })
      .catch(({message}) => dispatch({
        type: types.HANDLE_ROOM_RENAME_ERROR,
        payload: message
      }))
}

export function setRoomDescription(id, description) {
  return (dispatch) => {
    if (description.length > maxChannelDescriptionLength) {
      return dispatch(error({
        message: `Description should be shorter than ${maxChannelDescriptionLength} symbols.`
      }))
    }

    return api
      .setRoomDescription(id, description)
      .then(() => {
        dispatch({
          type: types.SET_ROOM_DESCRIPTION,
          payload: {
            id,
            description
          }
        })
      })
      .catch(err => dispatch(error(err)))
  }
}

export function setRoomPrivacy(id, isPublic) {
  return dispatch => api
      .setRoomPrivacy(id, isPublic)
      .then(() => {
        dispatch({
          type: types.SET_ROOM_PRIVACY,
          payload: {
            id,
            isPublic
          }
        })
      })
      .catch(err => dispatch(error(err)))
}

export function setRoomColor(id, color) {
  return dispatch => api
      .setRoomColor(id, color)
      .then(() => {
        dispatch({
          type: types.SET_ROOM_COLOR,
          payload: {
            id,
            color
          }
        })
      })
      .catch(err => dispatch(error(err)))
}

export function setRoomIcon(id, icon) {
  return dispatch => api
      .setRoomIcon(id, icon)
      .then(() => {
        dispatch({
          type: types.SET_ROOM_ICON,
          payload: {
            id,
            icon
          }
        })
      })
      .catch(err => dispatch(error(err)))
}

export function showRoomDeleteDialog(id) {
  return (dispatch, getState) => {
    const room = find(joinedRoomsSelector(getState()), {id})
    dispatch({
      type: types.SHOW_ROOM_DELETE_DIALOG,
      payload: room
    })
  }
}

export function hideRoomDeleteDialog() {
  return {
    type: types.HIDE_ROOM_DELETE_DIALOG
  }
}

export function deleteRoom({roomId, roomName}) {
  return dispatch => api
      .deleteRoom(roomId, roomName)
      .catch(err => dispatch(error(err)))
}

export function clearRoomRenameError() {
  return {
    type: types.CLEAR_ROOM_RENAME_ERROR
  }
}
