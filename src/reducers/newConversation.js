import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
  filter: '',
  creatingRoom: false,
  listed: [],
  loaded: false,
  found: [],
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_NEW_CONVERSATION:
      return {
        ...initialState,
        show: true,
      }
    case types.HIDE_NEW_CONVERSATION:
    case types.SET_CHANNEL:
      return initialState
    case types.ADD_TO_NEW_CONVERSATION:
      return {
        ...state,
        listed: [...state.listed, action.payload],
      }
    case types.REMOVE_FROM_NEW_CONVERSATION:
      return {
        ...state,
        listed: state.listed.filter(member => member.id !== action.payload.id),
      }
    case types.REQUEST_SEARCH_USERS:
      return {
        ...state,
        filter: action.payload,
        loaded: false,
      }
    case types.HANDLE_SEARCH_USERS: {
      const { search, users } = action.payload
      // Filter has changed while we have been waiting for result, ignore the result.
      if (state.filter !== search) return state

      let found = []

      if (users.length) found = users
      if (search) {
        found = [
          {
            displayName: search,
            id: search,
            email: search,
            username: search,
          },
          ...users,
        ]
      }

      return {
        ...state,
        found,
        loaded: true,
      }
    }
    case types.REQUEST_ROOM_CREATE:
      return {
        ...state,
        creatingRoom: true,
      }
    default:
      return state
  }
}
