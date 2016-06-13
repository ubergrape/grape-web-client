import React, {Component, PropTypes} from 'react'
import SharedFiles from '../shared-files/SharedFiles'
import RoomInfo from '../room-info/RoomInfo'
import UserProfile from '../user-profile/UserProfile'
import Mentions from '../message-search/MessageSearch'
import Search from '../message-search/MessageSearch'
import Intercom from '../intercom/Intercom'
import style from './style'
import {useSheet} from 'grape-web/lib/jss'

function SidebarContent(props) {
  const {
    show,
    loadMentions,
    searchMessages,
    toggleSearchOnlyInChannel,
    hideSidebar: hide,
    goToMessage: select
  } = props

  switch (show) {
    case 'files':
      return <SharedFiles {...props} />
    case 'room':
      return <RoomInfo {...props} />
    case 'pm':
      return <UserProfile {...props} />
    case 'mentions': {
      const mentionProps = {
        ...props,
        load: loadMentions,
        hide,
        select
      }
      return <Mentions {...mentionProps} />
    }
    case 'search': {
      const searchProps = {
        ...props,
        load: searchMessages,
        options: [{
          label: 'Only in this conversation',
          handler: toggleSearchOnlyInChannel
        }],
        hide,
        select
      }
      return <Search {...searchProps} />
    }
    case 'intercom':
      return <Intercom {...props} />
    default:
  }
}

SidebarContent.propTypes = {
  sheet: PropTypes.object.isRequired,
  show: PropTypes.oneOfType([
    PropTypes.string,
    React.PropTypes.bool
  ]).isRequired,
  loadMentions: PropTypes.func.isRequired,
  searchMessages: PropTypes.func.isRequired,
  toggleSearchOnlyInChannel: PropTypes.func.isRequired,
  hideSidebar: PropTypes.func.isRequired,
  goToMessage: PropTypes.func.isRequired
}


@useSheet(style)
export default class Sidebar extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    show: PropTypes.oneOfType([
      PropTypes.string,
      React.PropTypes.bool
    ]).isRequired
  }

  render() {
    if (!this.props.show) return null
    return (
      <div className={this.props.sheet.classes.sidebar}>
        <SidebarContent {...this.props} />
      </div>
    )
  }
}
