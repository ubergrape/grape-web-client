import { merge } from 'lodash'
import * as images from '../constants/images'
import * as types from '../constants/actionTypes'

const initialState = {
  limit: 20,
  options: {
    currentChannelOnly: {
      show: true,
      status: false,
    },
    searchActivities: {
      show: true,
      status: false,
    },
  },
  isLoading: false,
  items: [],
  query: [],
  total: undefined,
  images,
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_SIDEBAR_OPTIONS:
      return { ...state, options: merge({}, state.options, action.payload) }
    case types.SET_SIDEBAR_IS_LOADING:
    case types.SEARCH_MESSAGES:
    case types.FOUND_MESSAGES:
    case types.UPDATE_MESSAGE_SEARCH_QUERY:
      return { ...state, ...action.payload }
    case types.TOGGLE_SEARCH_IN_CHANNEL_ONLY: {
      const options = merge({}, state.options)
      options.currentChannelOnly.status = !options.currentChannelOnly.status
      return {
        ...state,
        options,
        items: initialState.items,
        limit: initialState.limit,
        total: initialState.total,
      }
    }
    case types.TOGGLE_SEARCH_ACTIVITIES: {
      const options = merge({}, state.options)
      options.searchActivities.status = !options.searchActivities.status
      return {
        ...state,
        options,
        items: initialState.items,
        limit: initialState.limit,
        total: initialState.total,
      }
    }
    default:
      return state
  }
}
