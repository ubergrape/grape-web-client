/**
 * Return hardcoded rank for some emoji
 */
export function defaultRank(value) {
  switch (value) {
    case 'thumbsup':
      return 6
    case 'smile':
      return 5
    case 'wink':
      return 4
    case 'disappointed':
      return 3
    case 'cry':
      return 2
    case 'point_up':
      return 1
    default:
      return 0
  }
}

/**
 * Sort emoji list by rank and length
 */
export function sortByRankAndLength(data) {
  const ranked = data.map(item => {
    item.rank = defaultRank(item.name)
    return item
  })

  return ranked.sort((a, b) => {
    const aRank = a.rank
    const bRank = b.rank
    if (aRank > bRank) return -1
    if (bRank > aRank) return 1
    if (aRank === bRank) {
      const aLength = a.name.length
      const bLength = b.name.length
      if (aLength < bLength) return -1
      if (bLength < aLength) return 1
      return 0
    }
  })
}
