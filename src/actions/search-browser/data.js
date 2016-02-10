import find from 'lodash/collection/find'
import findIndex from 'lodash/array/findIndex'

import {findById} from '../../components/browser/dataUtils'

// Trick the linter to not to warn about console usage.
let {warn} = console
warn = warn.bind(console)

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
 *       name: '1. Tagging+GitHub.mp414',
 *       info: '/UberGrape/ChatGrape/...',
 *       date: ...
 *     }
 *   ]
 * }
 */
export const getSections = (() => {
  /**
   * Generate data for queries section.
   */
  function addFilterObjects(data) {
    const {queries} = data.search

    if (!queries.length) return data

    // Add fake service.
    const service = {
      hidden: true,
      count: queries.length,
      id: 'filters',
      key: 'filters',
      label: 'Queries'
    }

    const results = queries.map(query => {
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

  return function get(data, serviceId, limitPerSection = Infinity) {
    const sections = []
    const newData = addFilterObjects({...data})

    // Group by sections.
    newData.results.forEach(result => {
      if (serviceId && result.service !== serviceId) return

      let section = findById(sections, result.service)
      const service = findById(newData.services, result.service)

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
        if (service.icon_url) result.detail.iconUrl = service.icon_url
        section.items.push({
          id: result.id,
          type: result.type,
          name: result.name,
          info: result.container,
          date: result.start,
          focused: false,
          service: result.service,
          detail: result.detail,
          search: newData.search.text
        })
      }
    })

    // Select first result of the first section.
    if (sections[0] && sections[0].items[0]) sections[0].items[0].focused = true

    return sections
  }
}())

/**
 * Get service id from the data using filters array.
 */
export function filtersToServiceId({services = []}, filters = []) {
  if (filters[0]) {
    const service = find(services, ({key}) => key === filters[0])
    if (service) return service.id
  }
  return ''
}

/**
 * Finds an element index in a list by selector "prev" or "next".
 * If selector goes to the undefined position, first or last element will be selected.
 */
export function findIndexBySelector(selector, list, validation) {
  const currIndex = findIndex(list, validation)
  let index

  if (selector === 'next') {
    index = list[currIndex + 1] ? currIndex + 1 : 0
  }

  if (selector === 'prev') {
    index = list[currIndex - 1] ? currIndex - 1 : list.length - 1
  }

  return index
}
