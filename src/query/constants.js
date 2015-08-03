export const TRIGGERS = ['#', ':', '@']

export const SEPARATOR = ':'

export const TYPES = {
  search: '#',
  user: '@',
  room: '@',
  emoji: ':'
}

// Match everything after a whitespace followed by any trigger until you match
// another whitespace followed by any trigger or end of text.
export const REGEX = /(?:^|\s)([#:@])/
