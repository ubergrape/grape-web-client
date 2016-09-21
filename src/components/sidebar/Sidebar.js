import React, {Component, PropTypes} from 'react'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import SharedFiles from '../shared-files/SharedFiles'
import RoomInfo from '../room-info/RoomInfo'
import UserProfile from '../user-profile/UserProfile'
import Mentions from '../message-search/MessageSearch'
import Search from '../message-search/MessageSearch'
import Intercom from '../intercom/Intercom'
import style from './style'
import {useSheet} from 'grape-web/lib/jss'

const messages = defineMessages({
  mentions: {
    id: 'showRoomMentions',
    defaultMessage: 'Show Group mentions'
  },
  label: {
    id: 'onlyInThisConversation',
    defaultMessage: 'Only in this conversation'
  },
  mentionsTitle: {
    id: 'mentionsSidebarTitle',
    defaultMessage: 'Mentions'
  },
  searchTitle: {
    id: 'searchSidebarTitle',
    defaultMessage: 'Search Results'
  }
})

function SidebarContent(props) {
  const {
    show,
    intl: {formatMessage},
    loadMentions,
    searchMessages,
    toggleSearchOnlyInChannel,
    toggleShowRoomMentions,
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
        title: formatMessage(messages.mentionsTitle),
        load: loadMentions,
        options: [{
          label: formatMessage(messages.mentions),
          handler: toggleShowRoomMentions,
          status: props.showRoomMentions
        }],
        hide,
        select
      }
      return <Mentions {...mentionProps} />
    }
    case 'search': {
      const searchProps = {
        ...props,
        title: formatMessage(messages.searchTitle),
        load: searchMessages,
        options: [{
          label: formatMessage(messages.label),
          handler: toggleSearchOnlyInChannel,
          status: props.searchOnlyInChannel
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
  intl: intlShape.isRequired,
  show: PropTypes.oneOfType([
    PropTypes.string,
    React.PropTypes.bool
  ]).isRequired,
  loadMentions: PropTypes.func.isRequired,
  searchMessages: PropTypes.func.isRequired,
  showRoomMentions: PropTypes.bool,
  searchOnlyInChannel: PropTypes.bool,
  toggleSearchOnlyInChannel: PropTypes.func.isRequired,
  toggleShowRoomMentions: PropTypes.func.isRequired,
  hideSidebar: PropTypes.func.isRequired,
  goToMessage: PropTypes.func.isRequired
}

const Content = injectIntl(SidebarContent)

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
    const {show, sheet: {classes}} = this.props
    if (!show) return null
    return (
      <div className={classes.sidebar}>
        <Content {...this.props} />
      </div>
    )
  }
}
