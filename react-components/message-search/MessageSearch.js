import React, {Component} from 'react'
import List from 'react-finite-list'
import {useSheet} from '../jss'
import style from './style'

@useSheet(style)
export default class MessageSearch extends Component {
  static defaultProps = {
    items: [],
    itemsTotal: 0,
    show: false
  }

  constructor(props) {
    super(props)
    this.limit = 20
    this.offset = ''
  }

  onShowMore() {
    // offset is always the timestamp of the last loaded message
    this.offset = this.props.items[this.props.items.length-1].time
    this.props.loadMoreMessages(this.limit, this.offset)
  }

  render() {
    if (!this.props.show) return null
    let {classes} = this.props.sheet
    let {items} = this.props
    let messageList
    if (this.props.items.length) {
      messageList = (
        <List
          items={items}
          renderItem={this.renderItem}
          ref="list" />
      )
    }
    let showMoreLink
    if (items.length < this.props.itemsTotal) {
      showMoreLink = (
        <a onClick={::this.onShowMore}>
          Show more
        </a>
      )
    }
    let itemsCount
    if (items.length) {
      let plural = items.length > 1 ? 's' : ''
      itemsCount = <div>{items.length} Message{plural}</div>
    }
    return (
      <div className='search'>
        {itemsCount}
        <div className={classes.scrollContent}>
          {messageList}
          {showMoreLink}
        </div>
      </div>
    )
  }

  renderItem({item}) {
    let channel = item.channel
    let slug = channel.slug ? channel.slug : channel.users[0].slug
    return (
      <a href={`/chat/${slug}/${item.id}`}>
        <div>{item.highlighted}</div>
      </a>
    )
  }
}
