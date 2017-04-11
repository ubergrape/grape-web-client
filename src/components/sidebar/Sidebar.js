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
    searchMessages,
    toggleSearchOnlyInChannel,
    toggleSearchActivities,
    toggleShowRoomMentions,
    hideSidebar,
    goToMessage,
    showRoomMentions,
    currentChannelOnly,
    searchActivities,
    onSelectLabel,
    ...rest
  } = props

  switch (show) {
    case 'files':
      return (
        <SharedFiles
          {...rest}
          onLoad={loadSharedFiles}
          onClose={hideSidebar}
        />
      )
    case 'room':
      return (
        <RoomInfo
          {...rest}
          onLoad={loadRoomInfo}
          onClose={hideSidebar}
        />
      )
    case 'pm':
      return <UserProfile {...rest} onClose={hideSidebar} />
    case 'mentions':
      return (
        <MessageSearch
          {...rest}
          title={formatMessage(messages.mentionsTitle)}
          options={[{
            label: formatMessage(messages.mentions),
            handler: toggleShowRoomMentions,
            status: showRoomMentions
          }]}
          currentChannelOnly={currentChannelOnly}
          searchActivities={searchActivities}
          showRoomMentions={showRoomMentions}
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
              label: formatMessage(messages.currentConversationOption),
              handler: toggleSearchOnlyInChannel,
              status: currentChannelOnly
            },
            {
              label: formatMessage(messages.searchActivitiesOption),
              handler: toggleSearchActivities,
              status: searchActivities
            }
          ]}
          currentChannelOnly={currentChannelOnly}
          searchActivities={searchActivities}
          showRoomMentions={showRoomMentions}
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
          options={[{
            label: formatMessage(messages.currentConversationOption),
            handler: toggleSearchOnlyInChannel,
            status: currentChannelOnly
          }]}
          onClose={hideSidebar}
          onLoad={loadLabeledMessages}
          onSelect={onSelectLabel}
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
  searchMessages: PropTypes.func.isRequired,
  showRoomMentions: PropTypes.bool,
  show: PropTypes.oneOfType([
    PropTypes.string,
    React.PropTypes.bool
  ]).isRequired,
  searchActivities: PropTypes.bool,
  currentChannelOnly: PropTypes.bool,
  toggleSearchOnlyInChannel: PropTypes.func.isRequired,
  toggleSearchActivities: PropTypes.func.isRequired,
  toggleShowRoomMentions: PropTypes.func.isRequired,
  hideSidebar: PropTypes.func.isRequired,
  goToMessage: PropTypes.func.isRequired,
  onSelectLabel: PropTypes.func.isRequired
}

Content.defaultProps = {
  showRoomMentions: false,
  searchActivities: false,
  currentChannelOnly: false
}

@injectIntl
export default class Sidebar extends PureComponent {
  static propTypes = {
    show: PropTypes.oneOfType([
      PropTypes.string,
      React.PropTypes.bool
    ]).isRequired,
    className: PropTypes.string,
    goToMessage: PropTypes.func.isRequired
  }

  static defaultProps = {
    className: null
  }

  onSelectLabel = (label) => {
    this.props.goToMessage(label.message)
  }

  render() {
    const {
      show,
      className
    } = this.props

    if (!show) return null

    return (
      <div className={className}>
        <Content {...this.props} onSelectLabel={this.onSelectLabel} />
      </div>
    )
  }
}
