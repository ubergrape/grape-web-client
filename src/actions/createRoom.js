import { find } from 'lodash'

import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import { error, joinChannel, goToChannel, onHideNewConversation } from './'

import { orgSelector, createRoomSelector } from '../selectors'

export const onChangeNameCreateRoom = name => dispatch => {
  dispatch({
    type: types.CHANGE_NAME_CREATE_ROOM,
    payload: name,
  })
}

export const onChangeColorCreateRoom = color => dispatch => {
  dispatch({
    type: types.CHANGE_COLOR_CREATE_ROOM,
    payload: color,
  })
}

export const onChangeTypeCreateRoom = type => dispatch => {
  dispatch({
    type: types.CHANGE_TYPE_CREATE_ROOM,
    payload: type,
  })
}

export const onChangeDescriptionCreateRoom = text => dispatch => {
  dispatch({
    type: types.CHANGE_DESCRIPTION_CREATE_ROOM,
    payload: text,
  })
}

export const onChangeFilterCreateRoom = text => dispatch => {
  dispatch({
    type: types.CHANGE_FILTER_CREATE_ROOM,
    payload: text,
  })
}

export const onAddMemberCreateRoom = user => dispatch => {
  dispatch({
    type: types.ADD_MEMBER_CREATE_ROOM,
    payload: user,
  })
}

export const onDeleteMemberCreateRoom = id => dispatch => {
  dispatch({
    type: types.DELETE_MEMBER_CREATE_ROOM,
    payload: id,
  })
}

const normilizeUsers = (users, pickedUsers) => {
  return users.map(user => {
    if (find(pickedUsers, { id: user.id })) {
      return {
        ...user,
        checked: true,
      }
    }

    return {
      ...user,
      checked: false,
    }
  })
}

const flipCreateRoomUsersLoadingStatus = payload => dispatch => {
  dispatch({
    type: types.REQUEST_USERS_SEARCH_CREATE_ROOM,
    payload,
  })
}

export const onSearchUsersCreateRoom = () => (dispatch, getState) => {
  const { id } = orgSelector(getState())
  const { page, pickedUsers, users, filter } = createRoomSelector(getState())

  if (!users.length) dispatch(flipCreateRoomUsersLoadingStatus(false))

  return api
    .getUsers(id, {
      page,
      pageSize: 50,
      query: filter,
    })
    .then(({ results }) => {
      dispatch({
        type: types.HANDLE_USERS_SEARCH_CREATE_ROOM,
        payload: normilizeUsers(results, pickedUsers),
      })

      dispatch(flipCreateRoomUsersLoadingStatus(true))
    })
    .catch(err => dispatch(error(err)))
}

export const onCreateRoom = () => (dispatch, getState) => {
  const { id: organization } = orgSelector(getState())
  const { name, description, isPublic, pickedUsers } = createRoomSelector(
    getState(),
  )

  api
    .createRoom({
      name,
      organization,
      description,
      isPublic,
      users: pickedUsers.map(({ email }) => email),
    })
    .then(room => {
      dispatch(joinChannel(room.id))
      dispatch(goToChannel(room.id))
      dispatch(onHideNewConversation())
    })
    .catch(err => {
      dispatch({
        type: types.HANDLE_ERROR_CREATE_ROOM,
        payload: err.message,
      })
    })
}
