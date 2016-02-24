import * as types from '../constants/actionTypes'
import * as api from '../backend/api'
import {error} from './common'

export function requestAddToFavorites(id) {
  return dispatch => {
    api
      .addToFavorite(id)
      .catch(err => dispatch(error(err)))

    return {
      type: types.REQUEST_ADD_TO_FAVORITES,
      payload: id
    }
  }
}

export function requestRemoveFromFavorites(id) {
  return dispatch => {
    api
      .removeFromFavorite(id)
      .catch(err => dispatch(error(err)))

    return {
      type: types.REQUEST_REMOVE_FROM_FAVORITES,
      payload: id
    }
  }
}
