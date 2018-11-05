import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import { error } from './'

import { orgSelector, newConversationSelector } from '../selectors'

export const showNewConversation = () => ({
  type: types.SHOW_NEW_CONVERSATION,
})

export const hideNewConversation = () => ({
  type: types.HIDE_NEW_CONVERSATION,
})

export const changeTabNewConversation = () => ({
  type: types.CHANGE_TAB_NEW_CONVERSATION,
})

export const changeInputNewConversation = filter => dispatch => {
  dispatch({
    type: types.CHANGE_INPUT_NEW_CONVERSATION,
    payload: filter,
  })
}

export const searchUsersNewConversation = () => (dispatch, getState) => {
  dispatch({
    type: types.REQUEST_SEARCH_USERS_NEW_CONVERSATION,
    payload: false,
  })

  const org = orgSelector(getState())
  const { page, filterUsers } = newConversationSelector(getState())

  return api
    .getUsers(org.id, { page, pageSize: 50, query: filterUsers })
    .then(({ results }) => {
      dispatch({
        type: types.HANDLE_SEARCH_USERS_NEW_CONVERSATION,
        payload: { users: results },
      })

      dispatch({
        type: types.REQUEST_SEARCH_USERS_NEW_CONVERSATION,
        payload: true,
      })
    })
    .catch(err => dispatch(error(err)))
}
