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
  canAddIntegrations: false,
  focusedList: 'objects',
  search: '',
  filters: [],
  actions,
  focusedAction: actions[0],
  tokens: {},
  services: [],
  onAddIntegration: noop,
  onSelectItem: noop,
  onDidMount: noop,
  onChange: noop,
  onAbort: noop,
  onBlur: noop,
  onInput: noop
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_SEARCH_BROWSER_STATE:
    case types.FOCUS_SEARCH_BROWSER_ITEM:
    case types.NAVIGATE_SEARCH_BROWSER:
    case types.EXEC_SEARCH_BROWSER_ACTION:
    case types.INPUT_SEARCH_BROWSER_SEARCH:
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
    case types.SHOW_SEARCH_BROWSER_SERVICES:
      return {...state, focusedList: 'services'}
    case types.FOCUS_SEARCH_BROWSER_SERVICE:
      return {...state, focusedService: action.payload}
    case types.SHOW_SEARCH_BROWSER_OBJECTS:
      return {...state, focusedList: 'objects'}
    case types.ADD_SEARCH_BROWSER_FILTER:
      return {...state, tokens: {...state.tokens, ...action.payload}}
    case types.RESET_SEARCH_BROWSER_STATE:
      return initialState
    default:
      return state
  }
}
