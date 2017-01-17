import * as types from '../constants/actionTypes'
import {supportSelector} from '../selectors'
import * as intercom from '../utils/intercom'

export function hideIntercom() {
  return dispatch => {
    dispatch({
      type: types.HIDE_INTERCOM
    })
    // Each time window.Intercom is the new object.
    intercom.hide()
  }
}

export function showIntercom() {
  return dispatch => {
    dispatch({
      type: types.SHOW_INTERCOM
    })
    intercom.show()
  }
}

export function hideSidebar() {
  return (dispatch, getState) => {
    const {type} = supportSelector(getState())
    dispatch({
      type: types.HIDE_SIDEBAR
    })
    if (type === 'intercom') dispatch(hideIntercom())
  }
}

export function showInSidebar(panel) {
  return dispatch => {
    dispatch({
      type: types.SHOW_SIDEBAR,
      payload: panel
    })
    if (panel === 'intercom') {
      dispatch(showIntercom())
      return
    }
    dispatch(hideIntercom())
  }
}
