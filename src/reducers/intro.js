import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
  step: 0
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_INTRO:
      return {...state, show: true}
    case types.SHOW_NEXT_INTRO:
      return {...state, step: state.step + 1}
    case types.HIDE_INTRO:
      return initialState
    default:
      return state
  }
}
