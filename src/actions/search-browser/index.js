import find from 'lodash/collection/find'
import {openUrl} from 'grape-web/lib/x-platform'

import * as types from '../../constants/actionTypes'
import {searchBrowserSelector} from '../../selectors'
import {
  getFocusedItem,
  setFocusedItem,
  extractItems
} from '../../components/browser/dataUtils'
import {
  getSections,
  filtersToServiceId,
  findIndexBySelector
} from './data'

function createState(nextProps, prevState) {
  const {data} = nextProps

  if (!data) {
    return {
      ...nextProps,
      sections: [],
      focusedItem: undefined
    }
  }

  let serviceId
  if (prevState.filters) {
    serviceId = filtersToServiceId(data, prevState.filters)
  }

  const sections = getSections(data, serviceId)

  const focusedItem = getFocusedItem(sections)

  return {...nextProps, sections, focusedItem}
}

/**
 * Returns a new state with focused item according selector.
 */
function focusItem(selector, state) {
  const {sections} = state
  let id = selector

  if (selector === 'next' || selector === 'prev') {
    const items = extractItems(sections)
    const itemIndex = findIndexBySelector(selector, items, item => item.focused)
    id = items[itemIndex].id
  }

  setFocusedItem(sections, id)

  return {
    sections,
    focusedItem: getFocusedItem(sections)
  }
}

function execAction(state) {
  const action = state.focusedAction
  const item = state.focusedItem

  if (action.type === 'insert') {
    state.onSelectItem({item})
    return {
      filters: [],
      search: ''
    }
  }

  if (action.type === 'open') {
    const res = find(state.data.results, ({id}) => id === item.id)
    openUrl(res.url)
  }

  return state
}

function focusAction(selector, state) {
  const {actions} = state
  const newIndex = findIndexBySelector(selector, actions, action => action === state.focusedAction)
  return {focusedAction: state.actions[newIndex]}
}

function navigate(action, state) {
  if (!state.data) return state

  switch (action) {
    case 'select':
      if (state.focusedList === 'actions') return execAction(state)
      return {focusedList: 'actions'}
    case 'back':
      if (state.focusedList === 'objects') return state
      return {focusedList: 'objects'}
    case 'prev':
    case 'next':
      if (state.focusedList === 'objects') {
        return focusItem(action, state)
      }
      if (state.focusedList === 'actions') {
        return focusAction(action, state)
      }
      break
    default:
  }
}

export function createSearchBrowserState(props) {
  return (dispatch, getState) => {
    const state = searchBrowserSelector(getState())

    dispatch({
      type: types.CREATE_SEARCH_BROWSER_STATE,
      payload: createState(props, state)
    })
  }
}

export function resetSearchBrowserState() {
  return {
    type: types.RESET_SEARCH_BROWSER_STATE
  }
}

export function focusSearchBrowserItem(selector) {
  return (dispatch, getState) => {
    const state = searchBrowserSelector(getState())

    dispatch({
      type: types.FOCUS_SEARCH_BROWSER_ITEM,
      payload: focusItem(selector, state)
    })
  }
}

export function focusSearchBrowserAction(action) {
  return {
    type: types.FOCUS_SEARCH_BROWSER_ACTION,
    payload: action
  }
}

export function blurSearchBrowserAction() {
  return {
    type: types.BLUR_SEARCH_BROWSER_ACTION
  }
}

export function execSearchBrowserAction() {
  return (dispatch, getState) => {
    const state = searchBrowserSelector(getState())
    dispatch({
      type: types.EXEC_SEARCH_BROWSER_ACTION,
      payload: execAction(state)
    })
  }
}

export function selectSearchBrowserItem() {
  return (dispatch, getState) => {
    const {focusedItem} = searchBrowserSelector(getState())

    dispatch({
      type: types.SELECT_SEARCH_BROWSER_ITEM,
      payload: focusedItem
    })
  }
}

export function navigateSearchBrowser(action) {
  return (dispatch, getState) => {
    const state = searchBrowserSelector(getState())

    dispatch({
      type: types.NAVIGATE_SEARCH_BROWSER,
      payload: navigate(action, state)
    })
  }
}

export function inputSearchBrowserSearch(query) {
  return (dispatch, getState) => {
    const state = searchBrowserSelector(getState())
    dispatch({
      type: types.INPUT_SEARCH_BROWSER_SEARCH,
      payload: {
        search: query.search,
        filters: query.filters,
        focusedList: 'objects'
      }
    })
    state.onInput(query)
  }
}
