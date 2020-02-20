import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import { error } from './'

import { orgSelector, newConversationSelector } from '../selectors'

export const onShowNewConversation = () => ({
  type: types.SHOW_NEW_CONVERSATION,
})

export const onHideNewConversation = () => ({
  type: types.HIDE_NEW_CONVERSATION,
})

export const onChangeTabNewConversation = tab => dispatch => {
  dispatch({
    type: types.CHANGE_TAB_NEW_CONVERSATION,
    payload: tab,
  })
}

export const onChangeViewNewConversation = view => dispatch => {
  dispatch({
    type: types.CHANGE_VIEW_NEW_CONVERSATION,
    payload: view,
  })
}

export const onChangeUsersFilterNewConversation = filter => dispatch => {
  dispatch({
    type: types.CHANGE_FILTER_USERS_NEW_CONVERSATION,
    payload: filter,
  })
}

export const onChangeGroupsFilterNewConversation = filter => dispatch => {
  dispatch({
    type: types.CHANGE_FILTER_GROUPS_NEW_CONVERSATION,
    payload: filter,
  })
}

const flipNewConversationUsersLoadingStatus = payload => dispatch => {
  dispatch({
    type: types.REQUEST_USERS_SEARCH_NEW_CONVERSATION,
    payload,
  })
}

const flipNewConversationGroupsLoadingStatus = payload => dispatch => {
  dispatch({
    type: types.REQUEST_GROUPS_SEARCH_NEW_CONVERSATION,
    payload,
  })
}

const handleUsersResults = results => dispatch => {
  dispatch({
    type: types.HANDLE_USERS_SEARCH_NEW_CONVERSATION,
    payload: results,
  })

  dispatch(flipNewConversationUsersLoadingStatus(true))
}

const handleGroupsResults = results => dispatch => {
  dispatch({
    type: types.HANDLE_GROUPS_SEARCH_NEW_CONVERSATION,
    payload: results,
  })

  dispatch(flipNewConversationGroupsLoadingStatus(true))
}

const loadUsersMembers = () => (dispatch, getState) => {
  const { id } = orgSelector(getState())
  const { page, filterUsers, isMemberOfEachChannel } = newConversationSelector(
    getState(),
  )

  return api
    .getUsers(id, {
      page,
      pageSize: 50,
      query: filterUsers,
      membership: true,
    })
    .then(({ results }) => {
      if (page === 1 && results.length) {
        if (isMemberOfEachChannel) {
          dispatch(handleUsersResults(results))
          return
        }

        dispatch(
          handleUsersResults([
            { text: 'People you already have a conversation with' },
            ...results,
          ]),
        )
        return
      }

      dispatch(handleUsersResults(results))
    })
    .catch(err => dispatch(error(err)))
}

export const onSearchUsersNewConversation = () => (dispatch, getState) => {
  const { id } = orgSelector(getState())
  const {
    page,
    users,
    filterUsers,
    isMembersNotLoaded,
    isMemberOfEachChannel,
  } = newConversationSelector(getState())

  if (!users.length) dispatch(flipNewConversationUsersLoadingStatus(false))

  if (isMembersNotLoaded) return dispatch(loadUsersMembers())

  return api
    .getUsers(id, {
      page,
      pageSize: 50,
      query: filterUsers,
      membership: false,
    })
    .then(({ results }) => {
      const { filterUsers: filter } = newConversationSelector(getState())
      if (filter !== filterUsers) return

      if (results.length < 50) {
        if (page === 1 && !filterUsers)
          dispatch({ type: types.HANDLE_MEMBER_OF_EACH_NEW_CONVERSATION })
        dispatch({ type: types.FLIP_TO_MEMBERSHIP_NEW_CONVERSATION })
        dispatch(loadUsersMembers())
      }

      if (page === 1 && results.length) {
        if (isMemberOfEachChannel) {
          dispatch(handleUsersResults(results))
          return
        }

        dispatch(
          handleUsersResults([
            { text: 'People you can start a new conversation with' },
            ...results,
          ]),
        )
        return
      }

      dispatch(handleUsersResults(results))
    })
    .catch(err => dispatch(error(err)))
}

const loadGroupsMembers = () => (dispatch, getState) => {
  const { id } = orgSelector(getState())
  const { page, filterGroups, isMemberOfEachChannel } = newConversationSelector(
    getState(),
  )

  return api
    .getRooms(id, {
      page,
      pageSize: 50,
      query: filterGroups,
      membership: true,
    })
    .then(({ results }) => {
      if (page === 1 && results.length) {
        if (isMemberOfEachChannel) {
          dispatch(handleGroupsResults(results))
          return
        }
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
    page,
    groups,
    filterGroups,
    isMembersNotLoaded,
    isMemberOfEachChannel,
  } = newConversationSelector(getState())

  if (!groups.length) dispatch(flipNewConversationGroupsLoadingStatus(false))

  if (isMembersNotLoaded) return dispatch(loadGroupsMembers())

  return api
    .getRooms(id, {
      page,
      pageSize: 50,
      query: filterGroups,
      membership: false,
    })
    .then(({ results }) => {
      const { filterGroups: filter } = newConversationSelector(getState())
      if (filter !== filterGroups) return

      if (results.length < 50) {
        if (page === 1 && !filterGroups)
          dispatch({ type: types.HANDLE_MEMBER_OF_EACH_NEW_CONVERSATION })
        dispatch({ type: types.FLIP_TO_MEMBERSHIP_NEW_CONVERSATION })
        dispatch(loadGroupsMembers())
      }

      if (page === 1 && results.length) {
        if (isMemberOfEachChannel) {
          dispatch(handleGroupsResults(results))
          return
        }
        dispatch(
          handleGroupsResults([{ text: 'Groups you can join' }, ...results]),
        )
        return
      }

      dispatch(handleGroupsResults(results))
    })
    .catch(err => dispatch(error(err)))
}
