import * as types from '../constants/actionTypes'
import { orgSelector } from '../selectors'
import * as api from '../utils/backend/api'
import { error } from './'
import { normalizeUserData } from './utils'

export function showNewConversation() {
  return {
    type: types.SHOW_NEW_CONVERSATION,
  }
}

export function hideNewConversation() {
  return {
    type: types.HIDE_NEW_CONVERSATION,
  }
}

export function addToNewConversation(user) {
  return {
    type: types.ADD_TO_NEW_CONVERSATION,
    payload: user,
  }
}

export function removeFromNewConversation(user) {
  return {
    type: types.REMOVE_FROM_NEW_CONVERSATION,
    payload: user,
  }
}

export const searchUsers = search => (dispatch, getState) => {
  dispatch({
    type: types.REQUEST_SEARCH_USERS,
    payload: search,
  })

  const org = orgSelector(getState())

  api
    .getUsers(org.id, { query: search, pageSize: 50 })
    .then(({ results }) => ({
      search,
      users: results.map(normalizeUserData),
    }))
    .then(payload => {
      dispatch({
        type: types.HANDLE_SEARCH_USERS,
        payload,
      })
    })
    .catch(err => {
      dispatch(error(err))
    })
}
