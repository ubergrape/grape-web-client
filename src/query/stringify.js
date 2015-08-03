import isEmpty from 'lodash/lang/isEmpty'
import {SEPARATOR} from './constants'

/**
 * Convert query obj to query string.
 */
export default function stringify(query) {
  let filters = ''
  if (!isEmpty(query.filters)) filters = query.filters.join(SEPARATOR) + SEPARATOR

  return (query.trigger || '') + filters + (query.search || '')
}
