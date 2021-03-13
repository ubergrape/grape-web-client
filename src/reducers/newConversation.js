import uniqBy from 'lodash/uniqBy'

import * as types from '../constants/actionTypes'

export const initial = {
  tab: 0,
  view: 'tabs',
  isOpen: false,
  groups: [],
  isGroupsLoading: false,
  isGroupsWithMembershipLoading: false,
  isMemberOfEachGroup: false,
  groupsQuery: '',
  page: 1,
}

export const states = {
  [types.HIDE_NEW_CONVERSATION]: () => initial,
  [types.SHOW_NEW_CONVERSATION]: state => ({
    ...state,
    isOpen: true,
  }),
  [types.HIDE_CREATE_ROOM]: state => ({
    ...state,
    view: 'tabs',
  }),
  [types.SHOW_CREATE_ROOM]: state => ({
    ...state,
    view: 'create',
  }),
  [types.SET_NEW_CONVERSATION_TAB]: (state, payload) => ({
    ...state,
    tab: payload,
  }),
  [types.CHANGE_GROUPS_QUERY]: (state, payload) => ({
    ...initial,
    isOpen: true,
    groupsQuery: payload,
  }),
  [types.REQUEST_GROUPS_SEARCH]: (state, payload) => ({
    ...state,
    isGroupsLoading: payload,
  }),
  [types.HANDLE_GROUPS_SEARCH]: (state, payload) => ({
    ...state,
    groups: uniqBy([...state.groups, ...payload], group =>
      [group.id, group.text].join(),
    ),
    page: state.page + 1,
  }),
  [types.HANDLE_NO_GROUPS_LEFT_TO_JOIN]: state => ({
    ...state,
    isMemberOfEachGroup: true,
  }),
  [types.REQUEST_MEMBERSHIP_GROUPS_LOADING]: state => ({
    ...state,
    isGroupsWithMembershipLoading: true,
    page: 1,
  }),
}
