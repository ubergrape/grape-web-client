import find from 'lodash/collection/find'
import {openUrl} from 'grape-web/lib/x-platform'

import {
  formatGroupedResults,
  findIndexBySelector,
  mapServiceIdsToKeys
} from './data'
import * as types from '../../constants/actionTypes'
import {searchBrowserSelector} from '../../selectors'
import {SERVICES_TRIGGER} from '../../components/query/constants'

export function createSearchBrowserState(props) {
  const {data} = props
  let results = []
  let focusedResult

  if (data) {
    results = formatGroupedResults(data)
    focusedResult = results[1]
  }

  return {
    type: types.CREATE_SEARCH_BROWSER_STATE,
    payload: {
      ...props,
      results,
      focusedResult
    }
  }
}

export function resetSearchBrowserState() {
  return {type: types.RESET_SEARCH_BROWSER_STATE}
}

export function showSearchBrowserResults() {
  return {type: types.SHOW_SEARCH_BROWSER_RESULTS}
}

export function focusSearchBrowserResult(selector) {
  return (dispatch, getState) => {
    const {results, focusedResult: currFocusedResult} = searchBrowserSelector(getState())
    let focusedResult

    if (typeof selector === 'string') {
      const pureResults = results.filter(({type}) => type !== 'header')
      const newResultIndex = findIndexBySelector(
        selector,
        pureResults,
        result => result === currFocusedResult
      )
      focusedResult = pureResults[newResultIndex]
    } else {
      focusedResult = selector
    }

    dispatch({
      type: types.FOCUS_SEARCH_BROWSER_RESULT,
      payload: {
        results,
        focusedResult
      }
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

export function clearSearchBrowserInput() {
  return {
    type: types.CLEAR_SEARCH_BROWSER_INPUT
  }
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

export function execSearchBrowserAction() {
  return (dispatch, getState) => {
    const state = searchBrowserSelector(getState())
    const action = state.focusedAction
    const item = state.focusedResult

    dispatch({
      type: types.EXEC_SEARCH_BROWSER_ACTION,
      payload: action
    })

    if (action.type === 'insert') {
      dispatch(clearSearchBrowserInput())
      // TODO move this when we port the whole client to redux.
      state.onSelectItem({item})
    }

    if (action.type === 'open') {
      const res = find(state.data.results, ({id}) => id === item.id)
      openUrl(res.url)
    }
  }
}

export function loadSearchBrowserServicesResultsAmounts() {
  return (dispatch, getState) => {
    const {onLoadResultsAmounts, search} = searchBrowserSelector(getState())

    dispatch({type: types.LOAD_SEARCH_BROWSER_SERVICES_RESULTS_AMOUNTS})
    onLoadResultsAmounts(search, services => {
      const payload = services.reduce((data, service) => {
        data[service.id] = service.count
        return data
      }, {})
      dispatch({
        type: types.UPDATE_SEARCH_BROWSER_SERVICES_RESULTS_AMOUNTS,
        payload
      })
    })
  }
}

export function showSearchBrowserServices(query) {
  return dispatch => {
    dispatch({
      type: types.SHOW_SEARCH_BROWSER_SERVICES,
      payload: query.search
    })

    dispatch(loadSearchBrowserServicesResultsAmounts())
  }
}

export function focusSearchBrowserService(item) {
  return (dispatch, getState) => {
    let payload = item

    // It's a selector.
    if (typeof item === 'string') {
      const {currServices, focusedService} = searchBrowserSelector(getState())
      const newIndex = findIndexBySelector(item, currServices, service => service === focusedService)
      payload = currServices[newIndex]
    }

    dispatch({
      type: types.FOCUS_SEARCH_BROWSER_SERVICE,
      payload
    })
  }
}

export function addSearchBrowserService(service) {
  return dispatch => {
    dispatch({
      type: types.ADD_SEARCH_BROWSER_SERVICE,
      payload: service
    })
    dispatch(showSearchBrowserResults())
  }
}

export function changeSearchBrowserInput({value, search, filters, query}) {
  return (dispatch, getState) => {
    if (!value) {
      dispatch(clearSearchBrowserInput())
      return
    }

    const {onChange, services} = searchBrowserSelector(getState())

    dispatch({
      type: types.UPDATE_SEARCH_BROWSER_INPUT,
      payload: {value, search, filters}
    })

    if (query.trigger === SERVICES_TRIGGER) {
      dispatch(showSearchBrowserServices(query))
    } else {
      dispatch(showSearchBrowserResults())
      // TODO move this when we port the whole client to redux.
      onChange({search, filters: mapServiceIdsToKeys(filters, services)})
    }
  }
}
