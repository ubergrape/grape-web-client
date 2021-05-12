import escapeRegExp from 'lodash/escapeRegExp'

/**
 * Find matches of search in text.
 * TODO once this logic moved to the server, we can remove this code
 * https://github.com/ubergrape/chatgrape/issues/2412
 */
export default function findMatches(text, search) {
  const searchArr = typeof search == 'string' ? [search] : search
  const lowerSearchArr = searchArr.map(value => value.toLowerCase())
  const searchRegExpStr = searchArr
    .map(searchStr => `(${escapeRegExp(searchStr)})`)
    .join('|')
  const regExp = new RegExp(`\\b${searchRegExpStr}\\b`, 'gi')

  return text.split(regExp).reduce((matches, value) => {
    if (!value) return matches
    const found = lowerSearchArr.indexOf(value.toLowerCase()) !== -1
    matches.push({
      text: value,
      found,
    })
    return matches
  }, [])
}
