import startsWith from 'lodash/string/startsWith'
import {defaultRank as emojiDefaultRank} from 'grape-browser/lib/emoji'

/**
 * Returns rank based on match `key sub-string` and each `value string`.
 */
export default function getRank(type, key, ...values) {
  let rank = 0
  // TODO: move defaultRanks emoji assignment into `grape-browser`
  if (!key) return type === 'emoji' ? emojiDefaultRank(values[0]) : rank

  const lKey = key.toLowerCase()
  values.some(value => {
    const lValue = value.toLowerCase()
    if (lValue === lKey) {
      rank = 2
      return true
    }
    if (startsWith(lValue, lKey)) {
      rank = 1
      return true
    }
  })

  return rank
}
