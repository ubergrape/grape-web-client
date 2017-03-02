import React, {PureComponent, PropTypes} from 'react'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import SharedFiles from './shared-files/SharedFiles'
import RoomInfo from './room-info/RoomInfo'
import UserProfile from './user-profile/UserProfile'
import MessageSearch from './message-search/MessageSearch'
import LabelsOverview from './labels-overview/LabelsOverview'

const messages = defineMessages({
  mentions: {
    id: 'showRoomMentions',
    defaultMessage: 'Show Group mentions'
  },
  currentConversationOption: {
    id: 'onlyInThisConversation',
    defaultMessage: 'Only in this conversation',
    description: 'Option in messages search sidebar.'
  },
  searchActivitiesOption: {
    id: 'searchActivities',
    defaultMessage: 'Include activities',
    description: 'Option in messages search sidebar.'
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
    loadSharedFiles: PropTypes.func.isRequired,
    searchMessages: PropTypes.func.isRequired,
    showRoomMentions: PropTypes.bool,
    searchActivities: PropTypes.bool,
    searchOnlyInChannel: PropTypes.bool,
    toggleSearchOnlyInChannel: PropTypes.func.isRequired,
    toggleSearchActivities: PropTypes.func.isRequired,
    toggleShowRoomMentions: PropTypes.func.isRequired,
    hideSidebar: PropTypes.func.isRequired,
    goToMessage: PropTypes.func.isRequired,
    className: PropTypes.string
  }

  static defaultProps = {
    showRoomMentions: false,
    searchActivities: false,
    searchOnlyInChannel: false,
    className: null
  }

  renderContent() {
    const {
      show,
      intl: {formatMessage},
      loadMentions,
      loadRoomInfo,
      loadSharedFiles,
      searchMessages,
      toggleSearchOnlyInChannel,
      toggleSearchActivities,
      toggleShowRoomMentions,
      hideSidebar: hide,
      goToMessage: select,
      showRoomMentions,
      searchOnlyInChannel,
      searchActivities
    } = this.props

    switch (show) {
      case 'files':
        return <SharedFiles {...this.props} load={loadSharedFiles} />
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
        return <MessageSearch {...mentionProps} />
      }
      case 'search': {
        const searchProps = {
          ...this.props,
          title: formatMessage(messages.searchTitle),
          load: searchMessages,
          options: [{
            label: formatMessage(messages.currentConversationOption),
            handler: toggleSearchOnlyInChannel,
            status: searchOnlyInChannel
          }, {
            label: formatMessage(messages.searchActivitiesOption),
            handler: toggleSearchActivities,
            status: searchActivities
          }],
          hide,
          select
        }
        return <MessageSearch {...searchProps} />
      }
      case 'labelsOverview': {
        return <LabelsOverview {...this.props} />
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
