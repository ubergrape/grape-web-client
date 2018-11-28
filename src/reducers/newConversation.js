import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
  view: 'tabs',
  tab: 0,
  isLoaded: true,
  isNotMembersLoaded: false,
  isMemberOfEachChannel: false,
  page: 1,
  filterUsers: '',
  filterGroups: '',
  newRoom: {
    name: '',
    description: '',
    color: 0,
    isPublic: true,
    users: [],
  },
  groups: [],
  users: [],
}

export default function reduce(state = initialState, action) {
  const { payload, type } = action
  switch (type) {
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
    case types.CHANGE_TAB_NEW_CONVERSATION:
      return {
        ...initialState,
        newRoom: state.newRoom,
        filterUsers: state.filterUsers,
        filterGroups: state.filterGroups,
        show: true,
        tab: action.payload,
      }
    case types.CHANGE_VIEW_NEW_CONVERSATION:
      return {
        ...state,
        view: action.payload,
      }
    case types.CHANGE_INPUT_USERS_NEW_CONVERSATION:
      return {
        ...state,
        filterUsers: action.payload,
        isNotMembersLoaded: false,
        users: [],
        page: 1,
      }
    case types.CHANGE_INPUT_GROUPS_NEW_CONVERSATION:
      return {
        ...state,
        filterGroups: action.payload,
        isNotMembersLoaded: false,
        groups: [],
        page: 1,
      }
    case types.HANDLE_MEMBER_OF_EACH_NEW_CONVERSATION:
      return {
        ...state,
        isMemberOfEachChannel: true,
      }
    case types.FLIP_TO_MEMBERSHIP_NEW_CONVERSATION:
      return {
        ...state,
        isNotMembersLoaded: true,
        page: 1,
      }
    case types.REQUEST_SEARCH_NEW_CONVERSATION:
      return {
        ...state,
        isLoaded: action.payload,
      }
    case types.HANDLE_USERS_SEARCH_NEW_CONVERSATION:
      return {
        ...state,
        users: [...state.users, ...payload],
        page: state.page + 1,
      }
    case types.HANDLE_GROUPS_SEARCH_NEW_CONVERSATION:
      return {
        ...state,
        groups: [...state.groups, ...payload],
        page: state.page + 1,
      }
    case types.CHANGE_NEW_ROOM_NAME_NEW_CONVERSATION:
      return {
        ...state,
        newRoom: {
          ...state.newRoom,
          name: action.payload,
        },
      }
    case types.CHANGE_NEW_ROOM_COLOR_NEW_CONVERSATION:
      return {
        ...state,
        newRoom: {
          ...state.newRoom,
          color: action.payload,
        },
      }
    case types.CHANGE_NEW_ROOM_TYPE_NEW_CONVERSATION:
      return {
        ...state,
        newRoom: {
          ...state.newRoom,
          isPublic: action.payload,
        },
      }
    case types.CHANGE_NEW_ROOM_DESCRIPTION_NEW_CONVERSATION:
      return {
        ...state,
        newRoom: {
          ...state.newRoom,
          description: action.payload,
        },
      }
    default:
      return state
  }
}
