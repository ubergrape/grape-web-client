import * as types from '../constants/actionTypes'

const initialState = {
  show: true,
  filter: '',
  listed: []
}

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_INVITE_CHANNEL_MEMBER_LIST:
      return {
        ...initialState,
        show: true
      }
    case types.HIDE_INVITE_CHANNEL_MEMBER_LIST:
      return {
        ...initialState,
        show: false
      }
    case types.ADD_TO_INVITE_CHANNEL_MEMBER_LIST:
      return {
        ...state,
        listed: [...state.listed, action.payload]
      }
    case types.REMOVE_FROM_INVITE_CHANNEL_MEMBER_LIST:
      return {
        ...state,
        listed: state.listed.filter(member => member.id !== action.payload.id)
      }
    case types.FILTER_INVITE_CHANNEL_MEMBER_LIST:
      return {
        ...state,
        filter: action.payload
      }
    case types.SET_CHANNEL:
      return initialState
    default:
      return state
  }
}
