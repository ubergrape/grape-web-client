import sortBy from 'lodash/collection/sortBy'

import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {
  orgSelector,
  mentionsSelector
} from '../selectors'

import {setSidebarIsLoading, error} from './common'
import {normalizeMessage} from './utils'

export function loadMentions(params) {
  return (dispatch, getState) => {
    dispatch({type: types.LOAD_MENTIONS})
    dispatch(setSidebarIsLoading(true))
    const state = getState()
    const {id} = orgSelector(state)
    const {offsetDate, options: {shouldReplace}} = params
    return api
      .getMentions({...params, offsetDate: shouldReplace ? undefined : offsetDate, id})
      .then(({results, total}) => {
        dispatch(setSidebarIsLoading(false))
        const {items: prevItems} = mentionsSelector(state)
        const nextItems = results.map(data => normalizeMessage(data.message, state))
        const items = shouldReplace ? nextItems : [...prevItems, ...nextItems]
        return dispatch({
          type: types.LOADED_MENTIONS,
          payload: {
            total,
            items
          }
        })
      })
      .catch(err => {
        dispatch(setSidebarIsLoading(false))
        dispatch(error(err))
      })
  }
}

export function addMention(message) {
  return (dispatch, getState) => {
    const {items: mentions, total, showRoomMentions} = mentionsSelector(getState())
    if (!showRoomMentions && !message.mentions.user) return
    let items = [...mentions, message]

    // Sort all items descenting because we loose the right order when a message
    // comes from pubsub.
    items = sortBy(items, item => item.time * -1)

    dispatch({
      type: types.ADD_MENTION,
      payload: {
        items,
        total: total + 1
      }
    })
  }
}

export function removeMention(messageId) {
  return (dispatch, getState) => {
    const mentions = mentionsSelector(getState())
    const {items} = mentions
    const cleanedItems = items.filter(({id}) => id !== messageId)

    // Nothing to remove.
    if (cleanedItems.length === items.length) {
      return dispatch({type: types.NOOP})
    }

    dispatch({
      type: types.REMOVE_MENTION,
      payload: {
        items: cleanedItems,
        total: mentions.total - 1
      }
    })
  }
}

export function toggleShowRoomMentions() {
  return {
    type: types.TOGGLE_SHOW_ROOM_MENTION
  }
}
