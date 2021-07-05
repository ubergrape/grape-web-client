import { open } from '../app/client'
import * as types from '../constants/actionTypes'

import { reconnectionDelay } from '../constants/delays'
import { reconnectSelector } from '../selectors'

export const handleReconnecting = payload => dispatch => {
  dispatch({
    type: types.HANDLE_RECONNECTING_CHANGE,
    payload,
  })
}

export const onReconnect = () => (dispatch, getState) => {
  const { openTime } = reconnectSelector(getState())
  if (Date.now() - openTime < reconnectionDelay) {
    setTimeout(() => {
      dispatch(handleReconnecting(false))
    }, 1000)
    return
  }

  dispatch(handleReconnecting(true))
  open()
}

export const setTimer = payload => dispatch => {
  dispatch({
    type: types.SET_TIMER,
    payload,
  })
}

export const updateReconnectTimer = () => dispatch => {
  dispatch({
    type: types.UPDATE_TIMER,
  })
}

export const setOpenTime = payload => dispatch => {
  dispatch({
    type: types.SET_OPEN_TIME,
    payload,
  })
}
