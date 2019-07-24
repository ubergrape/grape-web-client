import { open } from '../app/client'
import * as types from '../constants/actionTypes'

export const handleReconnecting = payload => dispatch => {
  dispatch({
    type: types.HANDLE_RECONNECTING_CHANGE,
    payload,
  })
}

export const onReconnect = () => dispatch => {
  open()
  dispatch(handleReconnecting(true))
}

export const setTimer = backoff => dispatch => {
  dispatch({
    type: types.SET_TIMER,
    payload: { backoff },
  })
}

export const updateReconnectTimer = () => dispatch => {
  dispatch({
    type: types.UPDATE_TIMER,
  })
}
