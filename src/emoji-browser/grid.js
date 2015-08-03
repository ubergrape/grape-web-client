import findIndex from 'lodash/array/findIndex'
import find from 'lodash/collection/find'

/**
 * Get item from sections.
 */
export function getItem(sections, dir, length = 10) {
  if (dir === 'next' || dir === 'prev') {
    return findHorizontalItem(sections, length, dir)
  }

  if (dir === 'nextRow' || dir === 'prevRow') {
    return findVerticalItem(sections, length, dir.substr(0, 4))
  }
}

/**
 * Find a next or prev item when moving horizontally on the grid.
 *
 * Edge cases are:
 * - We are already on the last item of the current row, we need to move to the
 * first item of the same row.
 * - We are on the first item of the current row, we need to move to the last one.
 * - Row is not full.
 */
function findHorizontalItem(sections, length, dir) {
  let section = getCurrentSection(sections)
  let {items} = section
  let index = findIndex(section.items, item => item.focused)
  let row = Math.floor(index / length)
  let shift = index - row * length

  if (dir === 'next') {
    if (items[index + 1] && shift + 1 < length) index++
    else index = index - shift
  }
  else {
    if (items[index - 1] && shift) index--
    else if (items[index + length - 1]) index = index + length - 1
    else index = items.length - 1
  }

  return items[index]
}

/**
 * Find a next or prev item when moving vertically on the grid.
 *
 * Edge cases are:
 * - We are already on the last row of the current section, we need to
 * move to the next section.
 * - We are on the last row of the last section, we need to move to the
 * first section.
 * - Next row has no item at current position shift, we need to go to the
 * next row until we find one.
 */
function findVerticalItem(sections, length, dir) {
  let currSection = getCurrentSection(sections)
  let currIndex = findIndex(currSection.items, item => item.focused)
  let currRow = Math.floor(currIndex / length)
  let shift = currIndex - currRow * length
  let nextRow = currRow + (dir === 'next' ? 1 : -1)

  function findItem() {
    let nextIndex = nextRow * length + shift
    let item = currSection.items[nextIndex]

    if (item) return item

    if (dir === 'next') {
      let rowsAmount = getRowsAmount(currSection, length)
      // Last row of the current section.
      if (nextRow > rowsAmount - 1) {
        nextRow = 0
        currSection = getNextSection(sections, currSection)
      }
      else nextRow++
    }
    else {
      // First row of the current section.
      if (nextRow < 0) {
        currSection = getPrevSection(sections, currSection)
        let rowsAmount = getRowsAmount(currSection, length)
        nextRow = rowsAmount - 1
      } else nextRow--
    }

    return findItem()
  }

  return findItem()
}

function getCurrentSection(sections) {
  return find(sections, section => {
    return section.items.some(item => item.focused)
  })
}

function getNextSection(sections, current) {
  let index = findIndex(sections, section => section.id === current.id)
  let next = sections[index + 1]
  return next ? next : sections[0]
}

function getPrevSection(sections, current) {
  let index = findIndex(sections, section => section.id === current.id)
  let prev = sections[index - 1]
  return prev ? prev : sections[sections.length - 1]
}

function getRowsAmount(section, length) {
  return Math.ceil(section.items.length / length)
}
