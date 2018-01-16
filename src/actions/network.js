import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import publicApi from '../api'
import {type as connection} from '../utils/backend/client'
import {disconnect} from '../app/client'
import {appSelector} from '../selectors'
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

export const checkAuth = () => (dispatch, getState) => {
  api
    .checkAuth()
    .then(() => {
      const app = appSelector(getState())
      if (app.auth === 'nok') {
        dispatch({
          type: types.HANDLE_AUTH_STATUS,
          payload: 'ok'
        })
      }
      publicApi.setAuthStatus('authorized')
    })
    .catch((err) => {
      // It might be a connection loss which is handled in a different place.
      if (err.status !== 401) return
      dispatch({
        type: types.HANDLE_AUTH_STATUS,
        payload: 'nok'
      })
      publicApi.setAuthStatus('unauthorized')
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
