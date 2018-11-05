import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
  isLoaded: false,
  page: 1,
  filterUsers: '',
  users: [],
  groups: [],
}

export default function reduce(state = initialState, action) {
  const { payload, type } = action
  switch (type) {
    case types.CHANGE_TAB_NEW_CONVERSATION:
      return {
        ...initialState,
        filterUsers: state.filterUsers,
        show: true,
      }
    case types.SHOW_NEW_CONVERSATION:
      return {
        ...initialState,
        show: true,
      }
    case types.HIDE_NEW_CONVERSATION:
      return {
        ...initialState,
        show: false,
      }
    case types.CHANGE_INPUT_NEW_CONVERSATION:
      return {
        ...state,
        filterUsers: action.payload,
        users: [],
        page: 1,
      }
    case types.REQUEST_SEARCH_USERS_NEW_CONVERSATION:
      return {
        ...state,
        isLoaded: action.payload,
      }
    case types.HANDLE_SEARCH_USERS_NEW_CONVERSATION: {
      const { users } = payload
      return {
        ...state,
        users: [...state.users, ...users],
        page: state.page + 1,
      }
    }
    default:
      return state
  }
}
