import React, {PureComponent, PropTypes} from 'react'
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

@injectIntl
export default class Sidebar extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    show: PropTypes.oneOfType([
      PropTypes.string,
      React.PropTypes.bool
    ]).isRequired,
    loadMentions: PropTypes.func.isRequired,
    loadRoomInfo: PropTypes.func.isRequired,
    searchMessages: PropTypes.func.isRequired,
    showRoomMentions: PropTypes.bool,
    searchOnlyInChannel: PropTypes.bool,
    toggleSearchOnlyInChannel: PropTypes.func.isRequired,
    toggleShowRoomMentions: PropTypes.func.isRequired,
    hideSidebar: PropTypes.func.isRequired,
    goToMessage: PropTypes.func.isRequired
  }

  renderContent() {
    const {
      show,
      intl: {formatMessage},
      loadMentions,
      loadRoomInfo,
      searchMessages,
      toggleSearchOnlyInChannel,
      toggleShowRoomMentions,
      hideSidebar: hide,
      goToMessage: select,
      showRoomMentions,
      searchOnlyInChannel
    } = this.props

    switch (show) {
      case 'files':
        return <SharedFiles {...this.props} />
      case 'room':
        return <RoomInfo {...this.props} load={loadRoomInfo} />
      case 'pm':
        return <UserProfile {...this.props} />
      case 'mentions': {
        const mentionProps = {
          ...this.props,
          title: formatMessage(messages.mentionsTitle),
          load: loadMentions,
          options: [{
            label: formatMessage(messages.mentions),
            handler: toggleShowRoomMentions,
            status: showRoomMentions
          }],
          hide,
          select
        }
        return <Mentions {...mentionProps} />
      }
      case 'search': {
        const searchProps = {
          ...this.props,
          title: formatMessage(messages.searchTitle),
          load: searchMessages,
          options: [{
            label: formatMessage(messages.label),
            handler: toggleSearchOnlyInChannel,
            status: searchOnlyInChannel
          }],
          hide,
          select
        }
        return <Search {...searchProps} />
      }
      default:
        return null
    }
  }

  render() {
    const {
      show,
      className
    } = this.props

    if (!show) return null

    return (
      <div className={className}>
        {this.renderContent()}
      </div>
    )
  }
}
