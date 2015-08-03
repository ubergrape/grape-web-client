import find from 'lodash/collection/find'
import isEmpty from 'lodash/lang/isEmpty'
import get from 'lodash/object/get'

/**
 * Get service object by id.
 */
export function findServiceById(id, data) {
  return find(data.services, service => service.id === id)
}

/**
 * Returns true if search is external.
 */
export function isExternalSearch(data) {
  return get(data, 'search.type') === 'external'
}

/**
 * Returns true if autocomplete can be shown.
 */
export function canSuggest(prevState = {}, nextState) {
  let {query, disabled, data} = nextState

  if (!nextState.type || disabled) return false

  let isClosed = prevState.type == null
  let isSearch = nextState.type === 'search'
  let noResults = !data || isEmpty(data.results)
  let hasSearch = query && query.search.length > 0
  let closedBySpace = hasSearch && query.search[query.search.length - 1] === ' '

  if (isClosed && isSearch && noResults && hasSearch) return false

  if (isSearch && noResults && closedBySpace) return false

  return true
}

/**
 * Get service id from the data using service key.
 */
export function detectService(queryObj, data) {
  let key = get(queryObj, 'filters[0]')
  if (!key) return ''
  let service = find(data.services, item => item.key === key)
  if (service) return service.id
}
