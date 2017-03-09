import * as types from '../constants/actionTypes'

const initialState = {
  show: false
}

const channelTypes = ['pm', 'room']

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.HIDE_SIDEBAR:
      return {...state, show: false}
    case types.SHOW_SIDEBAR:
      return {...state, show: action.payload}
    case types.SET_CHANNEL: {
      const {type} = action.payload.channel
      const {show} = state
      if (type !== show && channelTypes.includes(show)) {
        return {...state, show: type}
      }
      return state
    }
    default:
      return state
  }
}
