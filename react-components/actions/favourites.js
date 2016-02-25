import * as types from '../constants/actionTypes'
import * as api from '../backend/api'
import {error} from './common'

export function requestAddToFavourites(id) {
  return dispatch => {
    api
      .addToFavourite(id)
      .catch(err => dispatch(error(err)))

    return {
      type: types.REQUEST_ADD_TO_FAVOURITES,
      payload: id
    }
  }
}

export function requestRemoveFromFavourites(id) {
  return dispatch => {
    api
      .removeFromFavourite(id)
      .catch(err => dispatch(error(err)))

    return {
      type: types.REQUEST_REMOVE_FROM_FAVOURITES,
      payload: id
    }
  }
}
