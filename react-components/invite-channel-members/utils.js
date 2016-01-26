export function filterUserByValue(value, {username, displayName}) {
  return username.toLowerCase().includes(value) ||
    displayName.toLowerCase().includes(value)
}

export function sortUserByValue(value, {username, displayName}) {
  if (
    username.toLowerCase().startsWith(value) ||
    displayName.toLowerCase().startsWith(value)
  ) {
    return -1
  }
  return 1
}

