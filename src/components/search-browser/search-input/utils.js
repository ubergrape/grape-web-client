export function getTextWithoutFilters(split, tokens) {
  // Remove filters
  let textArr = split.filter(str => tokens[str] === undefined)
  // Remove unneeded spaces.
  textArr = textArr.map(word => word.trim())
  return textArr.join(' ').trim()
}

export function getFilterIds(split, tokens) {
  return split.reduce((filters, part) => {
    if (tokens[part]) filters.push(tokens[part].id)
    return filters
  }, [])
}
