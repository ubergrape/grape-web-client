import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
  filter: '',
  listed: [],
  loaded: false,
  users: [],
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_CHANNEL_MEMBERS_INVITE:
      return {
        ...initialState,
        show: true,
      }
    case types.HIDE_CHANNEL_MEMBERS_INVITE:
      return {
        ...initialState,
        show: false,
      }
    case types.ADD_TO_CHANNEL_MEMBERS_INVITE:
      return {
        ...state,
        listed: [...state.listed, action.payload],
      }
    case types.REMOVE_FROM_CHANNEL_MEMBERS_INVITE:
      return {
        ...state,
        listed: state.listed.filter(member => member.id !== action.payload.id),
      }
    case types.FILTER_CHANNEL_MEMBERS_INVITE:
      return {
        ...state,
        loaded: false,
        filter: action.payload,
      }
    case types.FOUND_USERS_TO_INVITE:
      return {
        ...state,
        users: action.payload,
        loaded: true,
      }
    case types.SET_CHANNEL:
      return initialState
    default:
      return state
  }
}
