import uniq from 'lodash/array/uniq'
import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {error} from './common'

export function showEmojiBrowser() {
  return (dispatch) => {
    dispatch({type: types.SHOW_EMOJI_BROWSER})
  }
}

export function showEmojiSuggestBrowser(search) {
  return (dispatch) => {
    dispatch({type: types.SHOW_EMOJI_SUGGEST_BROWSER, payload: search})
  }
}

export function showUsersAndRoomsBrowser(search) {
  return (dispatch) => {
    dispatch({type: types.SHOW_USERS_AND_ROOMS_BROWSER, payload: search})
  }
}

export function showSearchBrowser(search) {
  return (dispatch) => {
    dispatch({type: types.SHOW_SEARCH_BROWSER, payload: search})
  }
}

export function hideBrowser() {
  return (dispatch) => {
    dispatch({type: types.HIDE_BROWSER})
  }
}

export function setUnsentMessage(channelId, msg) {
  return (dispatch) => {
    dispatch({type: types.SET_UNSENT_MESSAGE, payload: {id: channelId, msg}})
  }
}

export function requestAutocompleteServices() {
  return (dispatch, getState) => {
    api
      .autocomplete(getState().org.id, '', {show: 'all'})
      .then(res => dispatch({
        type: types.HANDLE_AUTOCOMPLETE_SERVICES,
        payload: res.services
      }))
      .catch(err => dispatch(error(err)))

    dispatch({
      type: types.REQUEST_AUTOCOMPLETE_SERVICES
    })
  }
}

/**
 * Merge results of multiple autocomplete searches.
 */
function mergeSearchResults(values) {
  const defaultData = {
    results: [],
    services: [],
    search: {
      queries: [],
      text: '',
      type: 'plain'
    }
  }

  return values.reduce((data, {results, services, search}) => ({
    ...data,
    results: [...data.results, ...results],
    services: uniq([...data.services, ...services], 'id'),
    search: {
      queries: uniq([...data.search.queries, ...search.queries], 'id'),
      // Always remove filter from the search string.
      // Waiting for the new api to remove it
      // TODO https://github.com/ubergrape/chatgrape/issues/3394
      text: search.text.substr(search.text.indexOf(':') + 1),
      type: search.type === 'external' ? 'external' : 'plain'
    }
  }), defaultData)
}

export function requestAutocomplete({search, filters}) {
  return (dispatch, getState) => {
    const orgId = getState().org.id
    let searches
    if (filters && filters.length) {
      searches = filters.map(filter => api.autocomplete(orgId, `${filter}:${search}`, {showAll: false}))
    } else {
      searches = [api.autocomplete(orgId, search)]
    }

    Promise
      .all(searches)
      .then(res => dispatch({
        type: types.HANDLE_AUTOCOMPLETE,
        payload: mergeSearchResults(res)
      }))
      .catch(err => dispatch(error(err)))

    dispatch({
      type: types.REQUEST_AUTOCOMPLETE,
      payload: {search, filters}
    })
  }
}

export function setTyping({channel, typing}) {
  return (dispatch) => {
    api
      .setTyping({channel, typing})
      .catch(err => dispatch(error(err)))

    dispatch({
      type: types.SET_TYPING,
      payload: {channel, typing}
    })
  }
}

