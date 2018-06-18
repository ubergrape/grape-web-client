import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {orgSelector, manageGroupsSelector} from '../selectors'
import {error} from './'

export const showManageGroups = () => (dispatch) => {
  dispatch({type: types.SHOW_MANAGE_GROUPS})
}

export const hideManageGroups = () => (dispatch) => {
  dispatch({type: types.HIDE_MANAGE_GROUPS})
}

export const loadManageGroupsChannels = () => (dispatch, getState) => {
  const org = orgSelector(getState())

  dispatch({ type: types.REQUEST_MANAGE_GROUPS_CHANNELS })
  dispatch({ type: types.INCREMENT_MANAGE_GROUPS_PAGE })

  const { page, activeFilter } = manageGroupsSelector(getState())

  return api
    .getRooms(org.id, {membership: activeFilter === 'joined', page, pageSize: 50})
    .then(({ results }) => {
      if (results) {
        dispatch({
          type: types.HANDLE_MANAGE_GROUPS_CHANNELS,
          payload: results
        })
      }
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
