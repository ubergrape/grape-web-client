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
    case types.FOCUS_SEARCH_BROWSER_ITEM:
    case types.NAVIGATE_SEARCH_BROWSER:
    case types.FOCUS_SEARCH_BROWSER_ACTION:
    case types.EXEC_SEARCH_BROWSER_ACTION:
    case types.SELECT_SEARCH_BROWSER_TAB:
    case types.SET_SEARCH_BROWSER_FILTERS:
    case types.SELECT_SEARCH_BROWSER_ITEM:
      return {...state, ...action.payload}
    default:
      return state
  }
}
