import find from 'lodash-es/collection/find'

// Service/icon map.
// TODO it should be a service implementation detail.
let serviceIconMap = {
  github: 'github',
  googledrive: 'file',
  gcal: 'calendar',
  trello: 'trello',
  dropbox: 'dropbox',
  filters: 'search'
}

/**
 * Get sections based data structure.
 *
 * {
 *   label: 'Google drive',
 *   service: 'googledrive',
 *   icon: 'file',
 *   results: [
 *     {
 *       id: '10',
 *       type: 'file',
 *       highlighted: '1. Tagging+<b>GitHub.mp4</b>',
 *       info: '/UberGrape/ChatGrape/...',
 *       date: ...
 *     }
 *   ]
 * }
 */
export function getSections(data, serviceId, limitPerSection = Infinity) {
  let sections = []

  if (!data || !data.results) return sections

  // Group by sections.
  data.results.forEach(result => {
    if (serviceId && result.service != serviceId) return

    let section = findService(sections, result.service)
    let service = findService(data.services, result.service)

    if (!service) return console.warn('No service corresponding item.', result)

    // We have no section for this service yet.
    if (!section) {
      section = {
        id: result.service,
        label: service.label,
        items: [],
        selected: false
      }
      sections.push(section)
    }

    if (section.items.length < limitPerSection) {
      result.detail || (result.detail = {})
      result.detail.iconUrl = service.icon_url
      section.items.push({
        id: result.id,
        type: result.type,
        highlighted: result.highlighted,
        info: result.container,
        date: result.start,
        focused: false,
        icon: serviceIconMap[result.service],
        detail: result.detail
      })
    }
  })

  // Select first result of the first section.
  if (sections[0] && sections[0].items[0]) sections[0].items[0].focused = true

  // Find service within in the original results structure or within
  // sections structure.
  function findService(services, id) {
    return find(services, service => service.id == id)
  }

  return sections
}

/**
 * Get a section which is currently selected.
 */
export function getSelectedSection(sections) {
  return find(sections, section => section.selected)
}

/**
 * Mark section as selected. Unmark previously selected one.
 */
export function setSelectedSection(sections, id) {
  let curr = getSelectedSection(sections)
  if (curr) curr.selected = false
  if (id) {
    let next = find(sections, section => section.id == id)
    if (next) next.selected = true
  }
}

/**
 * Get currently focused item.
 */
export function getFocusedItem(sections) {
  let ret

  sections.some(section => {
    let focused = find(section.items, item => item.focused)
    if (focused) {
      ret = focused
      return true
    }
    return false
  })

  return ret
}

/**
 * Get all items from all sections.
 */
export function extractItems(sections) {
  let items = []
  sections.forEach(section => items = items.concat(section.items))
  return items
}

/**
 * Mark an item as focused. Unmark previously focused one.
 */
export function setFocusedItemAt(sections, id, index) {
  if (!sections.length) return
  // Take first id when nothing passed.
  if (!id) id = sections[0].id
  unsetFocusedItem(sections)
  let section = find(sections, section => section.id == id)
  if (section) section.items[index].focused = true
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
function unsetFocusedItem(sections) {
  let prev = getFocusedItem(sections)
  if (prev) prev.focused = false
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
 * Get data for tabs representation.
 */
export function getTabs(items = [], selectedId) {
  if (!items.length) return items

  items = items.filter(item => !item.hidden)

  let tabs = items.map(item => {
    return {
      label: item.label,
      amount: item.count,
      id: item.id,
      selected: selectedId == item.id
    }
  })

  let total = 0
  tabs.forEach(tab => total += (tab.amount || 0))

  tabs.unshift({
    label: 'All',
    amount: total,
    selected: !selectedId
  })

  return tabs
}

/**
 * Mark a tab at specified index as selected, unmark previously selected one.
 */
export function setSelectedTab(tabs, index) {
  tabs.forEach(tab => tab.selected = false)
  tabs[index].selected = true
}
