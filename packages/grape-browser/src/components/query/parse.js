import { QUERY_REGEX } from './constants'

/**
 * Get search object from a query string.
 *
 * Query string format:
 *   {trigger}{search}
 *
 * Query object format:
 * {
 *    query: String, // original query string
 *    trigger: String, // trigger char (#:@)
 *    search: String // search keywords
 * }
 *
 * Example
 *
 * `parse('#giphy:something')`
 *
 * Returns:
 * ```
 * {
 *   query: '#something',
 *   trigger: '#',
 *   search: 'something'
 * }
 * ```
 */
export default function parse(str) {
  const query = str && str.match(QUERY_REGEX) ? str.trim() : ''
  const trigger = query[0]
  const search = query.substr(1)
  return { query, trigger, search }
}
