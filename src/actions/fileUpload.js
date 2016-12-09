import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {orgSelector, channelSelector} from '../selectors'
import {error} from './common'
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

    dispatch({
      type: types.START_FILE_UPLOAD,
      payload: file
    })

    const notification = showToastNotification('uploading files', {dismissAfter: false})
    const {key: notifKey} = notification.payload

    dispatch(notification)

    api
      .uploadFile(org.id, file)
      .on('progress', (e) => {
        dispatch(updateToastNotification(notifKey, `Uploading ${file.name} ${Math.round(e.percent)}%`))
      })
      .on('error', (err) => {
        dispatch({
          type: types.HANDLE_FILE_UPLOAD_ERROR,
          payload: err
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
          payload: file
        })
        dispatch(updateToastNotification(notifKey, 'uploaded'))
        setTimeout(() => {
          dispatch(hideToastNotification({key: notifKey}))
        }, 3000)
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
