import { find, random } from 'lodash'
import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {
  orgSelector,
  channelSelector,
  toastNotificationSelector,
} from '../selectors'
import {
  showToastNotification,
  updateToastNotification,
  createMessage,
} from './'

function uploadFile(file) {
  return (dispatch, getState) => {
    const state = getState()
    const org = orgSelector(state)
    const channel = channelSelector(state)
    const id = random(100000)

    dispatch({
      type: types.START_FILE_UPLOAD,
      payload: { id, name: file.name },
    })

    const onError = err => {
      dispatch({
        type: types.HANDLE_FILE_UPLOAD_ERROR,
        payload: { id, err },
      })
    }

    const upload = api.uploadFile(org.id, file)

    upload
      .on('progress', e => {
        // It is undefined at the end.
        if (e.percent === undefined) return

        dispatch({
          type: types.UPDATE_FILE_UPLOAD_PROGRESS,
          payload: { id, progress: e.percent },
        })
      })
      .on('error', onError)
      .on('response', res => {
        if (res.error || !res.body) {
          dispatch({
            type: types.HANDLE_FILE_UPLOAD_ERROR,
            payload: { id, err: res.error || new Error('Bad response.') },
          })
          return
        }
        dispatch(
          createMessage({
            channelId: channel.id,
            attachments: [res.body],
          }),
        )
      })
      .on('end', () => {
        dispatch({
          type: types.END_FILE_UPLOAD,
          payload: { id },
        })
      })

    upload.end()

    // Should be in the lib itself.
    upload.xhr.addEventListener('error', () => {
      onError(new Error('An unknown error happened.'))
    })
  }
}

export function uploadFiles({ files }) {
  return dispatch => {
    files.forEach(file => {
      dispatch(uploadFile(file))
    })
  }
}

const key = random(1e5)

function showOrUpdateNotification(message, options) {
  return (dispatch, getState) => {
    const { notifications } = toastNotificationSelector(getState())
    const notification = find(notifications, { key })
    if (notification) {
      dispatch(updateToastNotification(key, message, options))
      return
    }
    dispatch(
      showToastNotification(message, {
        ...options,
        key,
        dismissAfter: false,
      }),
    )
  }
}

export function rejectFiles({ files }) {
  return {
    type: types.HANDLE_REJECTED_FILES,
    payload: files.map(file => ({
      id: random(1e5),
      name: file.name || 'Noname',
      error: 'Rejected',
    })),
  }
}

export function showUploadNotification({ message, ...options }) {
  return dispatch => {
    dispatch(showOrUpdateNotification(message, options))
  }
}

export function hideUploadNotification() {
  return dispatch => {
    dispatch(showOrUpdateNotification(null, { dismissAfter: 3000 }))
    dispatch({ type: types.HANDLE_UPLOAD_COMPLETE })
  }
}

export function setOpenFileDialogHandler(fn) {
  return dispatch => {
    dispatch({
      type: types.SET_OPEN_FILE_DIALOG_HANDLER,
      payload: fn,
    })
  }
}
