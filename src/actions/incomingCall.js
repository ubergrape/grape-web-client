import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import { goToChannel, error } from './'

export const rejectIncomingCall = (channelId, callerId) => dispatch => {
  api
    .rejectCall(channelId, callerId)
    .then(() => {
      dispatch({
        type: types.CLOSE_INCOMING_CALL,
      })
    })
    .catch(err => dispatch(error(err)))
}

export const joinIncomingCall = ({
  channelId,
  authorId: callerId,
}) => dispatch => {
  api
    .joinCall(channelId, callerId)
    .then(() => {
      dispatch({
        type: types.CLOSE_INCOMING_CALL,
      })
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
    })
    .catch(err => dispatch(error(err)))
}
