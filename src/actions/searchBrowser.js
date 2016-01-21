import find from 'lodash/collection/find'
import findIndex from 'lodash/array/findIndex'
import {openUrl} from 'grape-web/lib/x-platform'

import * as types from '../constants/actionTypes'
import {searchBrowserSelector} from '../selectors'
import {
  getFocusedItem,
  setFocusedItem,
  unsetFocusedItem,
  extractItems,
  findById,
  getItemById,
  setSelectedTab
} from '../components/browser/dataUtils'

// Trick the linter to not to warn about console usage.
let {warn} = console
warn = warn.bind(console)

// Service/icon map.
// TODO it should be a service implementation detail.
const serviceIconMap = {
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
 *       name: '1. Tagging+GitHub.mp414',
 *       info: '/UberGrape/ChatGrape/...',
 *       date: ...
 *     }
 *   ]
 * }
 */
const getSections = (() => {
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
}())

/**
 * Get a section which is currently selected.
 */
function getSelectedSection(sections) {
  return find(sections, section => section.selected)
}

/**
 * Mark section as selected. Unmark previously selected one.
 */
function setSelectedSection(sections, id) {
  const curr = getSelectedSection(sections)
  if (curr) curr.selected = false
  if (id) {
    const next = findById(sections, id)
    if (next) next.selected = true
  }
}

/**
 * Mark an item as focused. Unmark previously focused one.
 */
function setFocusedItemAt(sections, id, index) {
  if (!sections.length) return
  unsetFocusedItem(sections)
  // Take first id when nothing passed.
  const section = findById(sections, id || sections[0].id)
  if (section) section.items[index].focused = true
}

/**
 * Get data for tabs representation.
 */
function getTabs(items = [], serviceId) {
  if (!items.length) return items

  const visibleItems = items.filter(item => !item.hidden && item.count !== undefined)

  const tabs = visibleItems.map(item => {
    return {
      label: item.label,
      amount: item.count,
      id: item.id,
      selected: serviceId === item.id
    }
  })

  const total = tabs.reduce((counter, tab) => counter + (tab.amount || 0), 0)

  tabs.unshift({
    label: 'All',
    amount: total,
    selected: !serviceId
  })

  return tabs
}

/**
 * Get service id from the data using filters array.
 */
