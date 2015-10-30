import React, {Component} from 'react'
import noop from 'lodash/utility/noop'

import {useSheet} from '../jss'
import style from './style'
import Message from '../message/Message'

const dateFormat = 'MMM Do YYYY, h:mm a'

@useSheet(style)
export default class MessageSearch extends Component {
  static defaultProps = {
    items: [],
    total: '',
    show: false,
    onRequestMessages: noop,
    limit: 2,
    query: '',
    minQueryLength: 2
  }

  constructor(props) {
    super(props)
    // offsetDate is always the timestamp of the last loaded message.
    this.offsetDate = ''
  }


  requestMessages(props = this.props) {
    const {query} = props
    if (query.length < props.minQueryLength) return
    props.onRequestMessages({
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

  componentWillReceiveProps(nextProps) {
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
        {this.props.items.map(::this.renderMessage)}
        {this.renderLoadMore()}
      </div>
    )
  }

  renderMessage(item, index) {
    let {classes} = this.props.sheet
    return (
      <div
        className={classes.message}
        onClick={this.onSelect.bind(this, item)}
        key={index}>
        <Message {...item} />
      </div>
    )
  }

  renderLoadMore() {
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
