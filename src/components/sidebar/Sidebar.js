import React, {Component, PropTypes} from 'react'
import SharedFiles from '../shared-files/SharedFiles'
import RoomInfo from '../room-info/RoomInfo'
import UserProfile from '../user-profile/UserProfile'
import Mentions from '../message-search/MessageSearch'
import Search from '../message-search/MessageSearch'
import Intercom from '../intercom/Intercom'
import style from './style'
import {useSheet} from 'grape-web/lib/jss'

@useSheet(style)
export default class Sidebar extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    show: PropTypes.oneOfType([
      PropTypes.string,
      React.PropTypes.bool
    ]),
    loadMentions: PropTypes.func,
    searchMessages: PropTypes.func,
    hideSidebar: PropTypes.func,
    goToMessage: PropTypes.func
  }

  getSidebar() {
    const {
      show,
      loadMentions,
      searchMessages,
      hideSidebar: hide,
      goToMessage: select
    } = this.props

    switch (show) {
      case 'files':
        return <SharedFiles {...this.props} />
      case 'room':
        return <RoomInfo {...this.props} />
      case 'pm':
        return <UserProfile {...this.props} />
      case 'mentions': {
        const props = {
          ...this.props,
          load: loadMentions,
          hide,
          select
        }
        return <Mentions {...props} />
      }
      case 'search': {
        const props = {
          ...this.props,
          load: searchMessages,
          hide,
          select
        }
        return <Search {...props} />
      }
      case 'intercom':
        return <Intercom {...this.props} />
      default:
        return null
    }
  }

  render() {
    const sidebar = this.getSidebar()
    if (!sidebar) return null
    return (
      <div className={this.props.sheet.classes.sidebar}>
        {sidebar}
      </div>
    )
  }
}
