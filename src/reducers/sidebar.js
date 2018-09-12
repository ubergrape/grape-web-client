import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
}

const channelTypes = ['pm', 'room']

export default function reduce(state = initialState, action) {
  const { payload } = action
  switch (action.type) {
    case types.HIDE_SIDEBAR:
      return initialState
    case types.SHOW_SIDEBAR:
      return {
        ...state,
        show: payload,
        showSubview: channelTypes.includes(payload) && 'pinnedMessages',
      }
    case types.SHOW_SIDEBAR_SUBVIEW:
      return { ...state, showSubview: payload }
    case types.SET_CHANNEL: {
      const { type } = payload.channel
      const { show } = state
      if (type !== show && channelTypes.includes(show)) {
        return { ...state, show: type, showSubview: 'pinnedMessages' }
      }
      return state
    }
    default:
      return state
  }
}
