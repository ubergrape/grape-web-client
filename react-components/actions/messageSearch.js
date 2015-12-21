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
      items: [],
      total: null
    }
  }
}

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
    const org = orgSelector(state)

    rpc({
      ns: 'search',
      action: 'search',
      args: [
        query,
        org.id,
        'messages',
        params.limit,
        params.offsetDate ? params.offsetDate.toISOString() : undefined
      ]
    }, {camelize: true}, (err, res) => {
      dispatch(setSidebarIsLoading(false))
      if (err) {
        reduxEmitter.showError(err)
        dispatch({
          type: types.ERROR,
          payload: {
            err
          }
        })
        return
      }
      const messageSearch = messageSearchSelector(state)
      const prevItems = messageSearch.items
      const nextItems = res.results.map(formatSidebarMessage)
      dispatch({
        type: types.FOUND_MESSAGES,
        payload: {
          items: [...prevItems, ...nextItems],
          // Only a query without offset delivers overall total amount.
          total: params.offsetDate ? messageSearch.total : res.total
        }
      })
    })
  }
}
