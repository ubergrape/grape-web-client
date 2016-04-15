import * as types from '../constants/actionTypes'
import reduxEmitter from '../legacy/redux-emitter'
import {supportSelector} from '../selectors'

export function hideIntercom() {
  const intercom = window.Intercom
  intercom('hide')
  return dispatch => {
    dispatch({
      type: types.HIDE_INTERCOM
    })
  }
}

export function showIntercom() {
  const intercom = window.Intercom
  intercom('show')
  return dispatch => {
    dispatch({
      type: types.SHOW_INTERCOM
    })
  }
}

export function hideSidebar() {
  reduxEmitter.hideSidebar()
  return (dispatch, getState) => {
    const {type} = supportSelector(getState())
    dispatch({
      type: types.HIDE_SIDEBAR
    })
    if (type === 'intercom') dispatch(hideIntercom())
  }
}

export function showInSidebar(panel) {
  reduxEmitter.showSidebar()
  return dispatch => {
    dispatch({
      type: types.SHOW_IN_SIDEBAR,
      payload: panel
    })
    if (panel === 'intercom') {
      dispatch(showIntercom())
      return
    }
    dispatch(hideIntercom())
  }
}
