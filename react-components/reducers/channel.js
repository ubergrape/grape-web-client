import * as types from '../constants/actionTypes'
import isEmpty from 'lodash/lang/isEmpty'

const initialState = {}

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case types.SET_CHANNEL:
      return action.payload.channel
    case types.CHANNEL_LOADING_HISTORY:
      return isEmpty(state) ? state : {...state, loadingHistory: action.payload}
    default:
      return state
  }
}
