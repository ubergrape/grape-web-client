import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {orgSelector, channelSelector} from '../selectors'
import {error} from './common'
import {createMessage} from './history'

function uploadFile(file) {
  return (dispatch, getState) => {
    const state = getState()
    const org = orgSelector(state)
    const channel = channelSelector(state)

    dispatch({
      type: types.START_FILE_UPLOAD,
      payload: file
    })

    api
      .uploadFile(org.id, file)
      .on('progress', (e) => {
        console.log('progress', e)
      })
      .on('error', (err) => {
        console.log('error', err)
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
      })
  }
}

export function uploadFiles({files}) {
  return dispatch => {
    files.forEach((file) => {
      dispatch(uploadFile(file))
    })
  }
}
