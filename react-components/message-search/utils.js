import each from 'lodash/collection/each'
import groupBy from 'lodash/collection/groupBy'
import moment from 'moment'

/**
 * Group messages by day and channel.
 */
export function group(messages) {
  // Group by day.
  const grouped = groupBy(messages, message => {
    return moment(message.time).startOf('day').toISOString()
  })

  // Gropuby channel.
  each(grouped, (_messages, time) => {
    grouped[time] = groupBy(_messages, 'channel')
  })

  return grouped
}
