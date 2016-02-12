import * as types from '../constants/actionTypes'
import find from 'lodash/collection/find'

const initialState = []

export default function reduce(state = initialState, action) {
  const {payload} = action
  switch (action.type) {
    case types.SET_CHANNELS:
      return [...payload.channels]
    default:
      return state
  }
}
