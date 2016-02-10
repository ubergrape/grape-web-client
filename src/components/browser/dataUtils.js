import find from 'lodash/collection/find'

/**
 * Get all items from all sections.
 */
export function extractItems(sections) {
  let items = []
  sections.forEach(section => items = items.concat(section.items))
  return items
}

function getItem(sections, fn) {
  let item

  sections.some(section => {
    item = find(section.items, fn)
    return Boolean(item)
  })

  return item
}

export function findById(collection, id) {
  return find(collection, item => item.id === id)
}

/**
 * Get item by id.
 */
export function getItemById(sections, id) {
  return getItem(sections, item => item.id === id)
}

/**
 * Get currently focused item.
 */
export function getFocusedItem(sections) {
  return getItem(sections, item => item.focused)
}

/**
 * Mark currently focused item as not focused.
 */
export function unsetFocusedItem(sections) {
  sections.forEach(section => {
    section.items.forEach(item => item.focused = false)
  })
}

/**
 * Mark a item as focused. Unmark previously focused one.
 */
export function setFocusedItem(sections, id) {
  unsetFocusedItem(sections)
  const item = getItemById(sections, id)
  item.focused = true
}
