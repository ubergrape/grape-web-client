import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import { error } from './'

export const updateCallTimer = () => ({
  type: types.UPDATE_INCOMING_CALL_TIMER,
})

export const closeIncomingCall = channelId => dispatch => {
  api
    .cancelCall(channelId)
    .then(() => {
      dispatch({
        type: types.CLOSE_INCOMING_CALL,
      })
    })
    .catch(err => dispatch(error(err)))
}

export const rejectIncomingCall = (channelId, callerId) => dispatch => {
  api
    .rejectCall(channelId, callerId)
    .then(() => {
      dispatch({
        type: types.REJECT_INCOMING_CALL,
      })
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
        type: types.JOIN_INCOMING_CALL,
      })
    })
    .catch(err => dispatch(error(err)))
}
