import React, {Component} from 'react'
import noop from 'lodash/utility/noop'
import each from 'lodash/collection/each'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from '../jss'
import style from './style'
import * as utils from './utils'
import Message from '../message/Message'
import SidebarPanel from '../sidebar-panel/SidebarPanel'

@useSheet(style)
export default class MessageSearch extends Component {
  static defaultProps = {
    items: [],
    total: undefined,
    show: false,
    limit: 20,
    query: undefined,
    onSelect: noop,
    onRequest: noop,
    onClose: noop
  }

  constructor(props) {
    super(props)
    // offsetDate is always the timestamp of the last loaded message.
    this.offsetDate = ''
  }

  requestMessages(props = this.props) {
    props.onRequest({
      offsetDate: this.offsetDate,
      limit: props.limit,
      query: props.query
    })
  }

  onLoadMore() {
    this.requestMessages()
  }

  onSelect(item) {
    this.props.onSelect(item)
  }

  onClose() {
    this.props.onClose()
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillReceiveProps(nextProps) {
    const {items} = nextProps
    let needsMessages = false

    if (items.length) {
      this.offsetDate = items[items.length - 1].time
    }
    // It was hidden, we show it now.
    if (nextProps.show && !this.props.show) {
      needsMessages = true
    }

    // Query has changed.
    if (nextProps.query !== this.props.query) {
      this.offsetDate = ''
      needsMessages = true
    }

    if (needsMessages) this.requestMessages(nextProps)
  }

  render() {
    if (!this.props.show) return null
    let {classes} = this.props.sheet
    return (
      <SidebarPanel
        title="Search Results"
        onClose={::this.onClose}>
        <div className={classes.messageSearch}>
          {this.renderMessages()}
          {this.renderLoadMore()}
          {this.renderEmpty()}
        </div>
      </SidebarPanel>
    )
  }

  renderMessages() {
    const {classes} = this.props.sheet
    const grouped = utils.group(this.props.items)
    let elements = []
    each(grouped, (day, date) => {
      elements.push(<div className={classes.date} key={date + elements.length}>{date}</div>)
      each(day, (messages, channel) => {
        elements.push(<div className={classes.channel} key={channel + elements.length}>{channel}</div>)
        elements = elements.concat(messages.map(::this.renderMessage))
      })
    })
    return elements
  }

  renderMessage(item) {
    const {classes} = this.props.sheet
    return (
      <div
        className={classes.message}
        onClick={this.onSelect.bind(this, item)}
        key={item.id}>
        <Message {...item} />
      </div>
    )
  }

  renderLoadMore() {
    if (!this.props.total || this.props.items.length >= this.props.total) return null
    const {classes} = this.props.sheet
    return (
      <div className={classes.loadMoreContainer}>
        <button
          onClick={::this.onLoadMore}
          className={classes.button}>
          Show more
        </button>
      </div>
    )
  }

  renderEmpty() {
    const {classes} = this.props.sheet
    if (this.props.total !== 0) return null
    return (
      <div className={classes.empty}>
        No messages found.
      </div>
    )
  }
}
