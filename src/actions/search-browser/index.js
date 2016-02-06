import find from 'lodash/collection/find'
import findIndex from 'lodash/array/findIndex'
import {openUrl} from 'grape-web/lib/x-platform'

import * as types from '../../constants/actionTypes'
import {searchBrowserSelector} from '../../selectors'
import {
  getFocusedItem,
  setFocusedItem,
  extractItems,
  findById,
  setSelectedTab
} from '../../components/browser/dataUtils'
import {
  getSections,
  getSelectedSection,
  setSelectedSection,
  setFocusedItemAt,
  getTabs,
  filtersToServiceId,
  findIndexBySelector
} from './data'

function createState(nextProps, prevState) {
  const {data} = nextProps

  if (!data) {
    return {
      ...nextProps,
      sections: [],
      tabs: [],
      focusedItem: undefined
    }
  }

  let serviceId
  if (prevState.filters) {
    serviceId = filtersToServiceId(data, prevState.filters)
  }

  let sections = getSections(
    data,
    serviceId,
    nextProps.maxItemsPerSectionInAll
  )

  const selectedSection = getSelectedSection(sections)
  if (selectedSection) sections = [selectedSection]

  const tabs = getTabs(data.services, serviceId)

  const focusedItem = getFocusedItem(sections)

  return {...nextProps, sections, tabs, focusedItem}
}

/**
 * Select tab.
 *
 * @param {String} selector can be tab id or "prev" or "next"
 */
function selectTab(selector, state) {
  if (!state.data) return state

  const {tabs} = state
  let tabIndex

  if (selector === 'prev' || selector === 'next') {
    tabIndex = findIndexBySelector(selector, tabs, tab => tab.selected)
  } else {
    tabIndex = findIndex(tabs, tab => tab.id === selector)
  }

  const {id} = tabs[tabIndex]

  setSelectedTab(tabs, tabIndex)
  const sections = getSections(
    state.data,
    id,
    state.maxItemsPerSectionInAll
  )
  setSelectedSection(sections, id)
  setFocusedItemAt(sections, id, 0)

  const service = findById(state.data.services, id)
  const filters = service ? [service.key] : []
  const focusedItem = getFocusedItem(sections)

  return {
    tabs,
    sections,
    filters,
    focusedItem
  }
}

/**
 * Returns a new state with focused item according selector.
 */
function focusItem(selector, state) {
  const {sections} = state
  let id = selector

  if (selector === 'next' || selector === 'prev') {
    const selectedSection = getSelectedSection(sections)
    const items = selectedSection ? selectedSection.items : extractItems(sections)
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
    const {data, focusedItem} = searchBrowserSelector(getState())

    if (focusedItem.type === 'filters') {
      const service = findById(data.services, focusedItem.id)
      const filters = service ? [service.key] : []
      dispatch({
        type: types.SET_SEARCH_BROWSER_FILTERS,
        payload: {
          filters,
          search: ''
        }
      })
      return
    }

    dispatch({
      type: types.SELECT_SEARCH_BROWSER_ITEM,
      payload: focusedItem
    })
  }
}

export function selectSearchBrowserTab(selector) {
  return (dispatch, getState) => {
    const state = searchBrowserSelector(getState())
    dispatch({
      type: types.SELECT_SEARCH_BROWSER_TAB,
      payload: selectTab(selector, state)
    })
  }
}

export function navigateSearchBrowser(action) {
  return (dispatch, getState) => {
    const state = searchBrowserSelector(getState())

    if (action === 'select' && state.focusedItem && state.focusedItem.type === 'filters') {
      return dispatch(selectSearchBrowserItem())
    }

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
