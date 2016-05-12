import noop from 'lodash/utility/noop'

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
  focusedView: 'results',
  // Entire input value including filters.
  value: '',
  // Only user input without filters.
  search: '',
  filters: [],
  results: [],
  actions,
  focusedAction: actions[0],
  tokens: {},
  // List of service id's.
  services: [],
  currServices: [],
  servicesResultsAmounts: {},
  onAddIntegration: noop,
  onSelectItem: noop,
  onDidMount: noop,
  onChange: noop,
  onAbort: noop,
  onBlur: noop,
  onLoadServices: noop,
  onLoadResultsAmounts: noop
}

function getCurrServices({services, filters}, search) {
  let curr = services.filter(({id}) => filters.indexOf(id) === -1)

  if (search) {
    const lowerSearch = search.toLowerCase().trim()
    curr = curr.filter(({label}) => label.toLowerCase().indexOf(lowerSearch) >= 0)
  }

  // Pick properties we need only.
  curr = curr.map(({id, label}) => ({id, label}))

  return curr
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_SEARCH_BROWSER_STATE: {
      const newState = {
        ...state,
        ...action.payload
      }
      // In case we receive update after input has been cleaned, ignore the new
      // results data.
      if (!state.value) newState.results = []
      if (!newState.services.length) newState.services = state.services
      newState.currServices = getCurrServices(newState)
      newState.focusedService = newState.currServices[0]
      return newState
    }
    case types.RESET_SEARCH_BROWSER_STATE:
      return initialState
    case types.SHOW_SEARCH_BROWSER_RESULTS:
      return {...state, focusedView: 'results'}
    case types.FOCUS_SEARCH_BROWSER_RESULT:
      return {...state, ...action.payload}
    case types.SELECT_SEARCH_BROWSER_RESULT:
      return {...state, focusedResult: action.payload}
    case types.FOCUS_SEARCH_BROWSER_ACTIONS:
      return {...state, focusedView: 'actions'}
    case types.FOCUS_SEARCH_BROWSER_ACTION:
      return {
        ...state,
        focusedAction: action.payload,
        hoveredAction: action.payload
      }
    case types.BLUR_SEARCH_BROWSER_ACTION:
      return {...state, hoveredAction: null}
    case types.SHOW_SEARCH_BROWSER_SERVICES: {
      const currServices = getCurrServices(state, action.payload)
      return {
        ...state,
        focusedView: 'services',
        currServices,
        focusedService: currServices[0]
      }
    }
    case types.LOAD_SEARCH_BROWSER_SERVICES_RESULTS_AMOUNTS:
      // Reset current map.
      return {...state, servicesResultsAmounts: {}}
    case types.UPDATE_SEARCH_BROWSER_SERVICES_RESULTS_AMOUNTS:
      return {...state, servicesResultsAmounts: action.payload}
    case types.FOCUS_SEARCH_BROWSER_SERVICE:
      return {...state, focusedService: action.payload}
    case types.ADD_SEARCH_BROWSER_SERVICE:
      return {
        ...state,
        tokens: {...state.tokens, [action.payload.label]: action.payload},
        filters: [...state.filters, action.payload.id]
      }
    case types.UPDATE_SEARCH_BROWSER_INPUT:
      return {...state, ...action.payload}
    case types.CLEAR_SEARCH_BROWSER_INPUT:
      return {...state, value: '', search: '', filters: [], results: []}
    default:
      return state
  }
}
