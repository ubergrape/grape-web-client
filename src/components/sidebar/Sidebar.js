import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import {RoomInfo} from './room-info'
import UserProfile from './user-profile/UserProfile'
import MessageSearch from './message-search/MessageSearch'
import LabeledMessages from './labeled-messages/LabeledMessages'

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

const Content = (props) => {
  const {
    show,
    intl: {formatMessage},
    loadMentions,
    loadRoomInfo,
    loadSharedFiles,
    loadLabeledMessages,
    loadPinnedMessages,
    searchMessages,
    toggleSearchOnlyInChannel,
    toggleSearchActivities,
    toggleShowRoomMentions,
    hideSidebar,
    showSidebarSubview,
    goToMessage,
    showRoomMentions,
    selectLabeledMessagesFilter,
    openSharedFile,
    unpinMessage,
    options,
    ...rest
  } = props

  switch (show) {
    case 'room':
      return (
        <RoomInfo
          {...rest}
          onLoad={loadRoomInfo}
          onClose={hideSidebar}
          onShowSubview={showSidebarSubview}
          onLoadSharedFiles={loadSharedFiles}
          onOpenSharedFile={openSharedFile}
          onLoadPinnedMessages={loadPinnedMessages}
          onSelectPinnedMessage={goToMessage}
          onUnpin={unpinMessage}
        />
      )
    case 'pm':
      return (
        <UserProfile
          {...rest}
          onClose={hideSidebar}
          onShowSubview={showSidebarSubview}
          onLoadSharedFiles={loadSharedFiles}
          onOpenSharedFile={openSharedFile}
        />
      )
    case 'mentions':
      return (
        <MessageSearch
          {...rest}
          title={formatMessage(messages.mentionsTitle)}
          options={[{
            ...options.showRoomMentions,
            label: formatMessage(messages.mentions),
            handler: toggleShowRoomMentions
          }]}
          showRoomMentions={options.showRoomMentions.status}
          show={show}
          onLoad={loadMentions}
          onClose={hideSidebar}
          onSelect={goToMessage}
        />
      )
    case 'search':
      return (
        <MessageSearch
          {...rest}
          title={formatMessage(messages.searchTitle)}
          options={[
            {
              ...options.currentChannelOnly,
              label: formatMessage(messages.currentConversationOption),
              handler: toggleSearchOnlyInChannel
            },
            {
              ...options.searchActivities,
              label: formatMessage(messages.searchActivitiesOption),
              handler: toggleSearchActivities
            }
          ]}
          currentChannelOnly={options.currentChannelOnly.status}
          searchActivities={options.searchActivities.status}
          show={show}
          onLoad={searchMessages}
          onClose={hideSidebar}
          onSelect={goToMessage}
        />
      )
    case 'labeledMessages':
      return (
        <LabeledMessages
          {...rest}
          currentChannelOnly={options.currentChannelOnly.status}
          options={[{
            ...options.currentChannelOnly,
            label: formatMessage(messages.currentConversationOption),
            handler: toggleSearchOnlyInChannel
          }]}
          onClose={hideSidebar}
          onLoad={loadLabeledMessages}
          onSelect={goToMessage}
          onSelectFilter={selectLabeledMessagesFilter}
        />
      )
    default:
      return null
  }
}

Content.propTypes = {
  intl: intlShape.isRequired,
  loadMentions: PropTypes.func.isRequired,
  loadRoomInfo: PropTypes.func.isRequired,
  loadSharedFiles: PropTypes.func.isRequired,
  loadLabeledMessages: PropTypes.func.isRequired,
  loadPinnedMessages: PropTypes.func.isRequired,
  searchMessages: PropTypes.func.isRequired,
  showSidebarSubview: PropTypes.func.isRequired,
  unpinMessage: PropTypes.func.isRequired,
  showRoomMentions: PropTypes.bool,
  show: PropTypes.oneOf([
    false, 'room', 'pm', 'mentions', 'search', 'labeledMessages'
  ]).isRequired,
  toggleSearchOnlyInChannel: PropTypes.func.isRequired,
  toggleSearchActivities: PropTypes.func.isRequired,
  toggleShowRoomMentions: PropTypes.func.isRequired,
  hideSidebar: PropTypes.func.isRequired,
  goToMessage: PropTypes.func.isRequired,
  selectLabeledMessagesFilter: PropTypes.func.isRequired,
  openSharedFile: PropTypes.func.isRequired,
  options: PropTypes.shape({
    currentChannelOnly: PropTypes.shape({
      show: PropTypes.bool,
      status: PropTypes.bool
    }),
    searchActivities: PropTypes.shape({
      show: PropTypes.bool,
      status: PropTypes.bool
    }),
    showRoomMentions: PropTypes.shape({
      show: PropTypes.bool,
      status: PropTypes.bool
    })
  }).isRequired
}

Content.defaultProps = {
  showRoomMentions: false,
  options: {
    currentChannelOnly: {
      show: true,
      status: false
    },
    searchActivities: {
      show: true,
      status: false
    },
    showRoomMentions: {
      show: true,
      status: false
    }
  }
}

@injectIntl
export default class Sidebar extends PureComponent {
  static propTypes = {
    show: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]).isRequired,
    className: PropTypes.string
  }

  static defaultProps = {
    className: null
  }

  render() {
    const {
      show,
      className
    } = this.props

    if (!show) return null

    return (
      <div className={className}>
        <Content {...this.props} />
      </div>
    )
  }
}
