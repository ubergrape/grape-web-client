import * as types from '../constants/actionTypes'

export function hideSidebar() {
  return (dispatch) => {
    dispatch({
      type: types.HIDE_SIDEBAR
    })
  }
}

export function showInSidebar(panel) {
  return dispatch => {
    dispatch({
      type: types.SHOW_SIDEBAR,
      payload: panel
    })
  }
}
