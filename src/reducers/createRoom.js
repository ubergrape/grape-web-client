import uniqBy from 'lodash/uniqBy'
import findIndex from 'lodash/findIndex'

import * as types from '../constants/actionTypes'

export const initial = {
  isPrivate: false,
  name: '',
  description: '',
  membersQuery: '',
  members: [],
  selectedMembers: [],
  page: 1,
  errorDetails: {},
  isTagsInputInteracted: false,
  currentSelectedMember: 0,
  isMembersLoading: false,
}

const handleMemberSelectChange = ({ members, index, payload, isSelected }) => {
  let newMembers = members

  if (members[index]) {
    newMembers = members.map(member => {
      const { id } = member

      if (id === payload) {
        return {
          ...member,
          isSelected,
        }
      }

      return member
    })
  }

  return newMembers
}

export const states = {
  [types.HIDE_NEW_CONVERSATION]: () => initial,
  [types.HIDE_CREATE_ROOM]: () => initial,
  [types.SHOW_CREATE_ROOM]: (state, payload) => ({
    ...state,
    isPrivate: payload,
  }),
  [types.SET_IS_PRIVATE]: state => ({
    ...state,
    isPrivate: !state.isPrivate,
  }),
  [types.HANDLE_GROUP_NAME_CHANGE]: (state, payload) => ({
    ...state,
    name: payload,
  }),
  [types.HANDLE_GROUP_DESCRIPTION_CHANGE]: (state, payload) => ({
    ...state,
    description: payload,
  }),
  [types.HANDLE_CREATE_ROOM_ERROR_DETAILS]: (state, payload) => ({
    ...state,
    errorDetails: payload,
  }),
  [types.CHANGE_MEMBERS_QUERY]: (state, payload) => ({
    ...state,
    page: 1,
    members: [],
    selectedMembers: state.selectedMembers,
    isMembersLoading: false,
    membersQuery: payload,
  }),
  [types.REQUEST_MEMBERS_SEARCH]: (state, payload) => ({
    ...state,
    isMembersLoading: payload,
  }),
  [types.HANDLE_TAGS_INPUT_INTERACTION]: (state, payload) => ({
    ...state,
    isTagsInputInteracted: payload,
  }),
  [types.HANDLE_SELECTED_MEMBER_CHANGE]: (state, payload) => ({
    ...state,
    currentSelectedMember: payload,
  }),
  [types.HANDLE_MEMBERS_SEARCH]: (state, payload) => ({
    ...state,
    members: uniqBy([...state.members, ...payload], ({ id }) => id).map(
      member => {
        if (
          state.selectedMembers.some(
            selectedMember => selectedMember.id === member.id,
          )
        ) {
          return {
            ...member,
            isSelected: true,
          }
        }

        return member
      },
    ),
    page: state.page + 1,
  }),
  [types.HANDLE_MEMBER_SELECT]: (state, payload) => {
    const newState = state
    const index = findIndex(newState.members, { id: payload })

    if (index === -1) return state

    const { members, selectedMembers } = newState

    const newMembers = handleMemberSelectChange({
      members,
      index,
      payload,
      isSelected: true,
    })

    return {
      ...newState,
      members: newMembers,
      selectedMembers: [...selectedMembers, members[index]],
    }
  },
  [types.HANDLE_MEMBER_REMOVE]: (state, payload) => {
    const newState = state
    const index = findIndex(newState.selectedMembers, { id: payload })

    if (index === -1) return state

    const { members, selectedMembers } = newState

    const newMembers = handleMemberSelectChange({
      members,
      index,
      payload,
      isSelected: false,
    })

    return {
      ...newState,
      members: newMembers,
      selectedMembers: selectedMembers.filter(({ id }) => id !== payload),
    }
  },
}
