import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import { error } from './'

export function requestAddChannelToFavorites(id) {
  return dispatch => {
    dispatch({
      type: types.REQUEST_ADD_CHANNEL_TO_FAVORITES,
      payload: id,
    })

    api.addChannelToFavorites(id).catch(err => dispatch(error(err)))
  }
}

export function requestRemoveChannelFromFavorites(id) {
  return dispatch => {
    dispatch({
      type: types.REQUEST_REMOVE_CHANNEL_FROM_FAVORITES,
      payload: id,
    })

    api.removeChannelFromFavorites(id).catch(err => dispatch(error(err)))
  }
}
