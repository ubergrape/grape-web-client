import sortBy from 'lodash/collection/sortBy'

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
