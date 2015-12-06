import sortBy from 'lodash/collection/sortBy'

import store from '../app/store'
import reduxEmitter from '../redux-emitter'
import * as types from '../constants/actionTypes'
import rpc from '../backend/rpc'
import {userSelector, orgSelector, mentionsSelector} from '../selectors'
import {setSidebarIsLoading} from './common'
import {formatSidebarMessage} from './utils'

export function showMentions() {
  const user = userSelector(store.getState())
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
      show: true,
      items: []
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
        params.only,
        params.limit,
        params.offsetDate
      ]
    }, {camelize: true}, (err, res) => {
      if (err) reduxEmitter.showError(err)
      dispatch(setSidebarIsLoading(false))
      dispatch({
        type: types.LOADED_MENTIONS,
        payload: {
          offsetTotal: res.total,
          offsetDate: params.offsetDate,
          items: res.results.map(data => {
            return formatSidebarMessage(data.message)
          })
        }
      })
    })
  }
}

export function addMention(message) {
  const state = mentionsSelector(store.getState())
  let items = [...state.items, formatSidebarMessage(message)]

  // Ensure the right order because we pushed a message from pubsub.
  items = sortBy(items, item => item.time * -1)

  return {
    type: types.ADDED_MENTION,
    payload: {
      items
    }
  }
}
