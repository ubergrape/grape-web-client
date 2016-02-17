import findIndex from 'lodash/array/findIndex'

import {findById} from '../../components/browser/dataUtils'

const warn = console.warn.bind(console) // eslint-disable-line no-console

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
export function getSections(data) {
  const sections = []

  // Group by sections.
  data.results.forEach(result => {
    let section = findById(sections, result.service)
    const service = findById(data.services, result.service)

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

    if (!result.detail) result.detail = {}
    // FIXME should be iconUrl
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
      search: data.search.text
    })
  })

  // Select first result of the first section.
  if (sections[0] && sections[0].items[0]) sections[0].items[0].focused = true

  return sections
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

export function getTextWithoutFilters(split, tokens) {
  // Remove filters
  let textArr = split.filter(str => tokens[str] === undefined)
  // Remove unneeded spaces.
  textArr = textArr.map(word => word.trim())
  return textArr.join(' ').trim()
}

export function getFilterIds(split, tokens) {
  return split.reduce((filters, part) => {
    if (tokens[part]) filters.push(tokens[part].id)
    return filters
  }, [])
}
