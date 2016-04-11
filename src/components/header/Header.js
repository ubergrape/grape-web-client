import React, {Component, PropTypes} from 'react'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'
import Favorite from '../favorite/Favorite'

@useSheet(style)
export default class Header extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    name: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    showChannelMembersInvite: PropTypes.func,
    showInSidebar: PropTypes.func,
    hideSidebar: PropTypes.func
  }

  getHandler(panel) {
    if (this.props.sidebar === panel) return this.props.hideSidebar
    return this.props.showInSidebar.bind(null, panel)
  }

  renderTile() {
    const {name, description} = this.props
    const title = [
      <h1 key="t1">{name}</h1>
    ]
    if (description) title.push(<h2 key="t2">{description}</h2>)

    return title
  }

  renderSearch() {
    return <input type="search" />
  }

  renderInviteButton() {
    return (
      <button
        onClick={this.props.showChannelMembersInvite}>
        +
      </button>
    )
  }

  renderFilesButton() {
    return (
      <button
        onClick={this.getHandler('files')}>
        f
      </button>
    )
  }

  renderInfoButton() {
    let info
    if (this.props.type === 'room') info = 'info'
    if (this.props.type === 'pm') info = 'profile'
    return (
      <button
        onClick={this.getHandler(info)}>
        i
      </button>
    )
  }

  renderMentionsButton() {
    return (
      <button
        onClick={this.getHandler('mentions')}>
        @
      </button>
    )
  }

  render() {
    return (
      <header>
        <div className="favorite">
          <Favorite {...this.props}/>
        </div>
        <div className="title">
          {this.renderTile()}
        </div>
        <div className="actions">
          {this.renderInviteButton()}
          {this.renderInfoButton()}
          {this.renderFilesButton()}
          {this.renderSearch()}
          {this.renderMentionsButton()}
          <button>?</button>
        </div>
      </header>
    )
  }
}
