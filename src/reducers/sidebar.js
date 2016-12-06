import * as types from '../constants/actionTypes'

const initialState = {
  show: false
}

const channelTypes = ['pm', 'room']

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.HIDE_SIDEBAR:
      return {show: false}
    case types.SHOW_SIDEBAR:
      return {show: action.payload}
    case types.SET_CHANNEL: {
      const {type} = action.payload.channel
      const {show} = state
      if (type !== show && channelTypes.includes(show)) {
        return {show: type}
      }
    }
    default:
      return state
  }
}
