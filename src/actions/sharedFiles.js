import find from 'lodash/collection/find'

import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {setSidebarIsLoading, error} from './common'
import {
  sharedFilesSelector,
  orgSelector,
  channelSelector,
  usersSelector
} from '../selectors'

/**
 * Format data for shared files.
 */
function formatFile(file, channel, users) {
  const author = find(users, ({id}) => id === file.author.id)
  return {
    ...file,
    author: author ? author.displayName : undefined,
    // If we are in pm channel, there is no channel name, we use the other user
    // name as a channel name.
    channelName: channel.name || channel.users[0].displayName,
    channelType: channel.type,
    id: file.id || file.messageId,
    time: new Date(file.time)
  }
}

export function loadSharedFiles(params) {
  return (dispatch, getState) => {
    dispatch({type: types.LOAD_SHARED_FILES})
    dispatch(setSidebarIsLoading(true))
    const state = getState()
    const org = orgSelector(state)
    const channel = channelSelector(state)

    api
      .searchFiles({
        orgId: org.id,
        channelId: channel.id,
        ...params
      })
      .then((files) => {
        dispatch(setSidebarIsLoading(false))
        const prevItems = sharedFilesSelector(state).items
        const users = usersSelector(state)
        const nextItems = files.results.map(file => formatFile(file, channel, users))
        dispatch({
          type: types.LOADED_SHARED_FILES,
          payload: {
            items: [...prevItems, ...nextItems],
            total: files.total
          }
        })
      })
      .catch((err) => {
        dispatch(setSidebarIsLoading(false))
        dispatch(error(err))
      })
  }
}

export function addSharedFiles(message) {
  return (dispatch, getState) => {
    const state = getState()
    const channel = channelSelector(state)
    const users = usersSelector(state)
    const sharedFiles = sharedFilesSelector(state)
    const prevItems = sharedFiles.items
    const nextItems = message.attachments.map((attachment) => {
      const file = {
        ...attachment,
        author: message.author,
        messageId: message.id
      }
      return formatFile(file, channel, users)
    })
    dispatch({
      type: types.ADD_SHARED_FILE,
      payload: {
        items: [...nextItems, ...prevItems],
        total: sharedFiles.total - 1
      }
    })
  }
}

export function removeSharedFiles(messageId) {
  return (dispatch, getState) => {
    const sharedFiles = sharedFilesSelector(getState())
    const {items} = sharedFiles
    const cleanedItems = items.filter(item => item.messageId !== messageId)

    // Nothing to remove.
    if (cleanedItems.length === items.length) return

    dispatch({
      type: types.REMOVE_SHARED_FILE,
      payload: {
        items: cleanedItems,
        total: sharedFiles.total - 1
      }
    })
  }
}
