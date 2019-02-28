import { open } from '../app/client'
import * as types from '../constants/actionTypes'

export const onReconnect = () => () => {
  open()
}

export const setTimer = backoff => dispatch => {
  dispatch({
    type: types.SET_TIMER,
    payload: { backoff, timerSet: Date.now() },
  })
}

export const updateTimer = timeToReconnection => dispatch => {
  dispatch({
    type: types.UPDATE_TIMER,
    payload: timeToReconnection,
  })
}
