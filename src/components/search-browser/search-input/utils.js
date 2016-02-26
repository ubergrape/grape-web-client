/**
 * Remove filters and trim words.
 */
export function getTextWithoutFilters(split, tokens) {
  return split
    .filter(str => tokens[str] === undefined)
    .map(word => word.trim())
    .join(' ')
    .trim()
}

export function getFilterIds(split, tokens) {
  return split.reduce((filters, part) => {
    if (tokens[part]) filters.push(tokens[part].id)
    return filters
  }, [])
}
