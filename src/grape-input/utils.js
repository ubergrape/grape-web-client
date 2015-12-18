import isEmpty from 'lodash/lang/isEmpty'
import get from 'lodash/object/get'
import {SEARCH_TRIGGER} from '../query/constants'

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
  const {query, data} = nextState

  if (!nextState.browser) return false

  if (nextState.isLoading) return true

  const isClosed = !prevState.browser
  const isSearch = nextState.browser === 'search'
  const noResults = !data || isEmpty(data.results)
  const hasSearch = query && query.search.length > 0
  const closedBySpace = hasSearch && query.search[query.search.length - 1] === ' '

  if (isClosed && noResults && hasSearch) return false

  if (isSearch && noResults && closedBySpace) return false

  return true
}

/**
 * Returns true if type will be rendered using grape-browser.
 */
export function isBrowserType(typeOrTrigger) {
  return typeOrTrigger === SEARCH_TRIGGER ||
    typeOrTrigger === 'search'
}
