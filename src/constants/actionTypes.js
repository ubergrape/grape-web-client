const types = [
  'NOOP',
  'FOCUS_SEARCH_BROWSER_ITEM',
  'CREATE_SEARCH_BROWSER_STATE',
  'SELECT_SEARCH_BROWSER_ITEM',
  'SELECT_SEARCH_BROWSER_TAB',
  'SET_SEARCH_BROWSER_FILTERS',
  'NAVIGATE_SEARCH_BROWSER'
]

export default types.reduce((map, type) => {
  map[type] = type
  return map
}, {})
