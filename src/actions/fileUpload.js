import find from 'lodash/collection/find'
import random from 'lodash/number/random'
import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {orgSelector, channelSelector, toastNotificationSelector} from '../selectors'
import {createMessage} from './history'
import {
  showToastNotification,
  updateToastNotification,
  hideToastNotification
} from './toastNotification'

function uploadFile(file) {
  return (dispatch, getState) => {
    const state = getState()
    const org = orgSelector(state)
    const channel = channelSelector(state)
    const id = random(100000)

    dispatch({
      type: types.START_FILE_UPLOAD,
      payload: {id, name: file.name}
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
      })
      .on('response', (res) => {
        if (res.error) return
        const message = createMessage({
          channelId: channel.id,
          attachments: [res.body]
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

const key = 'fileUploadsNotification'

function showOrUpdateNotification(message, options) {
  return (dispatch, getState) => {
    const {notifications} = toastNotificationSelector(getState())
    const notification = find(notifications, {key})
    if (notification) {
      return dispatch(updateToastNotification(key, message, options))
    }
    dispatch(showToastNotification(message, {
      ...options,
      key,
      dismissAfter: false
    }))
  }
}

export function rejectFiles({files}) {
  return {
    type: types.HANDLE_REJECTED_FILES,
    payload: files.map(file => ({
      id: random(10000),
      name: file.name
    }))
  }
}

export function showUploadNotification({message, ...options}) {
  return (dispatch) => {
    dispatch(showOrUpdateNotification(message, options))
  }
}

export function hideUploadNotification() {
  return dispatch => {
    dispatch(hideToastNotification({key}))
    dispatch({type: types.HANDLE_UPLOAD_COMPLETE})
  }
}
