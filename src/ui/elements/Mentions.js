import Emitter from 'emitter'
import page from 'page'
import sortBy from 'lodash/collection/sortBy'
import isEmpty from 'lodash/lang/isEmpty'
import pluck from 'lodash/collection/pluck'
import intersection from 'lodash/array/intersection'

import {images} from '../constants'
import '../../../react-components/mentions'

export default class Mentions extends Emitter {
  constructor() {
    super()
    this.el = document.createElement('grape-mentions')
    this.el.props = {
      title: 'Mentions',
      items: [],
      images,
      onRequest: ::this.onRequest,
      onSelect: ::this.onSelect,
      onClose: ::this.onHide
    }
    this.total = null
  }

  setProps(props) {
    this.el.props = {
      ...this.el.props,
      ...props
    }
  }

  onPayload(data) {
    let messages = data.results.map(formatMessage)
    messages = [...this.el.props.items, ...messages]
    if (!data.offsetDate) this.total = data.offsetTotal
    this.setProps({
      items: messages,
      total: this.total,
      isLoading: false
    })
  }

  onMessage(message) {
    const mentioned = isMentioned(message.mentions, this.user.id, this.org.rooms)
    if (!mentioned) return

    let messages = [...this.el.props.items]
    messages.push(formatMessage(message))

    // Ensure the right order because we pushed a message from pubsub.
    messages = sortBy(messages, _message => _message.time * -1)
    this.total++

    this.setProps({
      items: messages,
      total: this.total
    })
  }

  onSetUser(user) {
    this.user = user
  }

  onOrgReady(org) {
    this.org = org
  }

  onError(err) {
    // TODO
    console.log(err)
  }

  onRequest(params) {
    this.setProps({isLoading: true})
    this.emit('load', params)
  }

  onSelect(message) {
    page(`/chat/${message.slug}/${message.id}`)
  }

  /**
   * Show or hide request from outside.
   */
  onShow({type}) {
    if (type !== 'mentions') return
    this.setProps({show: true, query: this.user.slug})
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

/**
 * Format a message for rendering.
 */
function formatMessage(message) {
  return {
    id: message.id,
    channel: message.channel.name ? message.channel.name : message.channel.users[0].displayName,
    author: message.author.displayName,
    avatar: message.author.avatar,
    time: message.time,
    content: message.text,
    slug: message.channel.slug ? message.channel.slug : message.channel.users[0].slug
  }
}

/**
 * Find out if mentions match user id when user mention
 * or when channel mention - matches one of the channel user has joined.
 */
function isMentioned(mentions, userId, channels) {
  if (isEmpty(mentions)) return false

  let mentioned = false

  if (mentions.user) {
    mentioned = mentions.user.some(_userId => userId === _userId)
    if (mentioned) return true
  }

  if (mentions.room) {
    const joinedChannels = channels.filter(channel => channel.joined)
    const joinedChannelIds = pluck(joinedChannels, 'id')
    mentioned = intersection(mentions.room, joinedChannelIds).length > 0
  }

  return mentioned
}
