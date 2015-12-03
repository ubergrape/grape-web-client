export function getLabel(type) {
  switch (type) {
    case 'user':
    case 'room':
      return '@'
    default:
      return '#'
  }
}
