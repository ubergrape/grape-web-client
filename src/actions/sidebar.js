import * as types from '../constants/actionTypes'

export function hideSidebar() {
  return (dispatch) => {
    dispatch({
      type: types.HIDE_SIDEBAR
    })
  }
}

export function showInSidebar(panel) {
  return (dispatch) => {
    dispatch({
      type: types.SHOW_SIDEBAR,
      payload: panel
    })
  }
}

export function toggleSearchOnlyInChannel() {
  return {
    type: types.TOGGLE_SEARCH_IN_CHANNEL_ONLY
  }
}

export function toggleSearchActivities() {
  return {
    type: types.TOGGLE_SEARCH_ACTIVITIES
  }
}
