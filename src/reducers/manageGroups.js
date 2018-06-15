import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
  groups: [],
  activeFilter: 'unjoined'
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_MANAGE_GROUPS:
      return {
        ...state,
        show: true
      }
    case types.HIDE_MANAGE_GROUPS:
      return {
        ...state,
        show: false
      }
    case types.SELECT_MANAGE_GROUPS_FILTER:
      return {
        ...state,
        activeFilter: action.payload,
        groups: []
      }
    case types.HANDLE_MANAGE_GROUPS_CHANNELS:
      return {
        ...state,
        groups: action.payload
      }
    case types.REMOVE_GROUP_FROM_MANAGE_GROUPS:
      return {
        ...state,
        groups: state.groups.filter(group => group.id !== action.payload)
      }
    case types.ADD_GROUP_FROM_MANAGE_GROUPS:
      return {
        ...state,
        groups: [...state.groups, action.payload].sort((a, b) => {
          const nameA = a.name.toUpperCase()
          const nameB = b.name.toUpperCase()
          if (nameA < nameB) return -1
          if (nameA > nameB) return 1
          return 0
        })
      }
    default:
      return state
  }
}
