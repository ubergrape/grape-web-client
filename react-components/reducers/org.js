import * as types from '../constants/actionTypes'

const initialState = {}

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case types.SET_ORG:
      return action.payload.org
    default:
      return state
  }
}
