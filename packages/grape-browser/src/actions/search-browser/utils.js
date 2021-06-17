import findIndex from 'lodash/findIndex'
import find from 'lodash/find'
import groupBy from 'lodash/groupBy'
import reduce from 'lodash/reduce'

const warn = console.warn.bind(console) // eslint-disable-line no-console

/**
 * Format results for presentation.
 * Group results by service.
 * Insert group header items.
 */
export function formatGroupedResults({ results, services, search }) {
  // We need to display them grouped by service.
  const groupedResults = groupBy(results, 'service')

  return reduce(
    groupedResults,
    (newResults, groupResults, serviceId) => {
      const service = find(services, { id: serviceId })

      // Soetimes we get results without a corresponding service,
      // filter them and warn.
      if (!service) {
        warn('No service for results', groupResults)
        return newResults
      }

      // Section header.
      newResults.push({
        id: `header-${serviceId}`,
        type: 'header',
        label: service.label,
        resultsAmount: service.count,
      })

      // Build new result items.
      const newGroupResults = groupResults.map(result => ({
        id: result.id,
        type: result.type,
        name: result.name,
        info: result.container,
        date: result.start,
        focused: false,
        service: result.service,
        detail: result.detail || {},
        search: search.text,
        url: result.url,
      }))

      return newResults.concat(newGroupResults)
    },
    [],
  )
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

export function selectResult(selector, { results, focusedResult }) {
  if (typeof selector !== 'string') return selector

  const dataResults = results.filter(({ type }) => type !== 'header')
  const nextIndex = findIndexBySelector(
    selector,
    dataResults,
    result => result === focusedResult,
  )

  return dataResults[nextIndex]
}
