import find from 'lodash-es/collection/find'

/**
 * Get all items from all sections.
 */
export function extractItems(sections) {
  let items = []
  sections.forEach(section => items = items.concat(section.items))
  return items
}

/**
 * Get item by id.
 */
function getItemById(sections, id) {
  let ret

  sections.some(section => {
    let obj = find(section.items, item => item.id == id)
    if (obj) {
      ret = obj
      return true
    }
    return false
  })

  return ret
}

/**
 * Get currently focused item.
 */
export function getFocusedItem(sections) {
  let item

  sections.some(section => {
    item = find(section.items, item => item.focused)
    return Boolean(item)
  })

  return item
}

/**
 * Mark a item as focused. Unmark previously focused one.
 */
export function setFocusedItem(sections, id) {
  unsetFocusedItem(sections)
  getItemById(sections, id).focused = true
}


/**
 * Mark currently focused item as not focused.
 */
export function unsetFocusedItem(sections) {
  sections.forEach(section => {
    section.items.forEach(item => item.focused = false)
  })
}

/**
 * Mark a tab at specified index as selected, unmark previously selected one.
 */
export function setSelectedTab(tabs, index) {
  tabs.forEach(tab => tab.selected = false)
  tabs[index].selected = true
}
