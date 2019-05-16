import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import { goToChannel, endSound, error } from './'

export const rejectIncomingCall = channelId => dispatch => {
  api
    .rejectCall(channelId)
    .then(() => {
      dispatch({
        type: types.CLOSE_INCOMING_CALL,
      })
      dispatch(endSound())
    })
    .catch(err => dispatch(error(err)))
}

export const joinIncomingCall = channelId => dispatch => {
  api
    .joinCall(channelId)
    .then(() => {
      dispatch({
        type: types.CLOSE_INCOMING_CALL,
      })
      dispatch(endSound())
    })
    .catch(err => dispatch(error(err)))
}

export const replyWithMessage = channelId => dispatch => {
  api
    .cancelCall(channelId)
    .then(() => {
      dispatch(goToChannel(channelId))
      dispatch({
        type: types.CLOSE_INCOMING_CALL,
      })
      dispatch(endSound())
    })
    .catch(err => dispatch(error(err)))
}
