import { uniq } from 'lodash'
import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import { error } from './'

export function showEmojiBrowser() {
  return dispatch => {
    dispatch({ type: types.SHOW_EMOJI_BROWSER })
  }
}

export function showEmojiSuggestBrowser(search) {
  return dispatch => {
    dispatch({ type: types.SHOW_EMOJI_SUGGEST_BROWSER, payload: search })
  }
}

export function showUsersAndRoomsBrowser(search) {
  return dispatch => {
    dispatch({ type: types.SHOW_USERS_AND_ROOMS_BROWSER, payload: search })
  }
}

export function showSearchBrowser(search) {
  return dispatch => {
    dispatch({ type: types.SHOW_SEARCH_BROWSER, payload: search })
  }
}

export function hideBrowser() {
  return dispatch => {
    dispatch({ type: types.HIDE_BROWSER })
  }
}

export function setUnsentMessage(channelId, msg) {
  return dispatch => {
    dispatch({
      type: types.SET_UNSENT_MESSAGE,
      payload: { id: channelId, msg },
    })
  }
}

export function requestAutocompleteServices() {
  return (dispatch, getState) => {
    dispatch({ type: types.REQUEST_AUTOCOMPLETE_SERVICES })

    // TODO
    // Services list is mostly static, we need a separate API for this.
    api
      .autocomplete(getState().org.id, '', { show: 'all' })
      .then(res => {
        dispatch({
          type: types.HANDLE_AUTOCOMPLETE_SERVICES,
          payload: res.services,
        })
      })
      .catch(err => dispatch(error(err)))
  }
}

export function requestAutocompleteServicesStats({ search }) {
  return (dispatch, getState) => {
    dispatch({ type: types.REQUEST_AUTOCOMPLETE_SERVICES_STATS })

    // TODO we need a separate API for this.
    api
      .autocomplete(getState().org.id, search, { show: 'all' })
      .then(res => {
        const servicesStats = res.services.reduce((stats, service) => {
          // eslint-disable-next-line no-param-reassign
          stats[service.id] = service.count
          return stats
        }, {})

        dispatch({
          type: types.HANDLE_AUTOCOMPLETE_SERVICES_STATS,
          payload: servicesStats,
        })
      })
      .catch(err => dispatch(error(err)))
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
      type: 'plain',
    },
  }

  return values.reduce(
    (data, { results, services, search }) => ({
      ...data,
      results: [...data.results, ...results],
      services: uniq([...data.services, ...services], 'id'),
      search: {
        queries: uniq([...data.search.queries, ...search.queries], 'id'),
        // Always remove filter from the search string.
        // Waiting for the new api to remove it
        // TODO https://github.com/ubergrape/chatgrape/issues/3394
        text: search.text.substr(search.text.indexOf(':') + 1),
        type: search.type === 'external' ? 'external' : 'plain',
      },
    }),
    defaultData,
  )
}

export function requestAutocomplete({ search, filters }) {
  return (dispatch, getState) => {
    const orgId = getState().org.id
    let searches
    if (filters && filters.length) {
      searches = filters.map(filter =>
        api.autocomplete(orgId, `${filter}:${search}`, { showAll: false }),
      )
    } else {
      searches = [api.autocomplete(orgId, search)]
    }

    dispatch({
      type: types.REQUEST_AUTOCOMPLETE,
      payload: { search, filters },
    })

    Promise.all(searches)
      .then(res =>
        dispatch({
          type: types.HANDLE_AUTOCOMPLETE,
          payload: mergeSearchResults(res),
        }),
      )
      .catch(err => dispatch(error(err)))
  }
}

export const searchChannelsToMention = (
  org,
  search,
  limit,
  currentChannel,
) => dispatch => {
  dispatch({
    type: types.REQUEST_SEARCH_CHANNELS_TO_MENTION,
    payload: search,
  })
  api
    .searchChannels({
      orgId: org.id,
      search,
      limit,
      currentChannel,
    })
    .then(({ q, results }) => {
      dispatch({
        type: types.HANDLE_CHANNELS_TO_MENTION,
        payload: {
          search: q,
          results,
        },
      })
    })
    .catch(err => dispatch(error(err)))
}

export const setTyping = ({ channel, typing }) => dispatch => {
  dispatch({
    type: types.SET_TYPING,
    payload: { channel, typing },
  })

  api.setTyping(channel.id, typing).catch(err => dispatch(error(err)))
}
