import * as types from '../constants/actionTypes'
import includes from 'lodash/collection/includes'

const initialState = {
  show: undefined
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.HIDE_SIDEBAR:
      return {show: undefined}
    case types.SHOW_IN_SIDEBAR:
      return {show: action.payload}
    case types.SET_CHANNEL: {
      const {type} = action.payload.channel
      const {show} = state
      if (includes(['pm', 'room'], show) && type !== show) return {show: type}
    }
    default:
      return state
  }
}
