import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {type as connection} from '../utils/backend/client'
import {disconnect} from '../app/client'
import conf from '../conf'
import {goTo} from './'

function handleAuthError(err) {
  return (dispatch) => {
    dispatch({
      type: types.AUTH_ERROR,
      payload: err
    })
    dispatch(goTo({path: '/accounts/login'}))
  }
}

export const checkAuth = () => (dispatch) => {
  api
    .checkAuth()
    .then(() => {
      dispatch({
        type: types.HANDLE_AUTH_STATUS,
        payload: 'ok'
      })
    })
    .catch((err) => {
      dispatch({
        type: types.HANDLE_AUTH_STATUS,
        payload: 'nok'
      })
      disconnect()
      if (!conf.embed) dispatch(handleAuthError(err))
    })
}

export function handleConnectionError(err) {
  return (dispatch) => {
    dispatch({
      type: types.CONNECTION_ERROR,
      payload: err
    })

    if (connection === 'ws') {
      dispatch(checkAuth())
      return
    }

    if (err.status === 401) {
      dispatch(handleAuthError(err))
    }
  }
}