function filtersToServiceId({services = []}, filters = []) {
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
function findIndexBySelector(selector, list, validation) {
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

/**
 * Returns a new state with focused item according selector.
 */
function focusItem(selector, state) {
  const {sections} = state
  let id = selector

  if (selector === 'next' || selector === 'prev') {
    const selectedSection = getSelectedSection(sections)
    const items = selectedSection ? selectedSection.items : extractItems(sections)
    const itemIndex = findIndexBySelector(selector, items, item => item.focused)
    id = items[itemIndex].id
  }

  setFocusedItem(sections, id)

  return {
    sections,
    focusedItem: getFocusedItem(sections)
  }
}

/**
 * Select tab.
 *
 * @param {String} selector can be tab id or "prev" or "next"
 */
function selectTab(selector, state) {
  const {tabs} = state
  const tabIndex = findIndexBySelector(selector, tabs, tab => tab.selected)
  const {id} = tabs[tabIndex]

  setSelectedTab(tabs, tabIndex)
  const sections = getSections(
    state.data,
    id,
    state.maxItemsPerSectionInAll
  )
  setSelectedSection(sections, id)
  setFocusedItemAt(sections, id, 0)

  const service = findById(state.data.services, id)
  const filters = service ? [service.key] : []
  const focusedItem = getFocusedItem(sections)

  return {
    tabs,
    sections,
    filters,
    focusedItem
  }
}

function focusAction(selector, state) {
  const {actions} = state
  const newIndex = findIndexBySelector(selector, actions, action => action === state.focusedAction)
  return {focusedAction: state.actions[newIndex]}
}

function execAction(state) {
  const action = state.focusedAction
  const item = state.focusedItem

  if (action.type === 'insert') {
    state.onSelectItem({item})
    return {
      filters: [],
      search: ''
    }
  }

  if (action.type === 'open') {
    const res = find(state.data.results, ({id}) => id === item.id)
    // TODO make it MacGap compatible.
    openUrl(res.url)
  }

  return state
}

function navigate(action, state) {
  switch (action) {
    case 'select':
      if (state.focusedItem.type === 'filters') return state
      if (state.focusedList === 'actions') return execAction(state)
      return {focusedList: 'actions'}
    case 'back':
      if (state.focusedList === 'objects') return state
      return {focusedList: 'objects'}
    case 'prev':
    case 'next':
      if (state.focusedList === 'objects') {
        return focusItem(action, state)
      }
      if (state.focusedList === 'actions') {
        return focusAction(action, state)
      }
      break
    default:
  }
}

function createState(nextProps, prevState) {
  const {data} = nextProps

  if (!data) {
    return {
      ...nextProps,
      sections: [],
      tabs: [],
      focusedItem: undefined
    }
  }

  let serviceId
  if (prevState.filters) {
    serviceId = filtersToServiceId(data, prevState.filters)
  }

  let sections = getSections(
    data,
    serviceId,
    nextProps.maxItemsPerSectionInAll
  )

  const selectedSection = getSelectedSection(sections)
  if (selectedSection) sections = [selectedSection]

  const tabs = getTabs(data.services, serviceId)

  const focusedItem = getFocusedItem(sections)

  return {...nextProps, sections, tabs, focusedItem}
}

export function createSearchBrowserState(props) {
  return (dispatch, getState) => {
    const state = searchBrowserSelector(getState())

    dispatch({
      type: types.CREATE_SEARCH_BROWSER_STATE,
      payload: createState(props, state)
    })
  }
}

export function resetSearchBrowserState() {
  return {
    type: types.RESET_SEARCH_BROWSER_STATE
  }
}

export function focusSearchBrowserItem(selector) {
  return (dispatch, getState) => {
    const state = searchBrowserSelector(getState())

    dispatch({
      type: types.FOCUS_SEARCH_BROWSER_ITEM,
      payload: focusItem(selector, state)
    })
  }
}

export function focusSearchBrowserAction(action) {
  return {
    type: types.FOCUS_SEARCH_BROWSER_ACTION,
    payload: {
      focusedAction: action,
      hoveredAction: action
    }
  }
}

export function blurSearchBrowserAction() {
  return {
    type: types.BLUR_SEARCH_BROWSER_ACTION,
    payload: {
      hoveredAction: null
    }
  }
}

export function execSearchBrowserAction() {
  return (dispatch, getState) => {
    const state = searchBrowserSelector(getState())
    dispatch({
      type: types.EXEC_SEARCH_BROWSER_ACTION,
      payload: execAction(state)
    })
  }
}

export function setSearchBrowserFilters(filters) {
  return {
    type: types.SET_SEARCH_BROWSER_FILTERS,
    payload: {
      filters,
      search: ''
    }
  }
}

export function selectSearchBrowserItem(id) {
  return (dispatch, getState) => {
    const state = searchBrowserSelector(getState())
    const item = id ? getItemById(state.sections, id) : getFocusedItem(state.sections)

    if (item.type === 'filters') {
      const service = findById(state.data.services, item.id)
      const filters = service ? [service.key] : []
      dispatch(setSearchBrowserFilters(filters))
      return
    }

    dispatch({
      type: types.SELECT_SEARCH_BROWSER_ITEM,
      payload: {
        focusedItem: item
      }
    })
  }
}

export function selectSearchBrowserTab(selector) {
  return (dispatch, getState) => {
    const state = searchBrowserSelector(getState())
    dispatch({
      type: types.SELECT_SEARCH_BROWSER_TAB,
      payload: selectTab(selector, state)
    })
  }
}

export function navigateSearchBrowser(action) {
  return (dispatch, getState) => {
    const state = searchBrowserSelector(getState())
    dispatch({
      type: types.NAVIGATE_SEARCH_BROWSER,
      payload: navigate(action, state)
    })
  }
}

export function inputSearchBrowserSearch(query) {
  return (dispatch, getState) => {
    const state = searchBrowserSelector(getState())
    dispatch({
      type: types.INPUT_SEARCH_BROWSER_SEARCH,
      payload: {
        search: query.search,
        filters: query.filters
      }
    })
    state.onInput(query)
  }
}
