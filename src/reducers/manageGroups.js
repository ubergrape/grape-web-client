import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
  groups: [],
  page: 0,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_MANAGE_GROUPS:
      return {
        ...state,
        show: true,
      }
    case types.HIDE_MANAGE_GROUPS:
      return {
        ...state,
        show: false,
        groups: [],
        page: 0,
      }
    case types.SELECT_MANAGE_GROUPS_FILTER:
      return {
        ...state,
        activeFilter: action.payload,
        groups: [],
        page: 0,
      }
    case types.HANDLE_MANAGE_GROUPS_CHANNELS:
      return {
        ...state,
        groups: [...state.groups, ...action.payload],
      }
    case types.REMOVE_MANAGE_GROUPS_CHANNEL:
      return {
        ...state,
        groups: state.groups.filter(({ id }) => id !== action.payload),
      }
    case types.INCREMENT_MANAGE_GROUPS_PAGE:
      return {
        ...state,
        page: state.page + 1,
      }
    default:
      return state
  }
}
