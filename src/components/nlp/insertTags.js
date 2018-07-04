import tags from './tags'
import sortBy from 'lodash/collection/sortBy'

const insert = (text, start, end, marker) => {
  const before = text.substring(0, start)
  const selection = text.substring(start, end)
  const after = text.substr(end)
  return before + marker + selection + marker + after
}

export default function insertTags(text, data) {
  let offset = 0
  let res = text
  sortBy(data, 'textStart').forEach(({textStart, textEnd}, i) => {
    const tag = tags[i]
    res = insert(res, textStart + offset, textEnd + offset, tag)
    offset += tag.length * 2
  })
  return res
}
