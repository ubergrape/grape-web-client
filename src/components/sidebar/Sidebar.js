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
  label: {
    id: 'OnlyInThisConversation',
    defaultMessage: 'Only in this conversation'
  }
})

function SidebarContent(props) {
  const {
    show,
    intl,
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
          label: intl.formatMessage(messages.label),
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
  intl: intlShape.isRequired,
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
    if (!this.props.show) return null
    return (
      <div className={this.props.sheet.classes.sidebar}>
        <Content {...this.props} />
      </div>
    )
  }
}
