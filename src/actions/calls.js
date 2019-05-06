import * as api from '../utils/backend/api'
import { error } from './'

export function rejectCall(channelId, callerId) {
  return dispatch =>
    api.call(channelId, callerId).catch(err => dispatch(error(err)))
}
