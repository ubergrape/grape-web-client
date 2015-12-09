import sortBy from 'lodash/collection/sortBy'
import pluck from 'lodash/collection/pluck'
import compact from 'lodash/array/compact'

import store from '../app/store'
import reduxEmitter from '../redux-emitter'
import * as types from '../constants/actionTypes'
import rpc from '../backend/rpc'
import {
  userSelector,
  orgSelector,
  mentionsSelector,
  channelsSelector
} from '../selectors'
import {setSidebarIsLoading} from './common'
import {formatSidebarMessage} from './utils'

export function showMentions() {
  const state = store.getState()
  const user = userSelector(state)
  const channels = channelsSelector(state)
  const channelsNames = compact(pluck(channels, 'name'))
  reduxEmitter.showSidebar()
  return {
    type: types.SHOW_MENTIONS,
    payload: {
      show: true,
      query: [user.displayName, ...channelsNames]
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
        params.only,
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
  const state = mentionsSelector(store.getState())
  let items = [...state.items, formatSidebarMessage(message)]

  // Sort all items descenting because we loose the right order when a message
  // comes from pubsub.
  items = sortBy(items, item => item.time * -1)

  return {
    type: types.ADDED_MENTION,
    payload: {
      items
    }
  }
}
