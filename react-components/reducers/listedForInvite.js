import * as types from '../constants/actionTypes'

const initialState = {
  listedForInvite: []
}

export default function reducers(state = initialState, action) {
  let listedForInvite
  switch (action.type) {
    case types.ADD_TO_INVITE_LIST:
      listedForInvite = [...state.listedForInvite, action.payload]
      return {
        listedForInvite
      }
    case types.REMOVE_FROM_INVITE_LIST:
      listedForInvite = state.listedForInvite.filter(member => member.id != action.payload.id)
      return {
        listedForInvite
      }
    default:
      return state
  }
}
