import each from 'lodash/collection/each'
import groupBy from 'lodash/collection/groupBy'
import moment from 'moment'

/**
 * Group messages by day and channel.
 */
export function group(messages) {
  // Group by day.
  const grouped = groupBy(messages, message => {
    return moment(message.time).startOf('day')
  })

  // Gropuby channel.
  each(grouped, (messages, time) => {
    grouped[time] = groupBy(messages, 'channel')
  })

  return grouped
}
