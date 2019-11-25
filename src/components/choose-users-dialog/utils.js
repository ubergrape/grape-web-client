function filterUserByValue(value, { username, displayName }) {
  const lowerCaseValue = value.toLowerCase()
  return (
    username.toLowerCase().includes(lowerCaseValue) ||
    displayName.toLowerCase().includes(lowerCaseValue)
  )
}

function sortUserByValue(value, { username, displayName }) {
  const lowerCaseValue = value.toLowerCase()
  if (
    username.toLowerCase().startsWith(lowerCaseValue) ||
    displayName.toLowerCase().startsWith(lowerCaseValue)
  ) {
    return -1
  }
  return 1
}

/**
 * Sort users list by the last pm message time.
 */
function sortUserByPm(a, b) {
  // Put `invited only` users at the end of the list.
  if (a.isOnlyInvited) return 1
  if (b.isOnlyInvited) return -1

  if (a.pm) {
    if (!b.pm) return -1
    return b.latestMessageTime - a.latestMessageTime
  }
  if (b.pm) {
    if (!a.pm) return 1
    return a.latestMessageTime - b.latestMessageTime
  }
  return 0
}

export function getFilteredUsers({ users, filter }) {
  if (!filter) return users.sort(sortUserByPm)

  return users
    .filter(filterUserByValue.bind(null, filter))
    .sort(sortUserByValue.bind(null, filter))
}
