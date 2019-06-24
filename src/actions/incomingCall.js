import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import { goToChannel, endSound, error } from './'

export const rejectIncomingCall = args => dispatch => {
  api
    .rejectCall(args)
    .then(() => {
      dispatch({
        type: types.CLOSE_INCOMING_CALL,
      })
      dispatch(endSound())
    })
    .catch(err => dispatch(error(err)))
}

export const joinIncomingCall = args => dispatch => {
  api
    .joinCall(args)
    .then(() => {
      dispatch({
        type: types.CLOSE_INCOMING_CALL,
      })
      dispatch(endSound())
    })
    .catch(err => dispatch(error(err)))
}

export const replyWithMessage = args => dispatch => {
  api
    .cancelCall(args)
    .then(() => {
      dispatch(goToChannel(args.channelId))
      dispatch({
        type: types.CLOSE_INCOMING_CALL,
      })
      dispatch(endSound())
    })
    .catch(err => dispatch(error(err)))
}
