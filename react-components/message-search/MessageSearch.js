import React, {Component} from 'react'
import List from 'react-finite-list'
import {useSheet} from '../jss'
import style from './style'

@useSheet(style)
export default class MessageSearch extends Component {
  static defaultProps = {
    items: [],
    itemsTotal: 0,
    show: false,
    limit: 20,
    offset: 20
  }

  onShowMoreClick() {

  }

  render() {
    let {classes} = this.props.sheet
    if (!this.props.show) return null
    let messageList
    if (this.props.items.length) {
      messageList = (
        <List
          items={this.props.items}
          className={classes.messageList}
          renderItem={this.renderItem}
          ref="list" />
      )
    }
    let showMoreLink
    if (this.props.items.length < this.props.itemsTotal) {
      showMoreLink = (
        <a onClick={this.onShowMoreClick}>
          Show more
        </a>
      )
    }
    return (
      <div className='search'>
        <div className='header'>
          <span className='title'>
            Search your conversations
          </span>
          <span
            className='hide-sidebar'
            onClick={this.props.hide}>X
          </span>
        </div>
        {messageList}
        {showMoreLink}
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
