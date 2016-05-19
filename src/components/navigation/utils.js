import sortBy from 'lodash/collection/sortBy'
import fuzzySearch from 'fuzzysearch'

function fuzzyIndexOf(rawSearch, rawString) {
  const string = rawString.toLowerCase().replace(/\s/g, '')
  const search = rawSearch.toLowerCase()
  if (!fuzzySearch(search, string)) return -1
  return string.indexOf(search)
}

export function find(data, search) {
  let items = data.map(item => {
    const index = fuzzyIndexOf(search, item.name)
    return {
      item,
      index
    }
  })
  items = items.filter(({index}) => index >= 0)
  items = sortBy(items, 'index')
  items = items.map(({item}) => item)
  return items
}
