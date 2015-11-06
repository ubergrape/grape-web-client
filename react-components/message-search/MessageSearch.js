import React, {Component} from 'react'
import noop from 'lodash/utility/noop'
import each from 'lodash/collection/each'
import {shouldPureComponentUpdate} from 'react-pure-render'
import tz from 'moment-timezone'

import findMatches from 'grape-web/lib/search/findMatches'
import Spinner from 'grape-web/lib/spinner/Spinner'
import {useSheet} from 'grape-web/lib/jss'
import style from './style'
import * as utils from './utils'
import Message from '../message/Message'
import SidebarPanel from '../sidebar-panel/SidebarPanel'

const dateFormat = 'MMM Do, YYYY'

@useSheet(style)
export default class MessageSearch extends Component {
  static defaultProps = {
    title: undefined,
    items: [],
    total: undefined,
    show: false,
    limit: 20,
    query: undefined,
    isLoading: false,
    images: {},
    onSelect: noop,
    onRequest: noop,
    onClose: noop
  }

  constructor(props) {
    super(props)
  }

  requestMessages(props = this.props) {
    if (!props.query) return
    const {items} = props
    props.onRequest({
      // Is always the timestamp of the last loaded message.
      offsetDate: items.length ? items[items.length - 1].time : '',
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
    let needsMessages = false

    // It was hidden, we show it now.
    if (nextProps.show && !this.props.show) {
      needsMessages = true
    }

    // Query has changed.
    if (nextProps.query && nextProps.query !== this.props.query) {
      needsMessages = true
    }

    if (needsMessages) this.requestMessages(nextProps)
  }

  render() {
    if (!this.props.show) return null
    let {classes} = this.props.sheet
    return (
      <SidebarPanel
        title={this.props.title}
        images={this.props.images}
        onClose={::this.onClose}>
        <div className={classes.messageSearch}>
          {this.renderMessages()}
          {this.renderLoadMore()}
          {this.renderEmpty()}
          {this.props.isLoading && <Spinner image={this.props.images.spinner} />}
        </div>
      </SidebarPanel>
    )
  }

  renderMessages() {
    const {classes} = this.props.sheet
    const items = this.props.items.map(item => {
      const matches = findMatches(item.body, this.props.query)
      let {body} = item
      if (matches.length) {
        body = matches.map((match, key) => {
          return (
            <span
              key={key}
              className={match.found ? classes.highlighted : null}>
              {match.text}
            </span>
          )
        })
      }
      return {...item, body}
    })
    const grouped = utils.group(items)

    let elements = []
    each(grouped, (day, date) => {
      elements.push(<div className={classes.date} key={date + elements.length}>{tz(date).format(dateFormat)}</div>)
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
