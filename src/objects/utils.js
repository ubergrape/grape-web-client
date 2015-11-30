export function getLabel(type) {
  switch (type) {
    case 'user':
    case 'room':
      return '@'
    case 'search':
    case 'file':
    case 'event':
      return '#'
    default:
      return ''
  }
}
