import find from 'lodash/collection/find'

import store from '../app/store'
import reduxEmitter from '../redux-emitter'
import * as types from '../constants/actionTypes'
import rpc from '../backend/rpc'
import {sharedFilesSelector} from '../selectors'
import {setSidebarIsLoading} from './common'

export function showSharedFiles() {
  reduxEmitter.showSidebar()
  return {
    type: types.SHOW_SHARED_FILES,
    payload: {
      show: true
    }
  }
}

export function hideSharedFiles() {
  reduxEmitter.hideSidebar()
  return {
    type: types.HIDE_SHARED_FILES,
    payload: {
      show: false,
      items: [],
      total: null
    }
  }
}

export function loadSharedFiles(params) {
  return dispatch => {
    dispatch({type: types.LOAD_SHARED_FILES})
    dispatch(setSidebarIsLoading(true))
    rpc({
      ns: 'search',
      action: 'search_files',
      args: [
        params.orgId,
        params.channel.id,
        params.own,
        params.limit,
        params.offset
      ]
    }, {camelize: true}, (err, res) => {
      if (err) reduxEmitter.showError(err)
      dispatch(setSidebarIsLoading(false))
      const prevItems = sharedFilesSelector(store.getState()).items
      const nextItems = res.results.map(file => {
        return formatFile(params.channel, file)
      })
      dispatch({
        type: types.LOADED_SHARED_FILES,
        payload: {
          items: [...prevItems, ...nextItems],
          total: res.total
        }
      })
    })
  }
}

export function addAttachments(message) {
  const state = sharedFilesSelector(store.getState())
  const items = message.attachments.map(attachment => {
    const file = {...attachment, author: message.author}
    return formatFile(state.channel, file)
  })
  return {
    type: types.ADDED_SHARED_FILE,
    payload: {
      items: [...items, ...state.items]
    }
  }
}

/**
 * Format data for shared files.
 */
function formatFile(channel, file) {
  const author = find(channel.users, ({id}) => id === file.author.id).displayName
  return {
    ...file,
    author,
    channelName: channel.name || channel.users[0].displayName,
    channelType: channel.type,
    id: file.id || file.messageId,
    time: new Date(file.time)
  }
}
