import * as api from '../utils/backend/api'
import * as types from '../constants/actionTypes'
import { itemsToLoad } from '../constants/navigation'
import { error } from './'

import { newConversationSelector, orgSelector } from '../selectors'

export const showNewConversation = () => {
  return {
    type: types.SHOW_NEW_CONVERSATION,
  }
}

export const hideNewConversation = () => ({
  type: types.HIDE_NEW_CONVERSATION,
})

export const setNewConversationTab = payload => ({
  type: types.SET_NEW_CONVERSATION_TAB,
  payload,
})

const requestGroupsNewConversation = payload => {
  return {
    type: types.REQUEST_GROUPS_SEARCH_NEW_CONVERSATION,
    payload,
  }
}

const handleGroupsResults = payload => dispatch => {
  dispatch({
    type: types.HANDLE_GROUPS_SEARCH_NEW_CONVERSATION,
    payload,
  })

  dispatch(requestGroupsNewConversation(false))
}

const loadMembershipGroups = () => (dispatch, getState) => {
  const { id } = orgSelector(getState())
  const { groupsQuery, isMemberOfEachGroup, page } = newConversationSelector(
    getState(),
  )

  api
    .getRooms(id, {
      pageSize: itemsToLoad,
      membership: true,
      page,
      query: groupsQuery,
    })
    .then(({ results }) => {
      if (page === 1 && results.length && !isMemberOfEachGroup) {
        dispatch(
          handleGroupsResults([{ text: 'Groups you belong to' }, ...results]),
        )
        return
      }

      dispatch(handleGroupsResults(results))
    })
    .catch(err => dispatch(error(err)))
}

export const onSearchGroupsNewConversation = () => (dispatch, getState) => {
  const { id } = orgSelector(getState())
  const {
    groupsQuery,
    isMembershipGroupsLoading,
    page,
  } = newConversationSelector(getState())

  dispatch(requestGroupsNewConversation(true))

  if (isMembershipGroupsLoading) return dispatch(loadMembershipGroups())

  return api
    .getRooms(id, {
      pageSize: itemsToLoad,
      membership: false,
      page,
      query: groupsQuery,
    })
    .then(({ results }) => {
      if (results.length < itemsToLoad) {
        if (!results.length && page === 1) {
          dispatch({ type: types.HANDLE_NO_GROUPS_LEFT_TO_JOIN })
        }
        dispatch({ type: types.REQUEST_MEMBERSHIP_GROUPS_LOADING })
        dispatch(loadMembershipGroups())
      }

      dispatch(handleGroupsResults(results))
    })
    .catch(err => dispatch(error(err)))
}

export const onChangeGroupsQueryNewConversation = query => dispatch => {
  dispatch({
    type: types.CHANGE_QUERY_GROUPS_NEW_CONVERSATION,
    payload: query,
  })

  dispatch(onSearchGroupsNewConversation())
}
