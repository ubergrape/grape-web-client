import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import { error } from './'

export const updateCallStatusTimer = payload => ({
  type: types.UPDATE_CALL_STATUS_TIMER,
  payload,
})

export const closeCallStatus = args => dispatch => {
  api
    .hangUp(args)
    .then(() => {
      dispatch({
        type: types.CLOSE_CALL_STATUS,
      })
    })
    .catch(err => dispatch(error(err)))
}
