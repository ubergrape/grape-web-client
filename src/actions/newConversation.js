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

const requestGroupsNewConversation = payload => ({
  type: types.SET_GROUPS_SEARCH_LOADING_STATE,
  payload,
})

const handleGroupsResults = payload => dispatch => {
  dispatch({
    type: types.HANDLE_GROUPS_SEARCH,
    payload,
  })

  dispatch(requestGroupsNewConversation(false))
}

const loadMembershipGroups = () => (dispatch, getState) => {
  const { id } = orgSelector(getState())
  const {
    groupsQuery,
    groups,
    isMemberOfEachGroup,
    groupsPage,
  } = newConversationSelector(getState())

  api
    .getRooms(id, {
      pageSize: itemsToLoad,
      membership: true,
      page: groupsPage,
      query: groupsQuery,
    })
    .then(({ results }) => {
      if (
        groupsPage === 1 &&
        !groups.length &&
        !results.length &&
        !groupsQuery
      ) {
        dispatch({ type: types.HANDLE_NO_OTHER_GROUPS_IN_ORG })
        return
      }
      if (!groups.length && groupsPage === 1 && !groupsQuery) {
        dispatch({ type: types.HANDLE_NO_GROUPS_LEFT_TO_JOIN })
      }
      if (groupsPage === 1 && results.length && !isMemberOfEachGroup) {
        dispatch(handleGroupsResults([{ isSeparator: true }, ...results]))
        return
      }

      dispatch(handleGroupsResults(results))
    })
    .catch(err => dispatch(error(err)))
}

export const onSearchGroups = () => (dispatch, getState) => {
  const { id } = orgSelector(getState())
  const {
    groupsQuery,
    isGroupsWithMembershipLoading,
    groupsPage,
  } = newConversationSelector(getState())

  dispatch(requestGroupsNewConversation(true))

  if (isGroupsWithMembershipLoading) return dispatch(loadMembershipGroups())

  return api
    .getRooms(id, {
      pageSize: itemsToLoad,
      membership: false,
      page: groupsPage,
      query: groupsQuery,
    })
    .then(({ results }) => {
      dispatch(handleGroupsResults(results))

      if (results.length < itemsToLoad) {
        dispatch({ type: types.REQUEST_MEMBERSHIP_GROUPS_LOADING })
        dispatch(loadMembershipGroups())
      }
    })
    .catch(err => dispatch(error(err)))
}

export const onChangeGroupsQuery = payload => dispatch => {
  dispatch({
    type: types.CHANGE_GROUPS_QUERY,
    payload,
  })

  dispatch(onSearchGroups())
}

const requestPeopleNewConversation = payload => ({
  type: types.SET_PEOPLE_SEARCH_LOADING_STATE,
  payload,
})

const handlePeopleResults = payload => dispatch => {
  dispatch({
    type: types.HANDLE_PEOPLE_SEARCH,
    payload,
  })

  dispatch(requestPeopleNewConversation(false))
}

const loadMembershipPeople = () => (dispatch, getState) => {
  const { id } = orgSelector(getState())
  const { peopleQuery, peoplePage, people } = newConversationSelector(
    getState(),
  )

  api
    .getUsers(id, {
      pageSize: itemsToLoad,
      membership: true,
      page: peoplePage,
      query: peopleQuery,
    })
    .then(({ results }) => {
      // we don't have the information on how many users this organization has
      // if both RPC calls return zero results (with an empty query!),
      // so `people` and `results` arrays are empty, we can assume that there
      // are no other users in this organization.
      if (
        !people.length &&
        peoplePage === 1 &&
        !peopleQuery &&
        !results.length
      ) {
        dispatch({ type: types.HANDLE_NO_OTHER_PEOPLE_IN_ORG })
        return
      }
      // check here if no other people are left to join and not in
      // onSearchPeople
      if (!people.length && !peopleQuery) {
        dispatch({ type: types.HANDLE_NO_PEOPLE_LEFT_TO_JOIN })
      } else if (peoplePage === 1 && results.length) {
        dispatch(handlePeopleResults([{ isSeparator: true }, ...results]))
        return
      }

      dispatch(handlePeopleResults(results))
    })
    .catch(err => dispatch(error(err)))
}

export const onSearchPeople = () => (dispatch, getState) => {
  const { id } = orgSelector(getState())
  const {
    peopleQuery,
    isPeopleWithPmLoading,
    peoplePage,
  } = newConversationSelector(getState())

  dispatch(requestPeopleNewConversation(true))

  if (isPeopleWithPmLoading) return dispatch(loadMembershipPeople())

  return api
    .getUsers(id, {
      pageSize: itemsToLoad,
      membership: false,
      page: peoplePage,
      query: peopleQuery,
    })
    .then(({ results }) => {
      // call handlePeopleResults before loadMembershipPeople, because it
      // updates `people`, which is needed by loadMembershipPeople
      dispatch(handlePeopleResults(results))

      if (results.length < itemsToLoad) {
        dispatch({ type: types.REQUEST_MEMBERSHIP_PEOPLE_LOADING })
        dispatch(loadMembershipPeople())
      }
    })
    .catch(err => dispatch(error(err)))
}

export const onChangePeopleQuery = payload => dispatch => {
  dispatch({
    type: types.CHANGE_PEOPLE_QUERY,
    payload,
  })

  dispatch(onSearchPeople())
}
