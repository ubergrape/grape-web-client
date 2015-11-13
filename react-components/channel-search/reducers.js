import * as types from './actionTypes'

const initialState = {
  show: false,
  search: '',
  items: []
}

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case types.SHOW:
      return {...state, ...action.payload}

    case types.HIDE:
      return {...state, ...action.payload}

    case types.INPUT:
      return {...state, ...action.payload}

    default:
      return state
  }
}
