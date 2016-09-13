import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {messageSearchSelector, orgSelector, channelSelector} from '../selectors'
import {setSidebarIsLoading, error} from './common'
import {normalizeMessage} from './utils'

export function updateMessageSearchQuery(nextQuery) {
  return (dispatch, getState) => {
    const prevQuery = messageSearchSelector(getState()).query.join(' ')

    if (nextQuery === prevQuery) return dispatch({type: types.NOOP})

    dispatch({
      type: types.UPDATE_MESSAGE_SEARCH_QUERY,
      payload: {
        query: nextQuery ? nextQuery.split(' ') : [],
        items: [],
        total: null
      }
    })
  }
}

export function toggleSearchOnlyInChannel() {
  return {
    type: types.TOGGLE_SEARCH_ONLY_IN_CHANNEL
  }
}

const minQueryLength = 2

export function searchMessages(params) {
  return (dispatch, getState) => {
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

    const state = getState()
    const {limit, offsetDate, searchOnlyInChannel} = params

    const searchParams = {
      query,
      limit,
      offsetDate: offsetDate ? offsetDate.toISOString() : undefined
    }

    const {id: orgId} = orgSelector(state)
    if (searchOnlyInChannel) {
      searchParams.orgId = orgId
      searchParams.channelId = channelSelector(state).id
    } else {
      searchParams.id = orgId
    }

    api[`searchMessages${searchOnlyInChannel ? 'InChannel' : ''}`](searchParams)
      .then(messages => {
        dispatch(setSidebarIsLoading(false))
        const messageSearch = messageSearchSelector(state)
        const prevItems = messageSearch.items
        const nextItems = messages.results.map(msg =>normalizeMessage(msg, state))
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
