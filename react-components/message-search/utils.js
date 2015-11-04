import each from 'lodash/collection/each'
import groupBy from 'lodash/collection/groupBy'
import moment from 'moment'

/**
 * Group messages by day and channel.
 */
export function group(messages) {
  // Group by day.
  const grouped = groupBy(messages, message => {
    return moment(message.time).startOf('day')
  })

  // Gropuby channel.
  each(grouped, (_messages, time) => {
    grouped[time] = groupBy(_messages, 'channel')
  })

  return grouped
}

/**
 * Find matches of search in text.
 * TODO once this logic moved to the server, we can remove this code
 * https://github.com/ubergrape/chatgrape/issues/2412
 */
export function findMatches(text, search) {
  const lowerText = text.toLowerCase()
  const lowerSearch = search.toLowerCase()
  const parts = lowerText.split(lowerSearch)
  const matches = []
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
