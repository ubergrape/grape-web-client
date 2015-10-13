export function getItems(data, search) {
  if (!search) return data
  let lowerSearch = search.toLowerCase()
  return data.filter(item => item.name.toLowerCase().indexOf(lowerSearch) >= 0)
}
