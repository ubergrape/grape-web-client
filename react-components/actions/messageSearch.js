import sortBy from 'lodash/collection/sortBy'

import store from '../app/store'
import reduxEmitter from '../redux-emitter'
import * as types from '../constants/actionTypes'
import rpc from '../backend/rpc'
import {messageSearchSelector, orgSelector} from '../selectors'
import {setSidebarIsLoading} from './common'
import {formatSidebarMessage} from './utils'

export function showMessageSearch() {
  reduxEmitter.showSidebar()
  return {
    type: types.SHOW_MESSAGE_SEARCH,
    payload: {
      show: true
    }
  }
}

export function hideMessageSearch() {
  reduxEmitter.hideSidebar()
  return {
    type: types.HIDE_MESSAGE_SEARCH,
    payload: {
      show: false,
      items: []
    }
  }
}

export function updateMessageSearchQuery(query) {
  return {
    type: types.UPDATE_MESSAGE_SEARCH_QUERY,
    payload: {
      query
    }
  }
}

const minQueryLength = 2

export function searchMessages(params) {
  return dispatch => {
    if (params.query.length < minQueryLength) {
      return dispatch({
        type: types.FOUND_MESSAGES,
        payload: {
          total: null,
          items: []
        }
      })
    }
    dispatch({type: types.SEARCH_MESSAGES})
    dispatch(setSidebarIsLoading(true))
    const state = store.getState()
    const org = orgSelector(state)
    rpc({
      ns: 'search',
      action: 'search',
      args: [
        params.query,
        org.id,
        'messages',
        params.limit,
        params.offsetDate ? params.offsetDate.toISOString() : undefined
      ]
    }, {camelize: true}, (err, res) => {
      if (err) reduxEmitter.showError(err)
      dispatch(setSidebarIsLoading(false))
      const messageSearch = messageSearchSelector(state)
      const prevItems = messageSearch.items
      const nextItems = res.results.map(formatSidebarMessage)
      dispatch({
        type: types.FOUND_MESSAGES,
        payload: {
          // Only a query without offset delivers overall total amount.
          total: params.offsetDate ? messageSearch.total : res.total,
          items: [...prevItems, ...nextItems]
        }
      })
    })
  }
}
