import * as types from '../constants/actionTypes'
import reduxEmitter from '../legacy/redux-emitter'

export function showEmojiBrowser() {
  return dispatch => {
    dispatch({type: types.SHOW_EMOJI_BROWSER})
    reduxEmitter.showEmojiBrowser()
  }
}

export function showGrapeBrowser() {
  return dispatch => {
    dispatch({type: types.SHOW_GRAPE_BROWSER})
    reduxEmitter.showGrapeBrowser()
  }
}
