import * as types from '../constants/actionTypes'

const initialState = {
  channelsToMention: [],
  searchMention: '',
  showBrowser: false,
  editMessage: null,
  quoteMessage: null,
  autocomplete: {
    search: {},
    results: [],
    services: [],
  },
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.EDIT_MESSAGE:
      return { ...state, targetMessage: action.payload.id }
    case types.REQUEST_POST_MESSAGE:
    case types.SET_CHANNEL:
    case types.EDIT_MESSAGE_ABORT:
      return { ...state, targetMessage: null }
    case types.EDIT_MESSAGE_SEND:
      return { ...state, targetMessage: null }
    case types.INSERT_MESSAGE_QUOTE:
      return { ...state, quoteMessage: action.payload }
    case types.SHOW_EMOJI_BROWSER:
      return { ...state, showBrowser: 'emoji' }
    case types.SHOW_EMOJI_SUGGEST_BROWSER:
      return { ...state, showBrowser: 'emojiSuggest', search: action.payload }
    case types.SHOW_USERS_AND_ROOMS_BROWSER:
      return { ...state, showBrowser: 'user', search: action.payload }
    case types.SHOW_SEARCH_BROWSER:
      return { ...state, showBrowser: 'search', search: action.payload }
    case types.HIDE_BROWSER:
      return {
        ...state,
        showBrowser: false,
        autocomplete: {
          search: {},
          results: [],
          services: [],
        },
      }
    case types.HANDLE_CHANNELS_TO_MENTION: {
      const { search, results } = action.payload
      if (search !== state.searchMention) return state
      return { ...state, channelsToMention: results }
    }
    case types.REQUEST_SEARCH_CHANNELS_TO_MENTION: {
      return { ...state, searchMention: action.payload }
    }
    case types.HANDLE_AUTOCOMPLETE:
      return { ...state, autocomplete: action.payload }
    case types.HANDLE_AUTOCOMPLETE_SERVICES:
      return { ...state, services: action.payload }
    case types.HANDLE_AUTOCOMPLETE_SERVICES_STATS:
      return { ...state, servicesStats: action.payload }
    case types.SET_OPEN_FILE_DIALOG_HANDLER:
      return { ...state, onOpenFileDialog: action.payload }
    default:
      return state
  }
}
