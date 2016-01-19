import * as types from '../constants/actionTypes'

const initialState = {
  invitedChannelMembers: []
}

export default function reducers(state = initialState, action) {
  let invitedChannelMembers
  switch (action.type) {
    case types.ADD_TO_INVITE_LIST:
      invitedChannelMembers = [...state.invitedChannelMembers, action.payload]
      return {
        invitedChannelMembers
      }
    case types.REMOVE_FROM_INVITE_LIST:
      invitedChannelMembers = state.invitedChannelMembers.filter(member => member.id != action.payload.id)
      return {
        invitedChannelMembers
      }
    default:
      return state
  }
}
