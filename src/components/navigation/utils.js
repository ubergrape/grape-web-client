import sortBy from 'lodash/collection/sortBy'

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

export function find(data, search) {
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
