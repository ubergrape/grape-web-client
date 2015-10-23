import React, {Component} from 'react'
import List from 'react-finite-list'

export default class MessageSearch extends Component {
  render() {
    console.log(this.props.items)
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
    return(
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
    // TODO http://stackoverflow.com/questions/3410464/how-to-find-all-occurrences-of-one-string-in-another-in-javascript
    return(
      <div>{item.text}</div>
    )
  }
}