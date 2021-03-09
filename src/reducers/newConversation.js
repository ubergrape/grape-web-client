import { uniqBy } from 'lodash'

import * as types from '../constants/actionTypes'

const initialState = {
  isOpen: false,
  groups: [],
  isGroupsLoading: false,
  isMembershipGroupsLoading: false,
  isMemberOfEachGroup: false,
  groupsQuery: '',
  page: 1,
}

export default function reduce(state = initialState, action) {
  const { payload, type } = action
  switch (type) {
    case types.SHOW_NEW_CONVERSATION:
      return {
        ...initialState,
        isOpen: true,
      }
    case types.HIDE_NEW_CONVERSATION:
      return initialState
    case types.CHANGE_QUERY_GROUPS_NEW_CONVERSATION:
      return {
        ...initialState,
        isOpen: true,
        groupsQuery: payload,
      }
    case types.REQUEST_GROUPS_SEARCH_NEW_CONVERSATION:
      return {
        ...state,
        isGroupsLoading: payload,
      }
    case types.HANDLE_GROUPS_SEARCH_NEW_CONVERSATION:
      return {
        ...state,
        groups: uniqBy([...state.groups, ...payload], group =>
          [group.id, group.text].join(),
        ),
        page: state.page + 1,
      }
    case types.HANDLE_NO_GROUPS_LEFT_TO_JOIN:
      return {
        ...state,
        isMemberOfEachGroup: true,
      }
    case types.REQUEST_MEMBERSHIP_GROUPS_LOADING:
      return {
        ...state,
        isMembershipGroupsLoading: true,
        page: 1,
      }
    case types.CHANGE_ALL_GROUPS_LOADED:
      return {
        ...state,
        isAllGroupsLoaded: true,
      }
    default:
      return state
  }
}
