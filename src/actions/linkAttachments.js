import * as types from '../constants/actionTypes'

export function showRemoveLinkAttachments({id, messageId, url, isAdmin}) {
  return {
    type: types.SHOW_REMOVE_LINK_ATTACHMENT,
    payload: {id, messageId, url, isAdmin}
  }
}

export function hideRemoveLinkAttachments() {
  return {
    type: types.HIDE_REMOVE_LINK_ATTACHMENT
  }
}

export function removeLinkAttachment({messageId, type, url}) {
  return (dispatch) => {
    dispatch({
      type: types.REQUEST_REMOVE_LINK_ATTACHMENT,
      payload: {messageId, type, url}
    })
    // TODO Add rpc call when backend is done
  }
}
