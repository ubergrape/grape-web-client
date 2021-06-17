import * as types from '../constants/actionTypes'
import { removeLinkAttachments } from '../utils/backend/api'

export function showRemoveLinkAttachments({
  channelId,
  messageId,
  url,
  isAdmin,
}) {
  return {
    type: types.SHOW_REMOVE_LINK_ATTACHMENT,
    payload: { channelId, messageId, url, isAdmin },
  }
}

export function hideRemoveLinkAttachments() {
  return {
    type: types.HIDE_REMOVE_LINK_ATTACHMENT,
  }
}

export function removeLinkAttachment({ channelId, messageId, url, type }) {
  return dispatch => {
    dispatch({
      type: types.REQUEST_REMOVE_LINK_ATTACHMENT,
      payload: { channelId, messageId, url, type },
    })

    removeLinkAttachments(channelId, messageId, url, type)
  }
}
