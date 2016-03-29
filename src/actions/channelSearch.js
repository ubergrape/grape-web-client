import page from 'page'
import * as types from '../constants/actionTypes'

import sortBy from 'lodash/collection/sortBy'
import pick from 'lodash/object/pick'


// TODO: move not related to action creators functions to the selector
/**
 * Simple version of fuzzy search.
 * When searching it ignores:
 *   - non alpha numeric characters
 *   - whitespaces
 */
function fuzzySearch(searchStr) {
  const alphaRegExp = /\W|\s/g

  function fuzzify(str) {
    return str.toLowerCase().replace(alphaRegExp, '')
  }

  const fuzzySearchStr = fuzzify(searchStr)

  return function indexOf(key) {
    return fuzzify(key).indexOf(fuzzySearchStr)
  }
}

function find(data, search) {
  if (!search) return sortBy(data, item => item.name.toLowerCase())
  const fuzzyIndexOf = fuzzySearch(search)
  let items = data.map(item => {
    return {
      item,
      index: fuzzyIndexOf(item.name)
    }
  })
  items = items.filter(({index}) => index >= 0)
  items = sortBy(items, 'index')
  items = items.map(({item}) => item)
  return items
}

function filterItem(items, user) {
  return items.filter(({id, type}) => {
    if (type === 'user' && id === user.id) return false
    return true
  })
}

function getItems(org) {
  let users = org.users.filter(({active}) => active)
  users = users.map(({id, slug, displayName, avatar}) => {
    return {
      id,
      slug,
      type: 'user',
      name: displayName,
      iconUrl: avatar
    }
  })
  let rooms = org.rooms.filter(({joined}) => joined)
  rooms = rooms.map(room => {
    const item = pick(room, 'id', 'name', 'slug', 'color', 'abbr')
    item.type = 'room'
    return item
  })
  return [...users, ...rooms]
}

function getFilteredItems(org, user) {
  return filterItem(
    getItems(org),
    user
  )
}

export function showChannelSearch(org, user) {
  const items = find(getFilteredItems(org, user))
  return {
    type: types.SHOW_CHANNEL_SEARCH,
    payload: {
      show: true,
      items,
      focusedItem: items[0]
    }
  }
}

export function hideChannelSearch() {
  return {
    type: types.HIDE_CHANNEL_SEARCH,
    payload: {
      show: false,
      search: ''
    }
  }
}

export function inputChannelSearch(search, org, user) {
  const items = find(getFilteredItems(org, user), search)
  return {
    type: types.INPUT_CHANNEL_SEARCH,
    payload: {
      search,
      items,
      focusedItem: items[0]
    }
  }
}

export function selectChannelSearchItem(channel) {
  return dispatch => {
    dispatch(hideChannelSearch())
    dispatch({
      type: types.SELECT_CHANNEL_SEARCH_ITEM,
      payload: {
        channel
      }
    })
    page('/chat/' + channel.slug)
  }
}

export function focusChannelSearchItem(focusedItem) {
  return {
    type: types.FOCUS_CHANNEL_SEARCH_ITEM,
    payload: {
      focusedItem
    }
  }
}
