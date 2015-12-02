import * as types from '../constants/actionTypes'

const initialState = {
  channels: []
}

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case types.SET_CHANNELS:
      return action.payload.channels
    default:
      return state
  }
}
