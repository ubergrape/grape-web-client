import findIndex from 'lodash/findIndex'
import * as types from '../constants/actionTypes'

export const initial = []

export const states = {
  [types.SET_CALLS]: (state, payload) => payload,
  [types.ADD_CALL]: (state, payload) => {
    const newState = state
    const index = findIndex(newState, { id: payload.id })

    if (index === -1) return [...newState, payload]

    newState.splice(index, 1, payload)
    return newState
  },
  [types.REMOVE_CALL]: (state, payload) => {
    const newState = state
    const index = findIndex(newState, { id: payload })

    if (index === -1) return state

    return newState.filter(call => call.id !== payload)
  },
}
