import * as types from '../constants/actionTypes'

const initialState = {
  usersToMention: []
}

export default function reduce(state = initialState, action) {
  const {payload} = action
  switch (action.type) {
    case types.SEARCH_USERS_TO_MENTION:
      return {...state, usersToMention: payload}
    default:
      return state
  }
}
