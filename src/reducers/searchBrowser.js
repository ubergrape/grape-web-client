import * as types from '../constants/actionTypes'

const actions = [
  {
    type: 'insert',
    icon: 'comment'
  },
  {
    type: 'open',
    icon: 'iconLink'
  }
]

const initialActionsState = {
  actions,
  focusedAction: actions[0]
}

const initialState = {
  ...initialActionsState
}

function getCurrServices(services, filters, search) {
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
    case types.UPDATE_SEARCH_BROWSER_RESULTS:
      return {...state, ...action.payload}
    case types.SHOW_SEARCH_BROWSER_RESULTS:
      return {...state, ...initialActionsState, focusedView: 'results'}
    case types.FOCUS_SEARCH_BROWSER_RESULT:
    case types.SELECT_SEARCH_BROWSER_RESULT:
      return {
        ...state,
        focusedResult: action.payload,
        focusedView: 'results'
      }
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
      const {payload} = action
      const currServices = getCurrServices(
        payload.services,
        state.filters,
        payload.query.search
      )
      return {
        ...state,
        focusedView: 'services',
        currServices,
        focusedService: currServices[0]
      }
    }
    case types.FOCUS_SEARCH_BROWSER_SERVICE:
      return {...state, focusedService: action.payload}
    case types.ADD_SEARCH_BROWSER_FILTER:
      return {
        ...state,
        tokens: {...state.tokens, [action.payload.label]: action.payload},
        filters: [...state.filters, action.payload.id]
      }
    case types.UPDATE_SEARCH_BROWSER_INPUT:
      return {...state, ...action.payload}
    case types.RESET_SEARCH_BROWSER_STATE:
      return initialState
    default:
      return state
  }
}
