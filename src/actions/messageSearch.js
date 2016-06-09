import store from '../app/store'
import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {messageSearchSelector, orgSelector, channelSelector} from '../selectors'
import {setSidebarIsLoading, error} from './common'
import {formatSidebarMessage} from './utils'

export function updateMessageSearchQuery(nextQuery) {
  const prevQuery = messageSearchSelector(store.getState()).query.join(' ')

  if (nextQuery === prevQuery) return {type: types.NOOP}

  return {
    type: types.UPDATE_MESSAGE_SEARCH_QUERY,
    payload: {
      query: nextQuery.split(' '),
      items: [],
      total: null
    }
  }
}

export function toggleSearchOnlyInChannel() {
  return {
    type: types.TOGGLE_SEARCH_ONLY_IN_CHANNEL
  }
}

const minQueryLength = 2

export function searchMessages(params) {
  return dispatch => {
    const query = params.query.join(' ')

    if (query.length < minQueryLength) {
      return dispatch({
        type: types.FOUND_MESSAGES,
        payload: {
          items: [],
          total: null
        }
      })
    }

    dispatch({type: types.SEARCH_MESSAGES})
    dispatch(setSidebarIsLoading(true))

    const state = store.getState()
    const {id} = orgSelector(state)
    const {limit, offsetDate, searchOnlyInChannel} = params

    const searchParams = {
      query,
      limit,
      offsetDate: offsetDate ? offsetDate.toISOString() : undefined
    }

    if (searchOnlyInChannel) {
      searchParams.orgId = id
      searchParams.channelId = channelSelector(state).id
    } else {
      searchParams.id = id
    }

    api[`searchMessages${searchOnlyInChannel ? 'InChannel' : ''}`](searchParams)
      .then(messages => {
        dispatch(setSidebarIsLoading(false))
        const messageSearch = messageSearchSelector(state)
        const prevItems = messageSearch.items
        const nextItems = messages.results.map(msg =>formatSidebarMessage(msg, state))
        dispatch({
          type: types.FOUND_MESSAGES,
          payload: {
            items: [...prevItems, ...nextItems],
            // Only a query without offset delivers overall total amount.
            total: params.offsetDate ? messageSearch.total : messages.total
          }
        })
      })
      .catch(err => {
        dispatch(setSidebarIsLoading(false))
        dispatch(error(err))
      })
  }
}
