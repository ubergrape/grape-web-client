import publicApi from '../api'
import * as types from '../constants/actionTypes'

export function setSidebarIsLoading(isLoading) {
  return {
    type: types.SET_SIDEBAR_IS_LOADING,
    payload: {
      isLoading
    }
  }
}

export function hideSidebar() {
  return (dispatch) => {
    dispatch({type: types.HIDE_SIDEBAR})
    publicApi.onHideSidebar()
  }
}

export function showSidebar(panel) {
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
