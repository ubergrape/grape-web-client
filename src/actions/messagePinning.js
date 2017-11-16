import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {channelSelector} from '../selectors'
import {normalizeMessage} from './utils'
import {
  setSidebarIsLoading,
  error
} from './'

export const loadPinnedMessages = () => (dispatch, getState) => {
  dispatch({type: types.REQUEST_PINNED_MESSAGES})
  dispatch(setSidebarIsLoading(true))
  const state = getState()
  const channelId = channelSelector(state).id

  return api
    .loadPinnedMessages(channelId)
    .then(({results, total}) => {
      dispatch(setSidebarIsLoading(false))
      const items = results.map(message => normalizeMessage(message, state))
      dispatch({
        type: types.HANDLE_PINNED_MESSAGES,
        payload: {
          items,
          total
        }
      })
    })
    .catch((err) => {
      dispatch(setSidebarIsLoading(false))
      dispatch(error(err))
    })
}

export const pinMessage = ({channelId, messageId}) => (dispatch) => {
  dispatch({
    type: types.REQUEST_PIN_MESSAGE,
    payload: messageId
  })
  api
    .pinMessage(channelId, messageId)
    .catch(err => dispatch(error(err)))
}

export const unpinMessage = ({channelId, messageId}) => (dispatch) => {
  dispatch({
    type: types.REQUEST_UNPIN_MESSAGE,
    payload: messageId
  })
  api
    .unpinMessage(channelId, messageId)
    .catch(err => dispatch(error(err)))
}
