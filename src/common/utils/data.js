'use strict'

import find from 'lodash-es/collection/find'

// Service/icon map.
// TODO it should be a service implementation detail.
var serviceIconMap = {
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
  var sections = []

  // Group by sections.
  data.results.forEach(function (result) {
    var section = findService(sections, result.service)

    // We have no section for this service yet.
    if (!section) {
      var service = findService(data.services, result.service)
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
      selected: false
    })
  })

  // Select first result of the first section.
  sections[0].results[0].selected = true

  // Find service within in the original results structure or within
  // sections structure for smartcomplete (id == service).
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
  var curr = getSelectedSection(sections)
  if (curr) curr.selected = false
  if (service) {
    var next = find(sections, section => section.service == service)
    next.selected = true
  }
}

/**
 * Get currently selected results object.
 */
export function getSelectedObject(sections) {
  var ret

  sections.some(function (section) {
    var selected = find(section.results, object => object.selected)
    if (selected) {
      ret = selected
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
  var objects = []
  sections.forEach(section => objects = objects.concat(section.results))
  return objects
}

/**
 * Mark a result as selected. Unmark previously selected one.
 */
export function setSelectedObjectAt(sections, service, index) {
  unsetSelectedObject(sections)
  var section = find(sections, section => section.service == service)
  section.results[index].selected = true
}

/**
 * Mark a result as selected. Unmark previously selected one.
 */
export function setSelectedObject(sections, id) {
  unsetSelectedObject(sections)
  getObjectById(sections, id).selected = true
}

/**
 * Mark currently selected object as not selected.
 */
function unsetSelectedObject(sections) {
  var prev = getSelectedObject(sections)
  if (prev) prev.selected = false
}

/**
 * Get object by id.
 */
function getObjectById(sections, id) {
  var ret

  sections.some(function (section) {
    var obj = find(section.results, object => object.id == id)
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
  var data = sections.map(function (section) {
    return {
      label: section.label,
      amount: section.results.length,
      selected: section.selected,
      service: section.service
    }
  })

  var amount = 0
  sections.forEach(function (section) {
    amount += section.results.length
  })

  var hasSelected = Boolean(getSelectedSection(sections))

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
