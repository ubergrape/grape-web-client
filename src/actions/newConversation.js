import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import { error } from './'

import { orgSelector, newConversationSelector } from '../selectors'

export const onShow = () => ({
  type: types.SHOW_NEW_CONVERSATION,
})

export const onHide = () => ({
  type: types.HIDE_NEW_CONVERSATION,
})

export const onChangeTab = tab => dispatch => {
  dispatch({
    type: types.CHANGE_TAB_NEW_CONVERSATION,
    payload: tab,
  })
}

export const onChangeView = view => dispatch => {
  dispatch({
    type: types.CHANGE_VIEW_NEW_CONVERSATION,
    payload: view,
  })
}

export const onChangeInputUsers = filter => dispatch => {
  dispatch({
    type: types.CHANGE_INPUT_USERS_NEW_CONVERSATION,
    payload: filter,
  })
}

export const onChangeInputGroups = filter => dispatch => {
  dispatch({
    type: types.CHANGE_INPUT_GROUPS_NEW_CONVERSATION,
    payload: filter,
  })
}

const flipLoadingStatus = payload => dispatch => {
  dispatch({
    type: types.REQUEST_SEARCH_NEW_CONVERSATION,
    payload,
  })
}

const handleUsersResults = results => dispatch => {
  dispatch({
    type: types.HANDLE_USERS_SEARCH_NEW_CONVERSATION,
    payload: results,
  })

  dispatch(flipLoadingStatus(true))
}

const handleGroupsResults = results => dispatch => {
  dispatch({
    type: types.HANDLE_GROUPS_SEARCH_NEW_CONVERSATION,
    payload: results,
  })

  dispatch(flipLoadingStatus(true))
}

const loadUsersMembers = () => (dispatch, getState) => {
  const org = orgSelector(getState())
  const { page, filterUsers, isMemberOfEachChannel } = newConversationSelector(
    getState(),
  )

  return api
    .getUsers(org.id, {
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

export const onSearchUsers = () => (dispatch, getState) => {
  dispatch(flipLoadingStatus(false))

  const org = orgSelector(getState())
  const {
    page,
    filterUsers,
    isNotMembersLoaded,
    isMemberOfEachChannel,
  } = newConversationSelector(getState())

  if (isNotMembersLoaded) return dispatch(loadUsersMembers())

  return api
    .getUsers(org.id, {
      page,
      pageSize: 50,
      query: filterUsers,
      membership: false,
    })
    .then(({ results }) => {
      if (!results.length) {
        if (page === 1)
          dispatch({ type: types.HANDLE_MEMBER_OF_EACH_NEW_CONVERSATION })
        dispatch({ type: types.FLIP_TO_MEMBERSHIP_NEW_CONVERSATION })
        dispatch(loadUsersMembers())
        return
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
  const org = orgSelector(getState())
  const { page, filterGroups, isMemberOfEachChannel } = newConversationSelector(
    getState(),
  )

  return api
    .getRooms(org.id, {
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

export const onSearchGroups = () => (dispatch, getState) => {
  dispatch(flipLoadingStatus(false))

  const org = orgSelector(getState())
  const {
    page,
    filterGroups,
    isNotMembersLoaded,
    isMemberOfEachChannel,
  } = newConversationSelector(getState())

  if (isNotMembersLoaded) return dispatch(loadGroupsMembers())

  return api
    .getRooms(org.id, {
      page,
      pageSize: 50,
      query: filterGroups,
      membership: false,
    })
    .then(({ results }) => {
      if (!results.length) {
        if (page === 1)
          dispatch({ type: types.HANDLE_MEMBER_OF_EACH_NEW_CONVERSATION })
        dispatch({ type: types.FLIP_TO_MEMBERSHIP_NEW_CONVERSATION })
        dispatch(loadGroupsMembers())
        return
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

export const onChangeNewRoomColor = color => dispatch => {
  dispatch({
    type: types.CHANGE_NEW_ROOM_COLOR_NEW_CONVERSATION,
    payload: color,
  })
}

export const onChangeNewRoomName = name => dispatch => {
  dispatch({
    type: types.CHANGE_NEW_ROOM_NAME_NEW_CONVERSATION,
    payload: name,
  })
}

export const onChangeNewRoomType = type => dispatch => {
  dispatch({
    type: types.CHANGE_NEW_ROOM_TYPE_NEW_CONVERSATION,
    payload: type,
  })
}

export const onChangeNewRoomDescription = text => dispatch => {
  dispatch({
    type: types.CHANGE_NEW_ROOM_DESCRIPTION_NEW_CONVERSATION,
    payload: text,
  })
}
