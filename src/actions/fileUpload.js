import find from 'lodash/collection/find'
import random from 'lodash/number/random'
import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {orgSelector, channelSelector, toastNotificationSelector} from '../selectors'
import {error} from './common'
import {createMessage} from './history'
import {
  showToastNotification,
  updateToastNotification
} from './toastNotification'

function uploadFile(file) {
  return (dispatch, getState) => {
    const state = getState()
    const org = orgSelector(state)
    const channel = channelSelector(state)
    const id = random(100000)

    dispatch({
      type: types.START_FILE_UPLOAD,
      payload: {id}
    })

    api
      .uploadFile(org.id, file)
      .on('progress', (e) => {
        // It is undefined at the end.
        if (e.percent === undefined) return

        dispatch({
          type: types.UPDATE_FILE_UPLOAD_PROGRESS,
          payload: {id, progress: e.percent}
        })
      })
      .on('error', (err) => {
        dispatch({
          type: types.HANDLE_FILE_UPLOAD_ERROR,
          payload: {id, err}
        })
        dispatch(error(err))
      })
      .on('response', ({body: attachment}) => {
        const message = createMessage({
          channelId: channel.id,
          attachments: [attachment]
        })
        dispatch(message)
      })
      .on('end', () => {
        dispatch({
          type: types.END_FILE_UPLOAD,
          payload: {id}
        })
      })
      .end()
  }
}

export function uploadFiles({files}) {
  return dispatch => {
    files.forEach((file) => {
      dispatch(uploadFile(file))
    })
  }
}

export function rejectFiles({message}) {
  return showToastNotification(message)
}

export function showUploadNotification({message, id}) {
  return (dispatch, getState) => {
    const {notifications} = toastNotificationSelector(getState())
    const notification = find(notifications, {key: id})
    if (notification) {
      return dispatch(updateToastNotification(id, message))
    }
    dispatch(showToastNotification(message, {
      key: id,
      dismissAfter: false
    }))
  }
}
