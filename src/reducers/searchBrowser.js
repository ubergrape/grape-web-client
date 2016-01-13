import find from 'lodash/collection/find'
import findIndex from 'lodash/array/findIndex'
import noop from 'lodash/utility/noop'

import * as types from '../constants/actionTypes'
import {
  getFocusedItem,
  setFocusedItem,
  unsetFocusedItem,
  extractItems,
  findById,
  setSelectedTab
} from '../components/browser/dataUtils'

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
 *       name: '1. Tagging+GitHub.mp4',
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

  let total = 0
  tabs.forEach(tab => total += (tab.amount || 0))

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
 * Returns a new state with focused item according selector.
 */
function focusItem(selector, state) {
  const {sections} = state
  let id = selector

  if (selector === 'next' || selector === 'prev') {
    const selectedSection = getSelectedSection(sections)
    const items = selectedSection ? selectedSection.items : extractItems(sections)
    const focusedIndex = findIndex(items, item => item.focused)
    let newItem

    if (selector === 'next') {
      newItem = items[focusedIndex + 1]
      if (!newItem) newItem = items[0]
    } else if (selector === 'prev') {
      newItem = items[focusedIndex - 1]
      if (!newItem) newItem = items[items.length - 1]
    }

    id = newItem.id
  }

  setFocusedItem(sections, id)

  return {
    ...state,
    sections,
    focusedItem: getFocusedItem(sections)
  }
}

function createState(nextProps, prevState) {
  const {data} = nextProps

  const inputDelay = nextProps.isExternal ? nextProps.externalServicesInputDelay : undefined

  if (!data) {
    return {
      ...prevState,
      ...nextProps,
      sections: [],
      tabs: [],
      inputDelay,
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

  return {...prevState, ...nextProps, sections, tabs, inputDelay, focusedItem}
}

/**
 * Select tab.
 *
 * @param {String} selector can be tab id or "prev" or "next"
 */
function selectTab(selector, state) {
  const {tabs} = state
  const currIndex = findIndex(tabs, tab => tab.selected)
  let newIndex

  if (selector === 'next') {
    newIndex = currIndex + 1
    if (!tabs[newIndex]) newIndex = 0
  } else if (selector === 'prev') {
    newIndex = currIndex - 1
    if (newIndex < 0) newIndex = tabs.length - 1
  } else {
    newIndex = findIndex(tabs, tab => tab.id === selector)
  }

  const {id} = tabs[newIndex]
  setSelectedTab(tabs, newIndex)
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
    ...state,
    tabs,
    sections,
    filters,
    focusedItem
  }
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

function focusAction(selector, state) {
  const {actions} = state
  const newIndex = findIndexBySelector(selector, actions, action => action === state.focusedAction)
  return {...state, focusedAction: state.actions[newIndex]}
}

function execAction(state) {
  const action = state.focusedAction
  const item = state.focusedItem

  if (action.type === 'insert') {
    state.onSelectItem({item})
    return {
      ...state,
      filters: [],
      search: ''
    }
  }

  if (action.type === 'open') {
    const res = find(state.data.results, ({id}) => id === item.id)
    // TODO make it MacGap compatible.
    window.open(res.url)
  }

  return state
}

function navigate(action, state) {
  switch (action) {
    case 'select':
      if (state.focusedItem.type === 'filters') return state
      if (state.focusedList === 'actions') return execAction(state)
      return {...state, focusedList: 'actions'}
    case 'back':
      if (state.focusedList === 'objects') return state
      return {...state, focusedList: 'objects'}
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

const actions = [
  {
    type: 'insert',
    text: 'Insert into message',
    icon: 'comment'
  },
  {
    type: 'open',
    text: 'Open',
    icon: 'iconLink'
  }
]

const initialState = {
  height: 400,
  className: '',
  maxItemsPerSectionInAll: 5,
  isExternal: false,
  isLoading: false,
  canAddIntegrations: false,
  externalServicesInputDelay: 500,
  focusedList: 'objects',
  actions,
  focusedAction: actions[0],
  onAddIntegration: noop,
  onSelectItem: noop,
  onSelectFilter: noop,
  onDidMount: noop,
  onChange: noop,
  onAbort: noop,
  onBlur: noop
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_SEARCH_BROWSER_STATE:
      return createState(action.payload.props, state)
    case types.FOCUS_SEARCH_BROWSER_ITEM:
      return focusItem(action.payload.selector, state)
    case types.FOCUS_SEARCH_BROWSER_ACTION:
      return {...state, focusedAction: action.payload.action}
    case types.EXEC_SEARCH_BROWSER_ACTION:
      return execAction(state)
    case types.SELECT_SEARCH_BROWSER_TAB:
      return selectTab(action.payload.selector, state)
    case types.NAVIGATE_SEARCH_BROWSER:
      return navigate(action.payload.action, state)
    case types.SET_SEARCH_BROWSER_FILTERS:
    case types.SELECT_SEARCH_BROWSER_ITEM:
      return {...state, ...action.payload}
    default:
      return state
  }
}
