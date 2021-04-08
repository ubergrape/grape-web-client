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
  type: types.REQUEST_GROUPS_SEARCH,
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
    isMemberOfEachGroup,
    groupsPage,
  } = newConversationSelector(getState())

  api
    .getRooms(id, {
      pageSize: itemsToLoad,
      membership: true,
      groupsPage,
      query: groupsQuery,
    })
    .then(({ results }) => {
      if (groupsPage === 1 && results.length && !isMemberOfEachGroup) {
        dispatch(
          handleGroupsResults([{ text: 'Groups you belong to' }, ...results]),
        )
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
      groupsPage,
      query: groupsQuery,
    })
    .then(({ results }) => {
      if (results.length < itemsToLoad) {
        if (!results.length && groupsPage === 1) {
          dispatch({ type: types.HANDLE_NO_GROUPS_LEFT_TO_JOIN })
        }
        dispatch({ type: types.REQUEST_MEMBERSHIP_GROUPS_LOADING })
        dispatch(loadMembershipGroups())
      }

      dispatch(handleGroupsResults(results))
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
  type: types.REQUEST_PEOPLE_SEARCH,
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
  const {
    peopleQuery,
    isInPmWithEveryPerson,
    peoplePage,
  } = newConversationSelector(getState())

  api
    .getUsers(id, {
      pageSize: itemsToLoad,
      membership: true,
      peoplePage,
      query: peopleQuery,
    })
    .then(({ results }) => {
      if (!results.length && peoplePage === 1 && !peopleQuery) {
        dispatch({ type: types.HANDLE_NO_OTHER_PEOPLE_IN_ORG })
        return
      }
      if (peoplePage === 1 && results.length && !isInPmWithEveryPerson) {
        dispatch(
          handlePeopleResults([
            { text: 'People you already have a conversation with' },
            ...results,
          ]),
        )
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
      peoplePage,
      query: peopleQuery,
    })
    .then(({ results }) => {
      if (results.length < itemsToLoad) {
        if (!results.length && peoplePage === 1) {
          dispatch({ type: types.HANDLE_NO_PEOPLE_LEFT_TO_JOIN })
        }
        dispatch({ type: types.REQUEST_MEMBERSHIP_PEOPLE_LOADING })
        dispatch(loadMembershipPeople())
      }

      dispatch(handlePeopleResults(results))
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
