import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import { channelSelector } from '../selectors'
import { error } from './'

export function showChannelMembersInvite() {
  return {
    type: types.SHOW_CHANNEL_MEMBERS_INVITE,
  }
}

export function hideChannelMembersInvite() {
  return {
    type: types.HIDE_CHANNEL_MEMBERS_INVITE,
  }
}

export function addToChannelMembersInvite(user) {
  return {
    type: types.ADD_TO_CHANNEL_MEMBERS_INVITE,
    payload: user,
  }
}

export function removeFromChannelMembersInvite(user) {
  return {
    type: types.REMOVE_FROM_CHANNEL_MEMBERS_INVITE,
    payload: user,
  }
}

export const searchUsersToInvite = search => (dispatch, getState) => {
  dispatch({
    type: types.FILTER_CHANNEL_MEMBERS_INVITE,
    payload: search,
  })

  api
    .searchUsersForRoom({
      channelId: channelSelector(getState()).id,
      search,
      limit: 50,
    })
    .then(({ results }) => {
      dispatch({
        type: types.FOUND_USERS_TO_INVITE,
        payload: results,
      })
    })
    .catch(err => {
      dispatch(error(err))
    })
}
