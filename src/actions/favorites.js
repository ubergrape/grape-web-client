import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {error} from './common'

export function requestAddChannelToFavorites(id) {
  return dispatch => {
    api
      .addToFavorite(id)
      .catch(err => dispatch(error(err)))

    dispatch({
      type: types.REQUEST_ADD_CHANNEL_TO_FAVORITES,
      payload: id
    })
  }
}

export function requestRemoveChannelFromFavorites(id) {
  return dispatch => {
    api
      .removeFromFavorite(id)
      .catch(err => dispatch(error(err)))

    dispatch({
      type: types.REQUEST_REMOVE_CHANNEL_FROM_FAVORITES,
      payload: id
    })
  }
}
