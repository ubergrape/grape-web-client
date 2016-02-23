import * as types from '../constants/actionTypes'

export function addToFavorites(id) {
  return {
    type: types.ADD_TO_FAVORITES,
    payload: id
  }
}

export function removeFromFavorites(id) {
  return {
    type: types.REMOVE_FROM_FAVORITES,
    payload: id
  }
}
