import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {
  messageSearchSelector,
  orgSelector,
  channelSelector,
} from '../selectors'
import { normalizeMessage, doesMessageChannelExist } from './utils'
import { setSidebarIsLoading, error } from './'

export function updateMessageSearchQuery(nextQuery) {
  return (dispatch, getState) => {
    const prevQuery = messageSearchSelector(getState()).query.join(' ')

    if (nextQuery === prevQuery) return

    dispatch({
      type: types.UPDATE_MESSAGE_SEARCH_QUERY,
      payload: {
        query: nextQuery ? nextQuery.split(' ') : [],
        items: [],
        total: null,
      },
    })
  }
}

const minQueryLength = 2

export function searchMessages(params) {
  return (dispatch, getState) => {
    const query = params.query.join(' ')

    if (query.length < minQueryLength) {
      dispatch({
        type: types.FOUND_MESSAGES,
        payload: {
          items: [],
          total: null,
        },
      })
      return
    }

    dispatch({ type: types.SEARCH_MESSAGES })
    dispatch(setSidebarIsLoading(true))

    const state = getState()
    const {
      limit,
      offsetDate,
      options: { currentChannelOnly, searchActivities },
    } = params

    const searchParams = {
      query,
      limit,
      offsetDate: offsetDate || undefined,
      types: ['messages', searchActivities && 'activities'],
    }

    const { id: orgId } = orgSelector(state)
    if (currentChannelOnly) {
      searchParams.orgId = orgId
      searchParams.channelId = channelSelector(state).id
    } else {
      searchParams.id = orgId
    }

    api[`searchMessages${currentChannelOnly ? 'InChannel' : ''}`](searchParams)
      .then(messages => {
        dispatch(setSidebarIsLoading(false))
        const messageSearch = messageSearchSelector(state)
        const prevItems = messageSearch.items
        const nextItems = messages.results
          .filter(msg => doesMessageChannelExist(msg, state))
          .map(msg => normalizeMessage(msg, state))

        dispatch({
          type: types.FOUND_MESSAGES,
          payload: {
            items: [...prevItems, ...nextItems],
            // Only a query without offset delivers overall total amount.
            total: params.offsetDate ? messageSearch.total : messages.total,
          },
        })
      })
      .catch(err => {
        dispatch(setSidebarIsLoading(false))
        dispatch(error(err))
      })
  }
}
