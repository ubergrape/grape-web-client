import trimLeft from 'lodash/string/trimLeft'
import {TRIGGERS, SEPARATOR} from './constants'

/**
 * Get search object from a query string.
 *
 * Query string format:
 *   {trigger}{filter1}:{filter...}:{keywords}
 *
 * Query object format:
 * {
 *    query: String, // original query string
 *    key: String, // filters + keywords
 *    trigger: String, // trigger char (#:@)
 *    filters: [Array], // filters array
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
 *   query: '#giphy:something',
 *   key: giphy:somethig,
 *   trigger: '#',
 *   filters: ['giphy'],
 *   search: 'something'
 * }
 * ```
 */
export default function parse(query) {
  let triggerIndex = TRIGGERS.indexOf(query[0])
  let trigger = TRIGGERS[triggerIndex]
  let key = query.substr(1)
  let filters = key.split(SEPARATOR)
  let search = filters.pop()
  // We can trim filters, right?
  filters = filters.map(filter => filter.trim())
  search = trimLeft(search)

  return {
    query: query,
    key: key,
    trigger: trigger,
    filters: filters,
    search: search
  }
}
