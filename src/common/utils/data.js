import find from 'lodash-es/collection/find'

// Service/icon map.
// TODO it should be a service implementation detail.
let serviceIconMap = {
  github: 'github',
  googledrive: 'file',
  gcal: 'calendar'
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
export function getSections (data) {
  let sections = []

  if (!data) return sections

  // Group by sections.
  data.results.forEach(function (result) {
    let section = findService(sections, result.service)

    // We have no section for this service yet.
    if (!section) {
      let service = findService(data.services, result.service)
      section = {
        label: service.label,
        service: result.service,
        results: [],
        icon: serviceIconMap[result.service],
        selected: false
      }
      sections.push(section)
    }

    section.results.push({
      id: result.id,
      type: result.type,
      highlighted: result.highlighted,
      info: result.container,
      date: result.start,
      focused: false
    })
  })

  // Select first result of the first section.
  sections[0].results[0].focused = true

  // Find service within in the original results structure or within
  // sections structure (id == service).
  function findService(services, id) {
    return find(services, function (service) {
      return service.id == id || service.service == id
    })
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
export function setSelectedSection(sections, service) {
  let curr = getSelectedSection(sections)
  if (curr) curr.selected = false
  if (service) {
    let next = find(sections, section => section.service == service)
    next.selected = true
  }
}

/**
 * Get currently focused results object.
 */
export function getFocusedObject(sections) {
  let ret

  sections.some(function (section) {
    let focused = find(section.results, object => object.focused)
    if (focused) {
      ret = focused
      return true
    }
    return false
  })

  return ret
}

/**
 * Get all objects from all sections.
 */
export function getObjects(sections) {
  let objects = []
  sections.forEach(section => objects = objects.concat(section.results))
  return objects
}

/**
 * Mark a result as focused. Unmark previously focused one.
 */
export function setFocusedObjectAt(sections, service, index) {
  unsetFocusedObject(sections)
  let section = find(sections, section => section.service == service)
  section.results[index].focused = true
}

/**
 * Mark a result as focused. Unmark previously focused one.
 */
export function setFocusedObject(sections, id) {
  unsetFocusedObject(sections)
  getObjectById(sections, id).focused = true
}

/**
 * Mark currently focused object as not focused.
 */
function unsetFocusedObject(sections) {
  let prev = getFocusedObject(sections)
  if (prev) prev.focused = false
}

/**
 * Get object by id.
 */
function getObjectById(sections, id) {
  let ret

  sections.some(function (section) {
    let obj = find(section.results, object => object.id == id)
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
export function getTabs(sections) {
  if (!sections.length) return []

  let data = sections.map(function (section) {
    return {
      label: section.label,
      amount: section.results.length,
      selected: section.selected,
      service: section.service
    }
  })

  let amount = 0
  sections.forEach(function (section) {
    amount += section.results.length
  })

  let hasSelected = Boolean(getSelectedSection(sections))

  data.unshift({
    label: 'All',
    amount: amount,
    selected: !hasSelected
  })

  return data
}

/**
 * Mark a tab at specified index as selected, unmark previously selected one.
 */
export function setSelectedTab(tabs, index) {
  tabs.forEach(tab => tab.selected = false)
  tabs[index].selected = true
}
