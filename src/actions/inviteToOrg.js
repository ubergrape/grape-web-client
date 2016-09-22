import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {orgSelector} from '../selectors'
import {error} from './common'

export function showInviteToOrg() {
  return {
    type: types.SHOW_INVITE_TO_ORG
  }
}

export function hideInviteToOrg() {
  return {
    type: types.HIDE_INVITE_TO_ORG
  }
}

export function getInviteToOrgLink() {
  return (dispatch, getState) => {
    api
      .getInviteToOrgLink(orgSelector(getState()).id)
      .then(link => {
        dispatch({
          type: types.SET_INVITE_TO_ORG_LINK,
          payload: link
        })
      })
      .catch(err => dispatch(error(err)))
  }
}

export function inviteToOrg(settings) {
  return (dispatch, getState) => {
    api
      .inviteToOrg(orgSelector(getState()).id, settings)
      .then(() => {
        dispatch({type: types.HANDLE_INVITE_TO_ORG_SUCCESS})
      })
      .catch(err => {
        dispatch({
          type: types.HANDLE_INVITE_TO_ORG_ERROR,
          payload: err
        })
      })
  }
}

export function clearInviteToOrgError() {
  return {
    type: types.CLEAR_INVITE_TO_ORG_ERROR
  }
}

export function clearJustInvited() {
  return {
    type: types.CLEAR_JUST_INVITED_TO_ORG
  }
}
