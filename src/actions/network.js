import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {type as connection} from '../utils/backend/client'
import {goTo} from './common'

function handleAuthError(err) {
  return (dispatch) => {
    dispatch({
      type: types.AUTH_ERROR,
      payload: err
    })
    dispatch(goTo({path: '/accounts/login'}))
  }
}

export function handleConnectionError(err) {
  return (dispatch) => {
    dispatch({
      type: types.CONNECTION_ERROR,
      payload: err
    })

    if (connection === 'ws') {
      api
        .checkAuth()
        .catch((authErr) => {
          if (authErr.status === 401) {
            dispatch(handleAuthError(authErr))
          }
        })
      return
    }

    if (err.status === 401) {
      dispatch(handleAuthError(err))
    }
  }
}
