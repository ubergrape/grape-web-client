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

export const onClickMultipleInputCreateRoom = isFocused => dispatch => {
  dispatch({
    type: types.CHANGE_MULTIPLE_INPUT_FOCUS_CREATE_ROOM,
    payload: isFocused,
  })
}

export const onChangeFilterCreateRoom = text => dispatch => {
  dispatch({
    type: types.CHANGE_FILTER_CREATE_ROOM,
    payload: text,
  })
}

export const onClickCheckedStatusCreateRoom = user => dispatch => {
  dispatch({
    type: types.CHANGE_CHECKED_STATUS_CREATE_ROOM,
    payload: user,
  })
}

const normilizeUsers = users => users.map(user => ({ ...user, checked: false }))

export const onSearchUsersCreateRoom = () => (dispatch, getState) => {
  const { id } = orgSelector(getState())
  const { page, filter } = createRoomSelector(getState())

  return api
    .getUsers(id, {
      page,
      pageSize: 50,
      query: filter,
    })
    .then(({ results }) => {
      dispatch({
        type: types.HANDLE_USERS_SEARCH_CREATE_ROOM,
        payload: normilizeUsers(results),
      })
    })
    .catch(err => dispatch(error(err)))
}

export const onCreateRoom = () => (dispatch, getState) => {
  const { id: organization } = orgSelector(getState())
  const { name, description, isPublic, users } = createRoomSelector(getState())

  api
    .createRoom({
      name,
      organization,
      description,
      isPublic,
      users: users.filter(({ checked }) => checked).map(({ email }) => email),
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
