import isEmpty from 'lodash/lang/isEmpty'
import get from 'lodash/object/get'

/**
 * Returns true if search is external.
 */
export function isExternalSearch(data) {
  return get(data, 'search.type') === 'external'
}

/**
 * Returns true if browser can be shown.
 */
export function canShowBrowser(prevState = {}, nextState) {
  const {query, data, browser} = nextState

  if (!nextState.browser) return false

  if (nextState.isLoading) return true

  const isClosed = !prevState.browser
  const isSearch = browser === 'search'
  const noResults = !data || isEmpty(data.results)
  const hasSearch = query && query.search.length > 0
  const closedBySpace = hasSearch && query.search[query.search.length - 1] === ' '

  const isDataList = browser === 'emojiSuggest' || browser === 'user'
  if (isDataList && isEmpty(data)) return false

  if (isClosed && noResults && hasSearch) return false

  if (isSearch && noResults && closedBySpace) return false

  return true
}
