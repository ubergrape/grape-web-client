import * as api from '../utils/backend/api'
import { error } from './'

export const initiateCall = (channelId, callerId) => dispatch =>
  api.call(channelId, callerId).catch(err => dispatch(error(err)))
