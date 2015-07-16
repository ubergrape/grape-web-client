import find from 'lodash/collection/find'
import * as dataUtils from '../browser/dataUtils'

export let {getFocusedItem} = dataUtils
export let {setFocusedItem} = dataUtils
export let {unsetFocusedItem} = dataUtils
export let {extractItems} = dataUtils
export let {setSelectedTab} = dataUtils

let {warn} = console
warn = warn.bind(console)

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
 *       name: '1. Tagging+GitHub.mp4',
 *       info: '/UberGrape/ChatGrape/...',
 *       date: ...
 *     }
 *   ]
 * }
 */
export let getSections = (() => {
  function get(data, serviceId, limitPerSection = Infinity) {
    let sections = []
    let newData = addFilterObjects({...data})

    // Group by sections.
    newData.results.forEach(result => {
      if (serviceId && result.service !== serviceId) return

      let section = findById(sections, result.service)
      let service = findById(newData.services, result.service)

      if (!service) {
        warn('No service corresponding the item.', result)
        return
      }

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

      if (serviceId ||
        section.items.length < limitPerSection ||
        result.service === 'filters') {
        if (!result.detail) result.detail = {}
        result.detail.iconUrl = service.icon_url
        section.items.push({
          id: result.id,
          type: result.type,
          name: result.name,
          info: result.container,
          date: result.start,
          focused: false,
          icon: serviceIconMap[result.service],
          detail: result.detail,
          search: newData.search.text
        })
      }
    })

    // Select first result of the first section.
    if (sections[0] && sections[0].items[0]) sections[0].items[0].focused = true

    return sections
  }

  /**
   * Generate data for queries section.
   */
  function addFilterObjects(data) {
    let queries = data.search.queries

    if (!queries.length) return data

    // Add fake service.
    let service = {
      hidden: true,
      count: queries.length,
      id: 'filters',
      key: 'filters',
      label: 'Queries'
    }

    let results = queries.map(query => {
      return {
        id: query.id,
        name: `Search ${query.name}`,
        type: service.id,
        container: `#${query.query}`,
        service: service.id
      }
    })

    data.services = [service, ...data.services]
    data.results = [...results, ...data.results]

    return data
  }

  return get
}())

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
    let next = findById(sections, id)
    if (next) next.selected = true
  }
}

/**
 * Mark an item as focused. Unmark previously focused one.
 */
export function setFocusedItemAt(sections, id, index) {
  if (!sections.length) return
  unsetFocusedItem(sections)
  // Take first id when nothing passed.
  let section = findById(sections, id || sections[0].id)
  if (section) section.items[index].focused = true
}

/**
 * Get data for tabs representation.
 */
export function getTabs(items = [], serviceId) {
  if (!items.length) return items

  let visibleItems = items.filter(item => !item.hidden && item.count !== undefined)

  let tabs = visibleItems.map(item => {
    return {
      label: item.label,
      amount: item.count,
      id: item.id,
      selected: serviceId === item.id
    }
  })

  let total = 0
  tabs.forEach(tab => total += (tab.amount || 0))

  tabs.unshift({
    label: 'All',
    amount: total,
    selected: !serviceId
  })

  return tabs
}

function findById(collection, id) {
  return find(collection, item => item.id === id)
}
