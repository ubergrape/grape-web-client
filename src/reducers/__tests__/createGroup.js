import faker from 'faker'

import * as types from '../../constants/actionTypes'
import { reducers } from '../../app/store'

import { getUser } from '../../../jest/mocks/dataMocks'
import { generateArrayOfObjects, overwriteArray } from '../../../jest/helpers'

export const getSelectedMember = dataToOverwrite => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()

  return {
    avatar: faker.image.imageUrl(),
    displayName: `${firstName} ${lastName}`,
    id: faker.datatype.number(),
    ...dataToOverwrite,
  }
}

describe('createGroup reducer', () => {
  const { createGroup } = reducers
  it('should handle HIDE_NEW_CONVERSATION', () => {
    expect(
      createGroup(
        { isPrivate: true },
        {
          type: types.HIDE_NEW_CONVERSATION,
        },
      ),
    ).toEqual({
      isPrivate: false,
      name: '',
      description: '',
      membersQuery: '',
      members: [],
      selectedMembers: [],
      page: 1,
      errorDetails: {},
      isTagsInputInteracted: false,
      isMembersLoading: false,
    })
  })

  it('should handle HIDE_CREATE_GROUP', () => {
    expect(
      createGroup(
        { isPrivate: true },
        {
          type: types.HIDE_CREATE_GROUP,
        },
      ),
    ).toEqual({
      isPrivate: false,
      name: '',
      description: '',
      membersQuery: '',
      members: [],
      selectedMembers: [],
      page: 1,
      errorDetails: {},
      isTagsInputInteracted: false,
      isMembersLoading: false,
    })
  })

  it('should handle HANDLE_CREATE_GROUP', () => {
    expect(
      createGroup(
        { isPrivate: false },
        {
          type: types.HANDLE_CREATE_GROUP,
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

  it('should handle HANDLE_CREATE_GROUP_ERROR_DETAILS', () => {
    expect(
      createGroup(
        { errorDetails: {} },
        {
          type: types.HANDLE_CREATE_GROUP_ERROR_DETAILS,
          payload: {
            name: [
              { message: 'Group name too long (max 30 characters)', code: '' },
            ],
          },
        },
      ),
    ).toEqual({
      errorDetails: {
        name: [
          { message: 'Group name too long (max 30 characters)', code: '' },
        ],
      },
    })
  })

  it('should handle CHANGE_MEMBERS_QUERY', () => {
    const selectedMembers = generateArrayOfObjects(getSelectedMember, 2)
    const members = generateArrayOfObjects(getUser, 3)

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
    const members1 = generateArrayOfObjects(getUser, 3)
    const members2 = generateArrayOfObjects(getUser, 3)

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
    const members1 = generateArrayOfObjects(getUser, 3, [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ])
    const members2 = generateArrayOfObjects(getUser, 3)
    const selectedMembers = generateArrayOfObjects(getSelectedMember, 3, [
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
    const members1 = generateArrayOfObjects(getUser, 3, [
      { id: 1, displayName: 'Name' },
    ])
    const selectedMembers1 = generateArrayOfObjects(getSelectedMember, 3)
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
    const members1 = generateArrayOfObjects(getUser, 3, [
      { id: 1, displayName: 'Name 1' },
    ])
    const selectedMembers1 = generateArrayOfObjects(getSelectedMember, 3, [
      { id: 1, displayName: 'Name 1' },
      { id: 2, displayName: 'Name 2' },
      { id: 3, displayName: 'Name 3' },
    ])
    const selectedMembers2 = generateArrayOfObjects(getSelectedMember, 2, [
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
