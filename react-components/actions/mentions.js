import sortBy from 'lodash/collection/sortBy'

import store from '../app/store'
import reduxEmitter from '../redux-emitter'
import * as types from '../constants/actionTypes'
import rpc from '../backend/rpc'
import {
  userSelector,
  orgSelector,
  mentionsSelector
} from '../selectors'
import {setSidebarIsLoading} from './common'
import {formatSidebarMessage} from './utils'

export function showMentions() {
  const state = store.getState()
  const user = userSelector(state)
  reduxEmitter.showSidebar()
  return {
    type: types.SHOW_MENTIONS,
    payload: {
      show: true,
      query: user.displayName
    }
  }
}

export function hideMentions() {
  reduxEmitter.hideSidebar()
  return {
    type: types.HIDE_MENTIONS,
    payload: {
      show: false,
      items: [],
      total: null
    }
  }
}

export function loadMentions(params) {
  return dispatch => {
    dispatch({type: types.LOAD_MENTIONS})
    dispatch(setSidebarIsLoading(true))
    const org = orgSelector(store.getState())
    rpc({
      ns: 'search',
      action: 'get_mentions',
      args: [
        org.id,
        'user',
        params.limit,
        params.offsetDate
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
      const prevItems = mentionsSelector(store.getState()).items
      const nextItems = res.results.map(data => {
        return formatSidebarMessage(data.message)
      })
      dispatch({
        type: types.LOADED_MENTIONS,
        payload: {
          total: res.total,
          items: [...prevItems, ...nextItems]
        }
      })
    })
  }
}

export function addMention(message) {
  const mentions = mentionsSelector(store.getState())
  let items = [...mentions.items, formatSidebarMessage(message)]

  // Sort all items descenting because we loose the right order when a message
  // comes from pubsub.
  items = sortBy(items, item => item.time * -1)

  return {
    type: types.ADD_MENTION,
    payload: {
      items,
      total: mentions.total + 1
    }
  }
}

export function removeMention(messageId) {
  const mentions = mentionsSelector(store.getState())
  const {items} = mentions
  const cleanedItems = items.filter(({id}) => id !== messageId)

  // Nothing to remove.
  if (cleanedItems.length === items.length) {
    return {type: types.NOOP}
  }

  return {
    type: types.REMOVE_MENTION,
    payload: {
      items: cleanedItems,
      total: mentions.total - 1
    }
  }
}
