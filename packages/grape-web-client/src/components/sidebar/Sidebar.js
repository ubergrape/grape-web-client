import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { defineMessages, intlShape, injectIntl } from 'react-intl'

import { RoomInfo } from './room-info'
import UserProfile from './user-profile/UserProfile'
import MessageSearch from './message-search/MessageSearch'
import LabeledMessages from './labeled-messages/LabeledMessages'

const messages = defineMessages({
  groupMentionsOption: {
    id: 'showRoomMentions',
    defaultMessage: 'Show Group mentions',
    description: 'Option in messages mention sidebar.',
  },
  currentMentionsOption: {
    id: 'onlyInThisConversationMentions',
    defaultMessage: 'Only in this conversation',
    description: 'Option in messages mention sidebar.',
  },
  currentConversationOption: {
    id: 'onlyInThisConversationMessages',
    defaultMessage: 'Only in this conversation',
    description: 'Option in messages search sidebar.',
  },
  includeActivitiesOption: {
    id: 'includeActivities',
    defaultMessage: 'Include activities',
    description: 'Option in messages search sidebar.',
  },
  mentionsTitle: {
    id: 'mentionsSidebarTitle',
    defaultMessage: 'Mentions',
  },
  searchTitle: {
    id: 'searchSidebarTitle',
    defaultMessage: 'Search Results',
  },
})

const Content = props => {
  const {
    show,
    intl: { formatMessage },
    loadMentions,
    loadRoomInfo,
    loadSharedFiles,
    loadLabeledMessages,
    loadPinnedMessages,
    loadChannelMembers,
    searchMessages,
    toggleSearchOnlyInChannel,
    toggleSearchActivities,
    toggleShowRoomMentions,
    toggleShowCurrentRoomMentions,
    hideSidebar,
    showSidebarSubview,
    goToMessage,
    selectLabeledMessagesFilter,
    openSharedFile,
    unpinMessage,
    getUser,
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
          onLoadMembers={loadChannelMembers}
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
          onLoadPinnedMessages={loadPinnedMessages}
          onSelectPinnedMessage={goToMessage}
          onUnpin={unpinMessage}
          getUser={getUser}
        />
      )
    case 'mentions':
      return (
        <MessageSearch
          {...rest}
          title={formatMessage(messages.mentionsTitle)}
          options={[
            {
              ...options.showRoomMentions,
              label: formatMessage(messages.groupMentionsOption),
              handler: toggleShowRoomMentions,
            },
            {
              ...options.showCurrentRoomMentions,
              label: formatMessage(messages.currentMentionsOption),
              handler: toggleShowCurrentRoomMentions,
            },
          ]}
          showRoomMentions={options.showRoomMentions.status}
          showCurrentRoomMentions={options.showCurrentRoomMentions.status}
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
              handler: toggleSearchOnlyInChannel,
            },
            {
              ...options.searchActivities,
              label: formatMessage(messages.includeActivitiesOption),
              handler: toggleSearchActivities,
            },
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
          options={[
            {
              ...options.currentChannelOnly,
              label: formatMessage(messages.currentConversationOption),
              handler: toggleSearchOnlyInChannel,
            },
          ]}
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
  loadChannelMembers: PropTypes.func.isRequired,
  searchMessages: PropTypes.func.isRequired,
  showSidebarSubview: PropTypes.func.isRequired,
  unpinMessage: PropTypes.func.isRequired,
  show: PropTypes.oneOf([
    false,
    'room',
    'pm',
    'mentions',
    'search',
    'labeledMessages',
  ]).isRequired,
  toggleSearchOnlyInChannel: PropTypes.func.isRequired,
  toggleSearchActivities: PropTypes.func.isRequired,
  toggleShowRoomMentions: PropTypes.func.isRequired,
  toggleShowCurrentRoomMentions: PropTypes.func.isRequired,
  hideSidebar: PropTypes.func.isRequired,
  goToMessage: PropTypes.func.isRequired,
  selectLabeledMessagesFilter: PropTypes.func.isRequired,
  openSharedFile: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  options: PropTypes.shape({
    currentChannelOnly: PropTypes.shape({
      show: PropTypes.bool,
      status: PropTypes.bool,
    }),
    searchActivities: PropTypes.shape({
      show: PropTypes.bool,
      status: PropTypes.bool,
    }),
    showRoomMentions: PropTypes.shape({
      show: PropTypes.bool,
      status: PropTypes.bool,
    }),
    showCurrentRoomMentions: PropTypes.shape({
      show: PropTypes.bool,
      status: PropTypes.bool,
    }),
  }).isRequired,
}

Content.defaultProps = {
  options: {
    currentChannelOnly: {
      show: true,
      status: false,
    },
    searchActivities: {
      show: true,
      status: false,
    },
    showRoomMentions: {
      show: true,
      status: false,
    },
    showCurrentRoomMentions: {
      show: true,
      status: false,
    },
  },
}

@injectIntl
export default class Sidebar extends PureComponent {
  static propTypes = {
    show: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    permissions: PropTypes.object,
    className: PropTypes.string,
  }

  static defaultProps = {
    className: null,
    permissions: {},
  }

  onSidebarRef = ref => {
    this.sidebar = ref
  }

  render() {
    const { show, className, permissions } = this.props

    if (!show) return null

    return (
      <div ref={this.onSidebarRef} className={className}>
        <Content
          {...this.props}
          sidebarRef={this.sidebar}
          permissions={permissions}
        />
      </div>
    )
  }
}
