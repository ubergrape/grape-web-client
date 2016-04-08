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
    isChannelInfoOpened: PropTypes.bool,
    isSharedFilesOpened: PropTypes.bool,
    showSharedFiles: PropTypes.func,
    hideSharedFiles: PropTypes.func,
    showChannelMembersInvite: PropTypes.func,
    hideChannelInfo: PropTypes.func,
    showChannelInfoOrUserProfile: PropTypes.func
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
    const {
      isSharedFilesOpened,
      showSharedFiles,
      hideSharedFiles
    } = this.props
    const handler = !isSharedFilesOpened ? showSharedFiles : hideSharedFiles

    return (
      <button
        onClick={handler}>
        f
      </button>
    )
  }

  renderInfoButton() {
    const {
      isChannelInfoOpened,
      showChannelInfoOrUserProfile,
      hideChannelInfo
    } = this.props
    const handler = !isChannelInfoOpened ? showChannelInfoOrUserProfile : hideChannelInfo

    return (
      <button
        onClick={handler}>
        i
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
          <button>@</button>
          <button>?</button>
        </div>
      </header>
    )
  }
}
