import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
  roomSettingsOn: false,
  filter: '',
  listed: []
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_NEW_CONVERSATION:
      return {
        ...initialState,
        show: true
      }
    case types.HIDE_NEW_CONVERSATION:
      return {...initialState}
    case types.ADD_TO_NEW_CONVERSATION:
      return {
        ...state,
        listed: [...state.listed, action.payload]
      }
    case types.REMOVE_FROM_NEW_CONVERSATION:
      return {
        ...state,
        listed: state.listed.filter(member => member.id !== action.payload.id)
      }
    case types.FILTER_NEW_CONVERSATION:
      return {
        ...state,
        filter: action.payload
      }
    case types.SHOW_NEW_CONVERSATION_ROOM_SETTINGS:
      return {
        ...state,
        roomSettingsOn: true
      }
    case types.SET_CHANNEL:
      return initialState
    default:
      return state
  }
}
