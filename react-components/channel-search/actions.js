import * as types from './actionTypes'

export function show(items) {
  return {
    type: types.SHOW,
    payload: {
      show: true,
      items
    }
  }
}

export function hide(items) {
  return {
    type: types.HIDE,
    payload: {
      show: false,
      search: ''
    }
  }
}

export function input(search, items) {
  return {
    type: types.INPUT,
    payload: {
      search,
      items
    }
  }
}
