import Emitter from 'emitter'
import sortBy from 'lodash/collection/sortBy'

import {images} from '../constants'
import '../../../react-components/shared-files'

export default class SharedFiles extends Emitter {
  constructor() {
    super()
    this.el = document.createElement('grape-shared-files')
    this.el.props = {
      images,
      items: [],
      onRequest: ::this.onRequest,
      onClose: ::this.onHide
    }
    this.type = null
  }

  setProps(props) {
    this.el.props = {
      ...this.el.props,
      ...props
    }
  }

  onPayload(data) {
    const nextItems = data.results.map(file => formatFile(this.channel, file))
    let items = [...this.el.props.items, ...nextItems]
    this.setProps({
      items,
      total: data.total,
      isLoading: false
    })
  }

  onMessage(message) {
    const nextItems = message.attachments.map(attachment => {
      return formatFile(this.channel, {...attachment, author: message.author})
    })
    let items = [...this.el.props.items, ...nextItems]
    items = sortBy(items, item => -item.time)
    this.setProps({
      items,
      total: this.el.props.total + 1
    })
  }

  onSelectChannel(channel) {
    this.channel = channel
    if (this.type === 'sharedFiles') {
      this.setProps({
        items: [],
        total: null
      })
    }
  }

  onError(err) {
    // TODO
    console.log(err)
  }

  onRequest(params) {
    this.setProps({isLoading: true})
    this.emit('search', {...params, channel: this.channel.id})
  }

  /**
   * Show or hide request from outside.
   */
  onShow({type}) {
    this.type = type
    if (type !== 'sharedFiles') return
    this.setProps({show: true})
    this.emit('show')
  }

  /**
   * Hide request from outside.
   */
  onHide() {
    if (!this.el.props.show) return
    this.type = null
    this.setProps({show: false})
    this.emit('hide')
  }
}

/**
 * Format data for shared files.
 */
function formatFile(channel, file) {
  let author = find(channel.users, ({id}) => id === file.author.id).displayName
  return {
    ...file,
    author,
    channelName: channel.name,
    id: file.id || file.messageId,
    time: new Date(file.time)
  }
}
