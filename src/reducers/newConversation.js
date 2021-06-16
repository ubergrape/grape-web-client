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
  isNoOtherGroups: false,
  people: [],
  isPeopleLoading: false,
  isPeopleWithPmLoading: false,
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
  [types.HIDE_CREATE_GROUP]: state => ({
    ...state,
    view: 'tabs',
  }),
  [types.SHOW_CREATE_GROUP]: state => ({
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
    isMemberOfEachGroup: state.isMemberOfEachGroup,
    groupsQuery: payload,
  }),
  [types.SET_GROUPS_SEARCH_LOADING_STATE]: (state, payload) => ({
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
    isInPmWithEveryPerson: state.isInPmWithEveryPerson,
    peopleQuery: payload,
  }),
  [types.SET_PEOPLE_SEARCH_LOADING_STATE]: (state, payload) => ({
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
