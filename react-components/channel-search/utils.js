import sortBy from 'lodash/collection/sortBy'

export function getItems(data, search) {
  if (!search) return sortBy(data, 'name')
  let lowerSearch = search.toLowerCase()
  let items = data.map(item => {
    return {
      item,
      index: item.name.toLowerCase().indexOf(lowerSearch)
    }
  })

  items = items.filter(({index}) => index >= 0)
  items = sortBy(items, 'index')
  items = items.map(({item}) => item)
  return items
}
