import React, {Component} from 'react'

export default class MessageSearch extends Component {
  render() {
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
      </div>
    )
  }
}