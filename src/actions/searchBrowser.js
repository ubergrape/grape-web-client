import * as types from '../constants/actionTypes'
import {searchBrowserSelector} from '../selectors'
import store from '../store'

import {
  getFocusedItem,
  getItemById,
  findById
} from '../components/browser/dataUtils'

export function focusSearchBrowserItem(selector) {
  return {
    type: types.FOCUS_SEARCH_BROWSER_ITEM,
    payload: {
      selector
    }
  }
}

export function focusSearchBrowserAction(action) {
  return {
    type: types.FOCUS_SEARCH_BROWSER_ACTION,
    payload: {
      action
    }
  }
}

export function execSearchBrowserAction(action) {
  return {
    type: types.EXEC_SEARCH_BROWSER_ACTION,
    payload: {
      action
    }
  }
}

export function setSearchBrowserFilters(filters) {
  return {
    type: types.SET_SEARCH_BROWSER_FILTERS,
    payload: {
      filters,
      search: ''
    }
  }
}

export function selectSearchBrowserItem(id) {
  return dispatch => {
    const state = searchBrowserSelector(store.getState())
    const item = id ? getItemById(state.sections, id) : getFocusedItem(state.sections)

    if (item.type === 'filters') {
      const service = findById(state.data.services, item.id)
      const filters = service ? [service.key] : []
      dispatch(setSearchBrowserFilters(filters))
      return
    }

    dispatch({
      type: types.SELECT_SEARCH_BROWSER_ITEM,
      payload: {
        focusedItem: item
      }
    })
  }
}

export function selectSearchBrowserTab(selector) {
  return {
    type: types.SELECT_SEARCH_BROWSER_TAB,
    payload: {
      selector
    }
  }
}

export function createSearchBrowserState(props) {
  return {
    type: types.CREATE_SEARCH_BROWSER_STATE,
    payload: {
      props
    }
  }
}

export function navigateSearchBrowser(action) {
  return {
    type: types.NAVIGATE_SEARCH_BROWSER,
    payload: {
      action
    }
  }
}
