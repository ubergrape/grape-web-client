import Emitter from 'emitter'
import page from 'page'

import {images} from '../constants'
import {formatMessage} from '../utils/sidebar'
import '../../../react-components/message-search'

export default class MessageSearch extends Emitter {
  constructor() {
    super()
    this.el = document.createElement('grape-message-search')
    this.el.props = {
      title: 'Search Results',
      images,
      onRequest: ::this.onRequest,
      onSelect: ::this.onSelect,
      onClose: ::this.onHide
    }
    this.lastMessages = null
    this.lastMessagesQuery = null
    this.lastMessagesTotal = null
  }

  setProps(props) {
    this.el.props = {
      ...this.el.props,
      ...props
    }
  }

  onPayload(data) {
    let messages = data.results.map(formatMessage)

    // Its a "load more", add previous messages before.
    if (this.lastMessagesQuery === data.query) {
      messages = [...this.lastMessages, ...messages]
    }
    // Only query without offset delivers overall total amount.
    else {
      this.lastMessagesTotal = data.offsetTotal
      this.lastMessagesQuery = data.query
    }
    this.lastMessages = messages
    this.setProps({
      items: messages,
      total: this.lastMessagesTotal,
      isLoading: false
    })
  }

  onRequest(params) {
    this.setProps({isLoading: true})
    this.emit('search', params)
  }

  onSelect(message) {
    page(`/chat/${message.slug}/${message.id}`)
  }

  onSearch({query}) {
    // Results needs to be removed.
    const {items} = this.el.props
    if ((!query || query.length < 2) && items && items.length) {
      this.setProps({
        items: [],
        total: null
      })
      return
    }
    this.setProps({query})
  }

  /**
   * Show request from outside.
   */
  onShow({type}) {
    if (type !== 'messageSearch') return
    this.setProps({show: true})
    this.emit('show')
  }

  /**
   * Hide request from outside.
   */
  onHide() {
    if (!this.el.props.show) return
    this.setProps({show: false})
    this.emit('hide')
  }
}
