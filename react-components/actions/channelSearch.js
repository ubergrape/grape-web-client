import reduxEmitter from '../redux-emitter'
import page from 'page'
import * as types from '../constants/actionTypes'

import sortBy from 'lodash/collection/sortBy'
import pick from 'lodash/object/pick'

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
  if (!search) {
    return sortBy(data, item => {
      return item.name.toLowerCase()
    })
  }
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
  return items.filter(({id}) => id !== user.id)
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
  return {
    type: types.SHOW_CHANNEL_SEARCH,
    payload: {
      show: true,
      items: getFilteredItems(org, user)
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
  return {
    type: types.INPUT_CHANNEL_SEARCH,
    payload: {
      search,
      items: find(getFilteredItems(org, user), search)
    }
  }
}

export function selectChannelSearch(channel) {
  page('/chat/' + channel.slug)
  return dispatch => dispatch(hideChannelSearch())
}

export function showRoomManager() {
  reduxEmitter.showRoomManager()
  return dispatch => {
    dispatch(hideChannelSearch())
  }
}
