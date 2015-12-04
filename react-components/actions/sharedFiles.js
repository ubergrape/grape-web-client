import find from 'lodash/collection/find'

import reduxEmitter from '../redux-emitter'
import * as types from '../constants/actionTypes'
import rpc from '../backend/rpc'
import {toCamel} from '../backend/convertCase'
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
      items: []
    }
  }
}

export function loadSharedFiles(params) {
  return dispatch => {
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
    }, (err, data) => {
      if (err) reduxEmitter.showError(err)
      dispatch(setSidebarIsLoading(false))
      dispatch({
        type: types.LOADED_SHARED_FILES,
        payload: {
          items: toCamel(data.results).map(file => {
            return formatFile(params.channel, file)
          })
        }
      })
    })
  }
}

export function addAttachments(message) {
  return {
    type: types.ADD_ATTACHMENTS,
    payload: {
      attachments: message.attachments.map(attachment => {
        const file = {...attachment, author: message.author}
        return formatFile(channel, file)
      })
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
/*


    const nextItems = message.attachments.map(attachment => {
      const file = convertCase.toCamel({...attachment, author: message.author})
      return formatFile(this.channel, file)
    })
    let items = [...this.el.props.items, ...nextItems]
    items = sortBy(items, item => -item.time)
    this.setProps({
      items,
      total: this.el.props.total + 1
    })
*/
