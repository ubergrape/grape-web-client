import { findIndex } from 'lodash'

import * as types from '../constants/actionTypes'

const initialState = {
  name: '',
  description: '',
  color: 0,
  isPublic: true,
  isFocused: false,
  page: 1,
  users: [],
  filter: '',
  error: '',
}

export default function reduce(state = initialState, action) {
  const { payload, type } = action
  switch (type) {
    case types.HIDE_NEW_CONVERSATION:
      return {
        ...initialState,
      }
    case types.CHANGE_NAME_CREATE_ROOM:
      return {
        ...state,
        error: '',
        name: payload,
      }
    case types.CHANGE_COLOR_CREATE_ROOM:
      return {
        ...state,
        color: payload,
      }
    case types.CHANGE_TYPE_CREATE_ROOM:
      return {
        ...state,
        isPublic: payload,
      }
    case types.CHANGE_DESCRIPTION_CREATE_ROOM:
      return {
        ...state,
        description: payload,
      }
    case types.CHANGE_MULTIPLE_INPUT_FOCUS_CREATE_ROOM:
      return {
        ...state,
        isFocused: payload,
      }
    case types.HANDLE_USERS_SEARCH_CREATE_ROOM:
      return {
        ...state,
        users: [...state.users, ...payload],
        page: state.page + 1,
      }
    case types.HANDLE_ERROR_CREATE_ROOM:
      return {
        ...state,
        error: payload,
      }
    case types.CHANGE_CHECKED_STATUS_CREATE_ROOM: {
      const { users } = state
      const newUsers = [...users]
      const index = findIndex(newUsers, { id: payload.id })
      if (index === -1) return state
      const currUser = newUsers[index]
      const user = { ...currUser, checked: !currUser.checked }
      newUsers.splice(index, 1, user)
      return {
        ...state,
        users: [...newUsers],
      }
    }
    case types.CHANGE_FILTER_CREATE_ROOM:
      return {
        ...state,
        filter: payload,
        users: [],
        page: 1,
      }
    default:
      return state
  }
}
