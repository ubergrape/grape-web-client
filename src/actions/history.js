import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {error} from './common'

// https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2
function formatMessage(msg) {

}

export function loadHistory(channelId, options) {
  return dispatch => {
    dispatch({type: types.REQUEST_HISTORY})
    api
      .loadHistory(channelId, options)
      .then(messages => {
        console.log(111, messages)
        dispatch({
          type: types.HANDLE_LOADED_HISTORY,
          payload: messages
        })
      })
      .catch(err => dispatch(error(err)))
  }
}
