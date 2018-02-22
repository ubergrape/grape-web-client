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
    .getRooms(org.id, {joined: filter === 'joined'})
    .then((channels) => {
      dispatch({
        type: types.HANDLE_MANAGE_GROUPS_CHANNELS,
        payload: channels
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
