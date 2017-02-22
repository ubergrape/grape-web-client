import find from 'lodash/collection/find'
import * as types from '../constants/actionTypes'
import {maxChannelDescriptionLength} from '../constants/app'
import * as api from '../utils/backend/api'
import {error} from './common'
import {loadNotificationSettings} from './notificationSettings'
import {joinedRoomsSelector} from '../selectors'

export function loadRoomInfo({channel}) {
  return dispatch => dispatch(loadNotificationSettings({channel}))
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

export function showRoomDeteteDialog(id) {
  return (dispatch, getState) => {
    const room = find(joinedRoomsSelector(getState()), {id})
    dispatch({
      type: types.SHOW_ROOM_DELETE_DIALOG,
      payload: room
    })
  }
}

export function hideRoomDeteteDialog() {
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
