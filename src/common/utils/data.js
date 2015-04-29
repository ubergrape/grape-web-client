import find from 'lodash-es/collection/find'

// Service/icon map.
// TODO it should be a service implementation detail.
let serviceIconMap = {
  github: 'github',
  googledrive: 'file',
  gcal: 'calendar',
  trello: 'trello',
  dropbox: 'dropbox',
  grapeQuery: 'search'
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
export function getSections (data, serviceId, limitPerSection = Infinity) {
  let sections = []

  if (!data) return sections

  sections.push(getQueriesSection(data.services))

  // Group by sections.
  data.results.forEach(function (result) {
    if (serviceId && result.service != serviceId) return

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

    if (section.results.length < limitPerSection) {
      section.results.push({
        id: result.id,
        type: result.type,
        highlighted: result.highlighted,
        info: result.container,
        date: result.start,
        focused: false,
        detail: result.detail
      })
    }
  })

  // Select first result of the first section.
  if (sections[0]) sections[0].results[0].focused = true

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
 * Generate data for queries section.
 */
function getQueriesSection(services) {
  let section = {
    label: 'Queries',
    service: 'grapeQuery',
    icon: serviceIconMap['grapeQuery'],
    selected: false
  }

  section.results = services.map(service => {
    return {
      id: service.id,
      service: service.id,
      type: section.service,
      highlighted: service.label,
      info: '#' + service.key,
      focused: false
    }
  })

  return section
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
    if (next) next.selected = true
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
  if (!sections.length) return
  // Take first service when nothing passed.
  if (!service) service = sections[0].service
  unsetFocusedObject(sections)
  let section = find(sections, section => section.service == service)
  if (section) section.results[index].focused = true
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
export function getTabs(services, sections, selectedServiceId) {
  if (!services.length) return []

  let tabs = services.map(function (service) {
    return {
      label: service.label,
      amount: service.count,
      service: service.id,
      selected: selectedServiceId == service.id
    }
  })

  let total = 0
  tabs.forEach(tab => total += tab.amount)

  tabs.unshift({
    label: 'All',
    amount: total,
    selected: !selectedServiceId
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
