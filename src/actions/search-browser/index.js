import {openUrl} from 'grape-web/lib/x-platform'

import {
  formatGroupedResults,
  findIndexBySelector,
  selectResult
} from './utils'
import * as types from '../../constants/actionTypes'
import {searchBrowserSelector} from '../../selectors'

export function updateSearchBrowserResults(data) {
  const results = formatGroupedResults(data)
  const focusedResult = results[1]

  return {
    type: types.UPDATE_SEARCH_BROWSER_RESULTS,
    payload: {
      results,
      focusedResult
    }
  }
}

export function focusSearchBrowserResult(selector) {
  return (dispatch, getState) => {
    const searchBrowserState = searchBrowserSelector(getState())
    const focusedResult = selectResult(selector, searchBrowserState)

    dispatch({
      type: types.FOCUS_SEARCH_BROWSER_RESULT,
      payload: focusedResult
    })
  }
}

export function selectSearchBrowserResult() {
  return (dispatch, getState) => {
    const {focusedResult} = searchBrowserSelector(getState())

    dispatch({
      type: types.SELECT_SEARCH_BROWSER_RESULT,
      payload: focusedResult
    })
  }
}

export function showSearchBrowserResults() {
  return {type: types.SHOW_SEARCH_BROWSER_RESULTS}
}

export function resetSearchBrowserState() {
  return {type: types.RESET_SEARCH_BROWSER_STATE}
}

export function focusSearchBrowserActions() {
  return {type: types.FOCUS_SEARCH_BROWSER_ACTIONS}
}

export function focusSearchBrowserAction(selector) {
  return (dispatch, getState) => {
    let payload = selector

    if (typeof selector === 'string') {
      const {actions, focusedAction} = searchBrowserSelector(getState())
      const newIndex = findIndexBySelector(selector, actions, action => action === focusedAction)
      payload = actions[newIndex]
    }

    dispatch({
      type: types.FOCUS_SEARCH_BROWSER_ACTION,
      payload
    })
  }
}

export function blurSearchBrowserAction() {
  return {
    type: types.BLUR_SEARCH_BROWSER_ACTION
  }
}

export function execSearchBrowserAction({result, action}) {
  return (dispatch) => {
    dispatch({
      type: types.EXEC_SEARCH_BROWSER_ACTION,
      payload: {result, action}
    })

    if (action.type === 'open') openUrl(result.url)
  }
}

export function showSearchBrowserServices(payload) {
  return (dispatch) => {
    dispatch({
      type: types.SHOW_SEARCH_BROWSER_SERVICES,
      payload
    })
  }
}

export function focusSearchBrowserService(item) {
  return (dispatch, getState) => {
    let payload = item

    // It's a selector.
    if (typeof item === 'string') {
      const {currServices, focusedService} = searchBrowserSelector(getState())
      const newIndex = findIndexBySelector(
        item,
        currServices,
        service => service === focusedService
      )
      payload = currServices[newIndex]
    }

    dispatch({
      type: types.FOCUS_SEARCH_BROWSER_SERVICE,
      payload
    })
  }
}

export function addSearchBrowserFilter(service) {
  return (dispatch) => {
    dispatch({
      type: types.ADD_SEARCH_BROWSER_FILTER,
      payload: service
    })
    dispatch(showSearchBrowserResults())
  }
}

export function updateSearchBrowserInput(payload) {
  return {
    type: types.UPDATE_SEARCH_BROWSER_INPUT,
    payload
  }
}
