import sortBy from 'lodash/collection/sortBy'
import pick from 'lodash/object/pick'

export function find(data, search) {
  if (!search) {
    return sortBy(data, item => {
      return item.name.toLowerCase()
    })
  }
  let fuzzyIndexOf = fuzzySearch(search)
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

export function getFileteredItems(org, user) {
  return filterItem(
    getItems(org),
    user
  )
}

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
    let item = pick(room, 'id', 'name', 'slug', 'color', 'abbr')
    item.type = 'room'
    return item
  })
  return [...users, ...rooms]
}

function filterItem(items, user) {
  return items.filter(({id}) => id !== user.id)
}

