import * as types from '../constants/actionTypes'
import reduxEmitter from '../legacy/redux-emitter'
import {supportSelector} from '../selectors'

export function hideIntercom() {
  return dispatch => {
    dispatch({
      type: types.HIDE_INTERCOM
    })
    // Each time window.Intercom is the new object.
    const intercom = window.Intercom
    intercom('hide')
  }
}

export function showIntercom() {
  return dispatch => {
    dispatch({
      type: types.SHOW_INTERCOM
    })
    const intercom = window.Intercom
    intercom('show')
  }
}

export function hideSidebar() {
  return (dispatch, getState) => {
    const {type} = supportSelector(getState())
    dispatch({
      type: types.HIDE_SIDEBAR
    })
    if (type === 'intercom') dispatch(hideIntercom())
    reduxEmitter.hideSidebar()
  }
}

export function showInSidebar(panel) {
  return dispatch => {
    dispatch({
      type: types.SHOW_IN_SIDEBAR,
      payload: panel
    })
    reduxEmitter.showSidebar()
    if (panel === 'intercom') {
      dispatch(showIntercom())
      return
    }
    dispatch(hideIntercom())
  }
}
