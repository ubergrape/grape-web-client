import React, {Component} from 'react'
import List from 'react-finite-list'
import noop from 'lodash/utility/noop'
import tz from 'moment-timezone'

import {useSheet} from '../jss'
import style from './style'

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
    console.log(item)
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
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

  renderMessages() {
    let {items} = this.props
    if (!items.length) return null
    return (
      <List
        items={items}
        renderItem={::this.renderItem}
        onSelect={::this.onSelect}
        ref="list" />
    )
  }

  renderItem({item, focused}) {
    let {channel, author} = item
    let {classes} = this.props.sheet
    let itemClasses = [classes.item, focused ? classes.itemFocused : null]
    let slug = channel.slug ? channel.slug : channel.users[0].slug
    return (
      <div className={itemClasses.join(' ')}>
        <a
          className={classes.itemLink}
          href={`/chat/${slug}/${item.id}`} />
        <div className={classes.itemHeader}>
          <span className={classes.authorName}>{author.displayName} </span>
          <span className={classes.time}>{tz(item.time).format(dateFormat)}</span>
        </div>
        <div>
          <span className={classes.avatarWrap}>
            <span
              style={{backgroundImage: `url(${author.avatar})`}}
              className={classes.avatar}></span>
          </span>
          <span className={classes.message}>{item.highlighted}</span>
        </div>
      </div>
    )
  }
}
