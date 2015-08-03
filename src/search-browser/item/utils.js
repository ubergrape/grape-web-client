import find from 'lodash/collection/find'
import isEmpty from 'lodash/lang/isEmpty'

/**
 * Find state meta.
 */
export function getState(detail) {
  if (!detail || isEmpty(detail.meta)) return ''
  let state = find(detail.meta, meta => meta.label === 'State')
  if (state) return state.value
}

/**
 * Find matches of search in text.
 * TODO once this logic moved to the server, we can remove this code
 * https://github.com/ubergrape/chatgrape/issues/2412
 */
export function findMatches(text, search) {
  let lowerText = text.toLowerCase()
  let lowerSearch = search.toLowerCase()
  let parts = lowerText.split(lowerSearch)
  let matches = []
  if (parts.length === 1) return matches

  let index = 0
  parts.forEach(part => {
    let match = text.substr(index, part.length)

    if (match) {
      matches.push({
        text: match,
        found: false
      })
      index += match.length
    }

    match = text.substr(index, search.length)

    if (match) {
      matches.push({
        text: match,
        found: true
      })
      index += search.length
    }
  })

  return matches
}
