import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import { goToChannel, endSound, error } from './'

export const rejectIncomingCall = (channelId, callerId) => dispatch => {
  api
    .rejectCall(channelId, callerId)
    .then(() => {
      dispatch({
        type: types.CLOSE_INCOMING_CALL,
      })
      dispatch(endSound())
    })
    .catch(err => dispatch(error(err)))
}

export const joinIncomingCall = ({
  channelId,
  authorId: callerId,
  url,
}) => dispatch => {
  api
    .joinCall(channelId, callerId)
    .then(() => {
      window.open(url, 'grape')
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
