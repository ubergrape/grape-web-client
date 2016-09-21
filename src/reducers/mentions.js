import * as images from '../constants/images'
import * as types from '../constants/actionTypes'

const initialState = {
  limit: 20,
  isLoading: false,
  items: [],
  showRoomMentions: false,
  images
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_SIDEBAR_IS_LOADING:
    case types.LOADED_MENTIONS:
    case types.ADD_MENTION:
    case types.REMOVE_MENTION:
      return {...state, ...action.payload}
    case types.TOGGLE_SHOW_ROOM_MENTION:
      return {...state, showRoomMentions: !state.showRoomMentions}
    default:
      return state
  }
}
