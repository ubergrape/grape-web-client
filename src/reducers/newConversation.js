import uniqBy from 'lodash/uniqBy'

import * as types from '../constants/actionTypes'

export const initial = {
  tab: 0,
  isTabLoading: false,
  view: 'tabs',
  isOpen: false,
  groups: [],
  isGroupsLoading: false,
  isGroupsWithMembershipLoading: false,
  isMemberOfEachGroup: false,
  isNoOtherGroups: false,
  people: [],
  isPeopleLoading: false,
  isInPmWithEveryPerson: false,
  isNoOtherPerson: false,
  groupsQuery: '',
  groupsPage: 1,
  peopleQuery: '',
  peoplePage: 1,
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
    isTabLoading: true,
    tab: payload,
  }),
  [types.SET_TAB_LOADING_STATE]: (state, payload) => ({
    ...state,
    isTabLoading: payload,
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
    groupsPage: state.groupsPage + 1,
  }),
  [types.HANDLE_NO_GROUPS_LEFT_TO_JOIN]: state => ({
    ...state,
    isMemberOfEachGroup: true,
  }),
  [types.HANDLE_NO_OTHER_GROUPS_IN_ORG]: state => ({
    ...state,
    isNoOtherGroups: true,
  }),
  [types.REQUEST_MEMBERSHIP_GROUPS_LOADING]: state => ({
    ...state,
    isGroupsWithMembershipLoading: true,
    groupsPage: 1,
  }),
  [types.CHANGE_PEOPLE_QUERY]: (state, payload) => ({
    ...initial,
    isOpen: true,
    peopleQuery: payload,
  }),
  [types.REQUEST_PEOPLE_SEARCH]: (state, payload) => ({
    ...state,
    isPeopleLoading: payload,
  }),
  [types.HANDLE_PEOPLE_SEARCH]: (state, payload) => ({
    ...state,
    people: uniqBy([...state.people, ...payload], person => [person.id].join()),
    peoplePage: state.peoplePage + 1,
  }),
  [types.HANDLE_NO_PEOPLE_LEFT_TO_JOIN]: state => ({
    ...state,
    isInPmWithEveryPerson: true,
  }),
  [types.HANDLE_NO_OTHER_PEOPLE_IN_ORG]: state => ({
    ...state,
    isNoOtherPerson: true,
  }),
  [types.REQUEST_MEMBERSHIP_PEOPLE_LOADING]: state => ({
    ...state,
    isPeopleWithPmLoading: true,
    peoplePage: 1,
  }),
}
