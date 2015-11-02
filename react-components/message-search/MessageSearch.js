import React, {Component} from 'react'
import noop from 'lodash/utility/noop'
import each from 'lodash/collection/each'

import {useSheet} from '../jss'
import style from './style'
import * as utils from './utils'
import Message from '../message/Message'

@useSheet(style)
export default class MessageSearch extends Component {
  static defaultProps = {
    items: [],
    total: '',
    show: false,
    onRequest: noop,
    limit: 20,
    query: undefined,
    minQueryLength: 2
  }

  constructor(props) {
    super(props)
    // offsetDate is always the timestamp of the last loaded message.
    this.offsetDate = ''
  }

  requestMessages(props = this.props) {
    const {query} = props
    if (query && query.length < props.minQueryLength) return
    props.onRequest({
      offsetDate: this.offsetDate,
      limit: props.limit,
      query
    })
  }

  onLoadMore() {
    this.requestMessages()
  }

  onSelect(item) {
    this.props.onSelect(item)
  }

  componentWillReceiveProps(nextProps) {
    const {items} = nextProps
    let requestMessages = false

    if (items.length) {
      this.offsetDate = items[items.length - 1].time
    }
    // It was hidden, we show it now.
    if (nextProps.show && !this.props.show) {
      requestMessages = true
    }

    // Query has changed.
    if (nextProps.query !== this.props.query) {
      this.offsetDate = ''
      requestMessages = true
    }

    if (requestMessages) this.requestMessages(nextProps)
  }

  render() {
    if (!this.props.show) return null
    let {classes} = this.props.sheet
    return (
      <div className={classes.messageSearch}>
        {this.renderMessages()}
        {this.renderLoadMore()}
      </div>
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
}
