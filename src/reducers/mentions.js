import merge from 'lodash/object/merge'
import * as images from '../constants/images'
import * as types from '../constants/actionTypes'

const initialState = {
  limit: 20,
  isLoading: false,
  items: [],
  options: {
    showRoomMentions: {
      show: true,
      status: false
    }
  },
  images
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_SIDEBAR_OPTIONS:
      return {...state, options: merge({}, state.options, action.payload)}
    case types.SET_SIDEBAR_IS_LOADING:
    case types.LOADED_MENTIONS:
    case types.ADD_MENTION:
    case types.REMOVE_MENTION:
      return {...state, ...action.payload}
    case types.TOGGLE_SHOW_ROOM_MENTION: {
      const options = merge({}, state.options)
      options.showRoomMentions.status = !options.showRoomMentions.status
      return {...state, options}
    }
    default:
      return state
  }
}
