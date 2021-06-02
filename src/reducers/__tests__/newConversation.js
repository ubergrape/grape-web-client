import * as types from '../../constants/actionTypes'
import { reducers } from '../../app/store'

import { generateArrayOfObjects } from '../../../jest/helpers'

import { getRoom } from '../../../jest/mocks/dataMocks'

describe('newConversation reducer', () => {
  const { newConversation } = reducers

  it('should handle HIDE_NEW_CONVERSATION', () => {
    expect(
      newConversation(
        { isOpen: true },
        {
          type: types.HIDE_NEW_CONVERSATION,
        },
      ),
    ).toEqual({
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
    })
  })

  it('should handle SHOW_NEW_CONVERSATION', () => {
    expect(
      newConversation(
        { isOpen: false },
        {
          type: types.SHOW_NEW_CONVERSATION,
        },
      ),
    ).toEqual({
      isOpen: true,
    })
  })

  it('should handle HIDE_CREATE_GROUP', () => {
    expect(
      newConversation(
        { view: 'create' },
        {
          type: types.HIDE_CREATE_GROUP,
        },
      ),
    ).toEqual({
      view: 'tabs',
    })
  })

  it('should handle HANDLE_CREATE_GROUP', () => {
    expect(
      newConversation(
        { view: 'tabs' },
        {
          type: types.HANDLE_CREATE_GROUP,
        },
      ),
    ).toEqual({
      view: 'create',
    })
  })

  it('should handle SET_NEW_CONVERSATION_TAB', () => {
    expect(
      newConversation(
        { tab: 0 },
        {
          type: types.SET_NEW_CONVERSATION_TAB,
          payload: 1,
        },
      ),
    ).toEqual({
      tab: 1,
    })
  })

  it('should handle CHANGE_GROUPS_QUERY', () => {
    expect(
      newConversation(
        { groupsQuery: 'search', isMemberOfEachGroup: true },
        {
          type: types.CHANGE_GROUPS_QUERY,
          payload: 'query',
        },
      ),
    ).toEqual({
      tab: 0,
      view: 'tabs',
      isOpen: true,
      groups: [],
      isGroupsLoading: false,
      isGroupsWithMembershipLoading: false,
      isMemberOfEachGroup: true,
      isNoOtherGroups: false,
      people: [],
      isPeopleLoading: false,
      isPeopleWithPmLoading: false,
      isInPmWithEveryPerson: false,
      isNoOtherPerson: false,
      groupsQuery: 'query',
      groupsPage: 1,
      peopleQuery: '',
      peoplePage: 1,
    })
  })

  it('should handle SET_GROUPS_SEARCH_LOADING_STATE', () => {
    expect(
      newConversation(
        { isGroupsLoading: false },
        {
          type: types.SET_GROUPS_SEARCH_LOADING_STATE,
          payload: true,
        },
      ),
    ).toEqual({
      isGroupsLoading: true,
    })
  })

  it('should handle HANDLE_GROUPS_SEARCH', () => {
    const groups1 = generateArrayOfObjects(getRoom, 3, [{ id: 1 }])
    const groups2 = generateArrayOfObjects(getRoom, 3, [{ id: 1 }])

    expect(
      newConversation(
        { groupsPage: 1, groups: groups1 },
        {
          type: types.HANDLE_GROUPS_SEARCH,
          payload: groups2,
        },
      ),
    ).toEqual({
      groupsPage: 2,
      groups: [...groups1, ...groups2.slice(1)],
    })
  })

  it('should handle HANDLE_NO_GROUPS_LEFT_TO_JOIN', () => {
    expect(
      newConversation(
        { isMemberOfEachGroup: false },
        {
          type: types.HANDLE_NO_GROUPS_LEFT_TO_JOIN,
        },
      ),
    ).toEqual({
      isMemberOfEachGroup: true,
    })
  })

  it('should handle HANDLE_NO_OTHER_GROUPS_IN_ORG', () => {
    expect(
      newConversation(
        { isNoOtherGroups: false },
        {
          type: types.HANDLE_NO_OTHER_GROUPS_IN_ORG,
        },
      ),
    ).toEqual({
      isNoOtherGroups: true,
    })
  })

  it('should handle REQUEST_MEMBERSHIP_GROUPS_LOADING', () => {
    expect(
      newConversation(
        { isGroupsWithMembershipLoading: false, groupsPage: 3 },
        {
          type: types.REQUEST_MEMBERSHIP_GROUPS_LOADING,
        },
      ),
    ).toEqual({
      isGroupsWithMembershipLoading: true,
      groupsPage: 1,
    })
  })

  it('should handle CHANGE_PEOPLE_QUERY', () => {
    expect(
      newConversation(
        { groupsQuery: 'search', isInPmWithEveryPerson: true },
        {
          type: types.CHANGE_PEOPLE_QUERY,
          payload: 'query',
        },
      ),
    ).toEqual({
      tab: 0,
      view: 'tabs',
      isOpen: true,
      groups: [],
      isGroupsLoading: false,
      isGroupsWithMembershipLoading: false,
      isMemberOfEachGroup: false,
      isNoOtherGroups: false,
      people: [],
      isPeopleLoading: false,
      isPeopleWithPmLoading: false,
      isInPmWithEveryPerson: true,
      isNoOtherPerson: false,
      groupsQuery: '',
      groupsPage: 1,
      peopleQuery: 'query',
      peoplePage: 1,
    })
  })

  it('should handle SET_PEOPLE_SEARCH_LOADING_STATE', () => {
    expect(
      newConversation(
        { isPeopleLoading: true },
        {
          type: types.SET_PEOPLE_SEARCH_LOADING_STATE,
          payload: false,
        },
      ),
    ).toEqual({
      isPeopleLoading: false,
    })
  })

  it('should handle HANDLE_PEOPLE_SEARCH', () => {
    const people1 = generateArrayOfObjects(getRoom, 3, [{ id: 1 }])
    const people2 = generateArrayOfObjects(getRoom, 3, [{ id: 1 }])

    expect(
      newConversation(
        { peoplePage: 1, people: people1 },
        {
          type: types.HANDLE_PEOPLE_SEARCH,
          payload: people2,
        },
      ),
    ).toEqual({
      peoplePage: 2,
      people: [...people1, ...people2.slice(1)],
    })
  })

  it('should handle HANDLE_NO_PEOPLE_LEFT_TO_JOIN', () => {
    expect(
      newConversation(
        { isInPmWithEveryPerson: false },
        {
          type: types.HANDLE_NO_PEOPLE_LEFT_TO_JOIN,
        },
      ),
    ).toEqual({
      isInPmWithEveryPerson: true,
    })
  })

  it('should handle HANDLE_NO_OTHER_PEOPLE_IN_ORG', () => {
    expect(
      newConversation(
        { isNoOtherPerson: false },
        {
          type: types.HANDLE_NO_OTHER_PEOPLE_IN_ORG,
        },
      ),
    ).toEqual({
      isNoOtherPerson: true,
    })
  })

  it('should handle REQUEST_MEMBERSHIP_PEOPLE_LOADING', () => {
    expect(
      newConversation(
        { isPeopleWithPmLoading: false, peoplePage: 3 },
        {
          type: types.REQUEST_MEMBERSHIP_PEOPLE_LOADING,
        },
      ),
    ).toEqual({
      isPeopleWithPmLoading: true,
      peoplePage: 1,
    })
  })
})
