import * as api from '../utils/backend/api'
import * as types from '../constants/actionTypes'
import { itemsToLoad } from '../constants/navigation'
import { createRoomSelector, orgSelector } from '../selectors'
import { goToChannel, hideNewConversation, error } from './'

export const showCreateRoom = () => ({
  type: types.SHOW_CREATE_ROOM,
})

export const hideCreateRoom = () => ({
  type: types.HIDE_CREATE_ROOM,
})

export const setIsPrivate = () => ({
  type: types.SET_IS_PRIVATE,
})

export const onGroupNameChange = payload => ({
  type: types.HANDLE_GROUP_NAME_CHANGE,
  payload,
})

export const onGroupDescriptionChange = payload => ({
  type: types.HANDLE_GROUP_DESCRIPTION_CHANGE,
  payload,
})

const requestMembersNewConversation = payload => ({
  type: types.REQUEST_MEMBERS_SEARCH,
  payload,
})

export const onSearchMembers = () => (dispatch, getState) => {
  const { id } = orgSelector(getState())
  const { membersQuery, page } = createRoomSelector(getState())

  dispatch(requestMembersNewConversation(true))

  api
    .getUsers(id, {
      query: membersQuery,
      page,
      pageSize: itemsToLoad,
    })
    .then(({ results }) => {
      dispatch({
        type: types.HANDLE_MEMBERS_SEARCH,
        payload: results,
      })

      dispatch(requestMembersNewConversation(false))
    })
    .catch(err => {
      dispatch(error(err))
    })
}

export const onChangeMembersQuery = payload => dispatch => {
  dispatch({
    type: types.CHANGE_MEMBERS_QUERY,
    payload,
  })

  dispatch(onSearchMembers())
}

export const onMemberSelect = payload => dispatch => {
  dispatch({
    type: types.HANDLE_MEMBER_SELECT,
    payload,
  })
}

export const onMemberRemove = payload => dispatch => {
  dispatch({
    type: types.HANDLE_MEMBER_REMOVE,
    payload,
  })
}

export const onCreateRoom = payload => (dispatch, getState) => {
  dispatch({
    type: types.REQUEST_CREATE_ROOM,
    payload,
  })

  const { id } = orgSelector(getState())
  const { name, description, isPrivate, selectedMembers } = createRoomSelector(
    getState(),
  )

  api
    .createRoom({
      name,
      organization: id,
      description,
      isPublic: !isPrivate,
      users: selectedMembers.map(({ id: _id }) => _id),
    })
    .then(({ id: channelId }) => {
      dispatch(hideNewConversation())
      dispatch(goToChannel(channelId))
    })
    .catch(err => {
      if (err.message === 'Name must not be empty') {
        dispatch({
          type: types.HANDLE_EMPTY_GROUP_NAME_ERROR,
          payload: err.message,
        })
      }
      dispatch(error(err))
    })
}
