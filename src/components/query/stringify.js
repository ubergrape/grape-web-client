/**
 * Convert query obj to query string.
 */
export default function stringify(query) {
  return (query.trigger || '') + (query.search || '')
}
