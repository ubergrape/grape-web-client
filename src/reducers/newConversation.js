import { uniqBy } from 'lodash'
import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
  view: 'tabs',
  tab: 0,
  isUsersLoaded: true,
  isGroupsLoaded: true,
  isMembersNotLoaded: false,
  isMemberOfEachChannel: false,
  page: 1,
  filterUsers: '',
  filterGroups: '',
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
        tab: payload,
      }
    case types.CHANGE_VIEW_NEW_CONVERSATION:
      return {
        ...state,
        view: payload,
      }
    case types.CHANGE_FILTER_USERS_NEW_CONVERSATION:
      return {
        ...state,
        filterUsers: payload,
        isMembersNotLoaded: false,
        users: [],
        page: 1,
      }
    case types.CHANGE_FILTER_GROUPS_NEW_CONVERSATION:
      return {
        ...state,
        filterGroups: payload,
        isMembersNotLoaded: false,
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
        isMembersNotLoaded: true,
        page: 1,
      }
    case types.REQUEST_USERS_SEARCH_NEW_CONVERSATION:
      return {
        ...state,
        isUsersLoaded: payload,
      }
    case types.REQUEST_GROUPS_SEARCH_NEW_CONVERSATION:
      return {
        ...state,
        isGroupsLoaded: payload,
      }
    case types.HANDLE_USERS_SEARCH_NEW_CONVERSATION:
      return {
        ...state,
        users: uniqBy([...state.users, ...payload], user =>
          [user.id, user.text].join(),
        ),
        page: state.page + 1,
      }
    case types.HANDLE_GROUPS_SEARCH_NEW_CONVERSATION:
      return {
        ...state,
        groups: uniqBy([...state.groups, ...payload], group =>
          [group.id, group.text].join(),
        ),
        page: state.page + 1,
      }
    default:
      return state
  }
}
