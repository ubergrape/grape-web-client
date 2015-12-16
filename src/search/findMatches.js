/**
 * Find matches of search in text.
 * TODO once this logic moved to the server, we can remove this code
 * https://github.com/ubergrape/chatgrape/issues/2412
 */
export default function findMatches(text, search) {
  const words = text.toLowerCase().split(/\b/)
  const searchArr = typeof search == 'string' ? [search] : search
  const lowerSearchArr = searchArr.map(str => str.toLowerCase())
  return words.map(word => {
    return {
      text: word,
      found: lowerSearchArr.indexOf(word) !== -1
    }
  })
}
