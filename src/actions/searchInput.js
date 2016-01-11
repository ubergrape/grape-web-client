import * as types from '../constants/actionTypes'

export function searchInputKeyPress(event) {
  return {
    type: types.SEARCH_INPUT_KEY_PRESS,
    payload: {
      event
    }
  }
}
