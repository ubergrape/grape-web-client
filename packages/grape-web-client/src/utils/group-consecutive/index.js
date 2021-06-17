/**
 * Given an array this util groups `groupsSize` consecutive items
 * when `iteratee`'s return value is truthy.
 * `iteratee` is invoked with two arguments: the current and next item.
 */

export default (items, groupsSize, iteratee) => {
  let isGroupStart = true
  let shouldGroup = false
  let group = []

  return items.reduce((result, item, index, array) => {
    if (isGroupStart) {
      group.push(item)
      isGroupStart = false
    }

    shouldGroup =
      index < items.length - 1 &&
      group.length < groupsSize &&
      !!iteratee(item, array[index + 1])

    if (shouldGroup) {
      group.push(array[index + 1])
    } else {
      result.push(group)
      group = []
      isGroupStart = true
    }

    return result
  }, [])
}
