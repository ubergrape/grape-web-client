import findIndex from 'lodash/findIndex'
import find from 'lodash/find'

function getCurrentSection(sections) {
  return find(sections, section => section.items.some(item => item.focused))
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
  const section = getCurrentSection(sections)
  const { items } = section
  let index = findIndex(section.items, item => item.focused)
  const row = Math.floor(index / length)
  const shift = index - row * length

  if (dir === 'next') {
    if (items[index + 1] && shift + 1 < length) index++
    else index -= shift
  } else {
    if (items[index - 1] && shift) index--
    else if (items[index + length - 1]) index = index + length - 1
    else index = items.length - 1
  }

  return items[index]
}

function getRowsAmount(section, length) {
  return Math.ceil(section.items.length / length)
}

function getNextSection(sections, current) {
  const index = findIndex(sections, section => section.id === current.id)
  const next = sections[index + 1]
  return next || sections[0]
}

function getPrevSection(sections, current) {
  const index = findIndex(sections, section => section.id === current.id)
  const prev = sections[index - 1]
  return prev || sections[sections.length - 1]
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
  const currIndex = findIndex(currSection.items, item => item.focused)
  const currRow = Math.floor(currIndex / length)
  const shift = currIndex - currRow * length
  let nextRow = currRow + (dir === 'next' ? 1 : -1)

  function findItem() {
    const nextIndex = nextRow * length + shift
    const item = currSection.items[nextIndex]

    if (item) return item

    if (dir === 'next') {
      const rowsAmount = getRowsAmount(currSection, length)
      // Last row of the current section.
      if (nextRow > rowsAmount - 1) {
        nextRow = 0
        currSection = getNextSection(sections, currSection)
      } else nextRow++
    } else {
      // First row of the current section.
      if (nextRow < 0) {
        currSection = getPrevSection(sections, currSection)
        const rowsAmount = getRowsAmount(currSection, length)
        nextRow = rowsAmount - 1
      } else nextRow--
    }

    return findItem()
  }

  return findItem()
}

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
