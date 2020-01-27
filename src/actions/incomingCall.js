import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import { goToChannel, endSound, error } from './'

export const closeIncomingCall = () => dispatch => {
  dispatch({
    type: types.CLOSE_INCOMING_CALL,
  })
}

export const rejectIncomingCall = args => dispatch => {
  api
    .rejectCall(args)
    .then(() => {
      dispatch(closeIncomingCall())
      dispatch({
        type: types.CLEAR_INCOMING_CALL_DATA,
      })
      dispatch(endSound())
    })
    .catch(err => dispatch(error(err)))
}

export const cancelIncomingCall = args => dispatch => {
  api
    .cancelCall(args)
    .then(() => {
      dispatch(closeIncomingCall())
      dispatch({
        type: types.CLEAR_INCOMING_CALL_DATA,
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
      dispatch(closeIncomingCall())
      dispatch({
        type: types.CLEAR_INCOMING_CALL_DATA,
      })
      dispatch(endSound())
    })
    .catch(err => dispatch(error(err)))
}
