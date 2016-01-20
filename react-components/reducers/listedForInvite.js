import * as types from '../constants/actionTypes'

const initialState = {
  listedForInvite: []
}

export default function reducers(state = initialState, action) {
  let listedForInvite
  switch (action.type) {
    case types.ADD_TO_INVITE_CHANNEL_MEMBER_LIST:
      listedForInvite = [...state.listedForInvite, action.payload]
      return {
        listedForInvite
      }
    case types.REMOVE_FROM_INVITE_CHANNEL_MEMBER_LIST:
      listedForInvite = state.listedForInvite.filter(member => member.id != action.payload.id)
      return {
        listedForInvite
      }
    case types.SET_CHANNEL:
    case types.HIDE_INVITE_CHANNEL_MEMBER_LIST:
      return initialState
    default:
      return state
  }
}
