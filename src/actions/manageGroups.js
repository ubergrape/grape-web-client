import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {orgSelector} from '../selectors'
import {error} from './'

export const showManageGroups = () => (dispatch) => {
  dispatch({type: types.SHOW_MANAGE_GROUPS})
}

export const hideManageGroups = () => (dispatch) => {
  dispatch({type: types.HIDE_MANAGE_GROUPS})
}

export const loadManageGroupsChannels = filter => (dispatch, getState) => {
  const org = orgSelector(getState())

  dispatch({
    type: types.REQUEST_MANAGE_GROUPS_CHANNELS,
    payload: filter
  })

  api
    .getRooms(org.id, {membership: filter === 'joined'})
    .then(({results}) => {
      dispatch({
        type: types.HANDLE_MANAGE_GROUPS_CHANNELS,
        payload: results
      })
    })
    .catch(err => dispatch(error(err)))
}

export const selectManageGroupsFilter = filter => (dispatch) => {
  dispatch({
    type: types.SELECT_MANAGE_GROUPS_FILTER,
    payload: filter
  })

  dispatch(loadManageGroupsChannels(filter))
}

export const removeGroupFromManageGroups = id => (dispatch) => {
  dispatch({
    type: types.REMOVE_GROUP_FROM_MANAGE_GROUPS,
    payload: id
  })
}

export const addGroupFromManageGroups = channel => (dispatch) => {
  dispatch({
    type: types.ADD_GROUP_FROM_MANAGE_GROUPS,
    payload: channel
  })
}
