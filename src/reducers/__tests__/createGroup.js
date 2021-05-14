import faker from 'faker'
import moment from 'moment'

import * as types from '../../constants/actionTypes'
import { userStatusMap, userRolesMap } from '../../constants/app'
import { reducers } from '../../app/store'

import {
  getRandomElement,
  generateArray,
  overwriteArray,
} from '../../tests/helpers'

const getSelectedMember = dataToOverwrite => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()

  return {
    avatar: faker.image.imageUrl(),
    displayName: `${firstName} ${lastName}`,
    id: faker.datatype.number(),
    ...dataToOverwrite,
  }
}

const getMember = dataToOverwrite => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()

  return {
    avatar: faker.image.imageUrl(),
    displayName: `${firstName} ${lastName}`,
    email: faker.internet.email(),
    firstName,
    hideEmailField: faker.datatype.boolean(),
    highlighted: `${firstName} <em>${lastName}</em>`,
    id: faker.datatype.number(),
    isActive: faker.datatype.boolean(),
    lastMessageTimestamp: moment(faker.datatype.datetime()).format(
      'YYYY-MM-DDTHH:mm:ss.SSSSSSZ',
    ),
    lastName,
    phoneNumber: faker.phone.phoneNumber(),
    pm: faker.datatype.number(),
    role: getRandomElement(Object.values(userRolesMap)),
    section: '#',
    skypeForBusiness: faker.internet.email(),
    skype_username: faker.internet.userName(),
    status: parseInt(getRandomElement(Object.keys(userStatusMap)), 10),
    title: faker.name.jobTitle(),
    username: faker.internet.userName(),
    whatIDo: faker.name.jobDescriptor(),
    ...dataToOverwrite,
  }
}

describe('createGroup reducer', () => {
  const { createGroup } = reducers
  it('should handle SHOW_CREATE_GROUP', () => {
    expect(
      createGroup(
        { isPrivate: false },
        {
          type: types.SHOW_CREATE_GROUP,
          payload: true,
        },
      ),
    ).toEqual({
      isPrivate: true,
    })
  })

  it('should handle SET_IS_PRIVATE', () => {
    expect(
      createGroup(
        { isPrivate: false },
        {
          type: types.SET_IS_PRIVATE,
        },
      ),
    ).toEqual({
      isPrivate: true,
    })
  })

  it('should handle HANDLE_GROUP_NAME_CHANGE', () => {
    expect(
      createGroup(
        { name: '' },
        {
          type: types.HANDLE_GROUP_NAME_CHANGE,
          payload: 'Group name',
        },
      ),
    ).toEqual({
      name: 'Group name',
    })
  })

  it('should handle HANDLE_GROUP_DESCRIPTION_CHANGE', () => {
    expect(
      createGroup(
        { description: '' },
        {
          type: types.HANDLE_GROUP_DESCRIPTION_CHANGE,
          payload: 'Group description',
        },
      ),
    ).toEqual({
      description: 'Group description',
    })
  })

  it('should handle CHANGE_MEMBERS_QUERY', () => {
    const selectedMembers = generateArray(getSelectedMember, 2)
    const members = generateArray(getMember, 3)

    expect(
      createGroup(
        {
          page: 3,
          members,
          selectedMembers,
          isMembersLoading: true,
          membersQuery: 'query',
        },
        {
          type: types.CHANGE_MEMBERS_QUERY,
          payload: 'Query',
        },
      ),
    ).toEqual({
      page: 1,
      members: [],
      selectedMembers,
      isMembersLoading: false,
      membersQuery: 'Query',
    })
  })

  it('should handle REQUEST_MEMBERS_SEARCH', () => {
    expect(
      createGroup(
        { isMembersLoading: false },
        {
          type: types.REQUEST_MEMBERS_SEARCH,
          payload: true,
        },
      ),
    ).toEqual({
      isMembersLoading: true,
    })
  })

  it('should handle HANDLE_TAGS_INPUT_INTERACTION', () => {
    expect(
      createGroup(
        { isTagsInputInteracted: false },
        {
          type: types.HANDLE_TAGS_INPUT_INTERACTION,
          payload: true,
        },
      ),
    ).toEqual({
      isTagsInputInteracted: true,
    })
  })

  it('should handle HANDLE_MEMBERS_SEARCH with empty selectedMembers', () => {
    const members1 = generateArray(getMember, 3)
    const members2 = generateArray(getMember, 3)

    expect(
      createGroup(
        { page: 1, members: members1, selectedMembers: [] },
        {
          type: types.HANDLE_MEMBERS_SEARCH,
          payload: members2,
        },
      ),
    ).toEqual({
      page: 2,
      members: [...members1, ...members2],
      selectedMembers: [],
    })
  })

  it('should handle HANDLE_MEMBERS_SEARCH with filled selectedMembers', () => {
    const members1 = generateArray(getMember, 3, [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ])
    const members2 = generateArray(getMember, 3)
    const selectedMembers = generateArray(getSelectedMember, 3, [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ])

    expect(
      createGroup(
        { page: 1, members: members1, selectedMembers },
        {
          type: types.HANDLE_MEMBERS_SEARCH,
          payload: members2,
        },
      ),
    ).toEqual({
      page: 2,
      members: [
        ...overwriteArray(members1, [
          { isSelected: true },
          { isSelected: true },
          { isSelected: true },
        ]),
        ...members2,
      ],
      selectedMembers,
    })
  })

  it('should handle HANDLE_MEMBER_SELECT', () => {
    const members1 = generateArray(getMember, 3, [
      { id: 1, displayName: 'Name' },
    ])
    const selectedMembers1 = generateArray(getSelectedMember, 3)
    const newSelectedMember = getSelectedMember({ id: 1, displayName: 'Name' })

    expect(
      createGroup(
        { members: members1, selectedMembers: selectedMembers1 },
        {
          type: types.HANDLE_MEMBER_SELECT,
          payload: 1,
        },
      ),
    ).toEqual({
      members: [...overwriteArray(members1, [{ isSelected: true }])],
      selectedMembers: [...selectedMembers1, newSelectedMember],
    })
  })

  it('should handle HANDLE_MEMBER_REMOVE', () => {
    const members1 = generateArray(getMember, 3, [
      { id: 1, displayName: 'Name 1' },
    ])
    const selectedMembers1 = generateArray(getSelectedMember, 3, [
      { id: 1, displayName: 'Name 1' },
      { id: 2, displayName: 'Name 2' },
      { id: 3, displayName: 'Name 3' },
    ])
    const selectedMembers2 = generateArray(getSelectedMember, 2, [
      { id: 2, displayName: 'Name 2' },
      { id: 3, displayName: 'Name 3' },
    ])

    expect(
      createGroup(
        { members: members1, selectedMembers: selectedMembers1 },
        {
          type: types.HANDLE_MEMBER_REMOVE,
          payload: 1,
        },
      ),
    ).toEqual({
      members: [...overwriteArray(members1, [{ isSelected: false }])],
      selectedMembers: selectedMembers2,
    })
  })
})
