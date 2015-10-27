import React, {Component} from 'react'
import List from 'react-finite-list'

export default class MessageSearch extends Component {
  render() {
    let messageList
    if (this.props.items.length) {
      messageList = (
        <List
        items={this.props.items}
        className="message-list"
        renderItem={this.renderItem}
        ref="list"/>
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
