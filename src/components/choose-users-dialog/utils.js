function filterUserByValue(value, {username, displayName}) {
  const lowerCaseValue = value.toLowerCase()
  return username.toLowerCase().indexOf(lowerCaseValue) >= 0 ||
    displayName.toLowerCase().indexOf(lowerCaseValue) >= 0
}

function sortUserByValue(value, {username, displayName}) {
  const lowerCaseValue = value.toLowerCase()
  if (
    username.toLowerCase().startsWith(lowerCaseValue) ||
    displayName.toLowerCase().startsWith(lowerCaseValue)
  ) {
    return -1
  }
  return 1
}

export function getFilteredUsers({users, filter}) {
  if (!filter) return users
  return users
    .filter(filterUserByValue.bind(null, filter))
    .sort(sortUserByValue.bind(null, filter))
}
