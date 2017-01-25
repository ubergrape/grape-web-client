import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {orgSelector} from '../selectors'
import {error} from './common'
import {showToastNotification} from './toastNotification'


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

export function inviteToOrg({getSuccessMessage, ...rest}) {
  return (dispatch, getState) => {
    api
      .inviteToOrg(orgSelector(getState()).id, rest)
      .then(({emails}) => {
        dispatch(hideInviteToOrg())
        dispatch(showToastNotification(getSuccessMessage({invited: emails})))
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
