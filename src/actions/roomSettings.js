import * as types from '../constants/actionTypes'
import {maxChannelDescriptionLength} from '../constants/app'
import reduxEmitter from '../legacy/redux-emitter'
import * as api from '../utils/backend/api'
import {error} from './common'

export function renameRoom(id, name) {
  return dispatch => {
    return api
      .renameRoom(id, name)
      .then(() => {
        dispatch({
          type: types.RENAME_ROOM_REQUEST,
          payload: {
            id,
            name
          }
        })
      })
      .catch(({message}) => dispatch({
        type: types.RENAME_ROOM_ERROR,
        payload: message
      }))
  }
}

export function setRoomDescription(id, description) {
  if (description.length > maxChannelDescriptionLength) {
    return error({
      message: `Description should be shorter than ${maxChannelDescriptionLength} symbols.`
    })
  }

  return dispatch => {
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
  return dispatch => {
    return api
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
}

export function setRoomColor(id, color) {
  return dispatch => {
    return api
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
}

export function setRoomIcon(id, icon) {
  return dispatch => {
    return api
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
}

export function showRoomDeteteDialog(id) {
  return dispatch => {
    dispatch({
      type: types.SHOW_ROOM_DELETE_DIALOG,
      payload: id
    })
    reduxEmitter.showRoomDeteteDialog()
  }
}
