import * as types from '../constants/actionTypes'

const initialState = {
  showBrowser: false,
  editMessage: null,
  quoteMessage: null
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.EDIT_MESSAGE:
      return {...state, targetMessage: action.payload.id}
    case types.HANDLE_OUTGOING_MESSAGE:
    case types.SET_CHANNEL:
    case types.EDIT_MESSAGE_ABORT:
      return {...state, targetMessage: null}
    case types.EDIT_MESSAGE_SEND:
      return {...state, targetMessage: null}
    case types.INSERT_MESSAGE_QUOTE:
      return {...state, quoteMessage: action.payload}
    case types.SHOW_EMOJI_BROWSER:
      return {...state, showBrowser: 'emoji'}
    case types.SHOW_EMOJI_SUGGEST_BROWSER:
      return {...state, showBrowser: 'emojiSuggest', search: action.payload}
    case types.SHOW_USERS_AND_ROOMS_BROWSER:
      return {...state, showBrowser: 'user', search: action.payload}
    case types.SHOW_SEARCH_BROWSER:
      return {...state, showBrowser: 'search', search: action.payload}
    case types.HIDE_BROWSER:
      return {...state, showBrowser: false}
    case types.HANDLE_AUTOCOMPLETE:
      return {...state, autocomplete: action.payload}
    case types.HANDLE_AUTOCOMPLETE_SERVICES:
      return {...state, services: action.payload}
    case types.HANDLE_AUTOCOMPLETE_SERVICES_STATS:
      return {...state, servicesStats: action.payload}
    default:
      return state
  }
}
