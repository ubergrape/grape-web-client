import startsWith from 'lodash/string/startsWith'

/**
 * Returns rank based on match `key sub-string` and each `value string`.
 */
export default function getRank(type, key, ...values) {
  let rank = 0

  if (!key) return rank

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
