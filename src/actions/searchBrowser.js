import * as types from '../constants/actionTypes'
import {searchBrowserSelector} from '../selectors'
import store from '../store'
import buildQuery from '../components/query/build'
import {TYPES as QUERY_TYPES} from '../components/query/constants'

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

export function setSearchBrowserFilters(filters) {
  return {
    type: types.SET_SEARCH_BROWSER_FILTERS,
    filters,
    search: ''
  }
}

export function selectSearchBrowserItem(id) {
  return dispatch => {
    const state = searchBrowserSelector(store.getState())
    const item = id ? getItemById(state.sections, id) : getFocusedItem(state.sections)
    const trigger = QUERY_TYPES.search

    if (item.type === 'filters') {
      const service = findById(state.data.services, item.id)
      const filters = service ? [service.key] : []
      dispatch(setSearchBrowserFilters(filters))
      const query = buildQuery({trigger, filters})
      state.onSelectFilter(query)
      return
    }

    const query = buildQuery({
      trigger,
      filters: state.filters,
      search: state.search
    })

    state.onSelectItem({item, query})
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
