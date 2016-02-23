import noop from 'lodash/utility/noop'
import uniq from 'lodash/array/uniq'
import get from 'lodash/object/get'

import * as types from '../constants/actionTypes'

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
  isExternal: false,
  isLoading: false,
  focusedList: 'objects',
  // Entire input value including filters.
  value: '',
  // Only user input without filters.
  search: '',
  filters: [],
  sections: [],
  actions,
  focusedAction: actions[0],
  tokens: {},
  allServices: [],
  services: [],
  onAddIntegration: noop,
  onSelectItem: noop,
  onDidMount: noop,
  onChange: noop,
  onAbort: noop,
  onBlur: noop,
  clearSearchBrowserInput: noop
}

function getServices({allServices, filters}, search) {
  let services = allServices.filter(({id}) => filters.indexOf(id) === -1)

  if (search) {
    const lowerSearch = search.toLowerCase().trim()
    services = services.filter(({label}) => label.toLowerCase().indexOf(lowerSearch) >= 0)
  }

  return services
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_SEARCH_BROWSER_STATE: {
      let {allServices} = state
      const services = get(action, 'payload.data.services')
      // We aggregate services across multiple requests, because we don't have
      // a separate api for services.
      // TODO https://github.com/ubergrape/chatgrape/issues/3394
      if (services) allServices = uniq([...allServices, ...services], 'id')

      const newState = {
        ...state,
        ...action.payload,
        allServices
      }
      newState.services = getServices(newState)
      newState.focusedService = newState.services[0]

      return newState
    }
    case types.FOCUS_SEARCH_BROWSER_ITEM:
    case types.NAVIGATE_SEARCH_BROWSER:
    case types.EXEC_SEARCH_BROWSER_ACTION:
    case types.UPDATE_SEARCH_BROWSER_INPUT:
      return {...state, ...action.payload}
    case types.FOCUS_SEARCH_BROWSER_ACTION:
      return {
        ...state,
        focusedAction: action.payload,
        hoveredAction: action.payload
      }
    case types.BLUR_SEARCH_BROWSER_ACTION:
      return {...state, hoveredAction: null}
    case types.SELECT_SEARCH_BROWSER_ITEM:
      return {...state, focusedItem: action.payload}
    case types.SHOW_SEARCH_BROWSER_SERVICES: {
      const services = getServices(state, action.payload)
      return {
        ...state,
        focusedList: 'services',
        services,
        focusedService: services[0]
      }
    }
    case types.FOCUS_SEARCH_BROWSER_SERVICE:
      return {...state, focusedService: action.payload}
    case types.SHOW_SEARCH_BROWSER_OBJECTS:
      return {...state, focusedList: 'objects'}
    case types.CLEAR_SEARCH_BROWSER_INPUT:
      return {...state, value: '', search: '', filters: []}
    case types.ADD_SEARCH_BROWSER_FILTER:
      return {
        ...state,
        tokens: {...state.tokens, [action.payload.label]: action.payload},
        filters: [...state.filters, action.payload.id]
      }
    case types.RESET_SEARCH_BROWSER_STATE:
      return initialState
    default:
      return state
  }
}
