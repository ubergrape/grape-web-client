import React, {PropTypes, PureComponent} from 'react'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import colors from 'grape-theme/dist/base-colors'
import capitalize from 'lodash/string/capitalize'

import {userStatusMap} from '../../constants/app'

import Username from '../avatar-name/Username'
import Dialog from '../dialog/Dialog'
import {Tab, TabsNav} from '../tabs'

import {styles} from './theme'

const messages = defineMessages({
  dialogTitle: {
    id: 'manageContactsDialogTitle',
    defaultMessage: 'Manage Private Messages',
    description: 'Manage Contacts Dialog: dialog title'
  },
  linkActive: {
    id: 'manageContactsLinkActive',
    defaultMessage: 'active',
    description: 'Manage Contacts Dialog: show active users link'
  },
  linkInvited: {
    id: 'manageContactsLinkInvited',
    defaultMessage: 'invited',
    description: 'Manage Contacts Dialog: show invited users link'
  },
  linkDeleted: {
    id: 'manageContactsLinkDeleted',
    defaultMessage: 'deleted',
    description: 'Manage Contacts Dialog: show deleted users link'
  },
  infoActive: {
    id: 'manageContactsInfoActive',
    defaultMessage: 'All active users in your organization',
    description: 'Manage Contacts Dialog: active users text'
  },
  infoInvited: {
    id: 'manageContactsInfoInvited',
    defaultMessage: 'Users who have not accepted their invitation yet',
    description: 'Manage Contacts Dialog: invited users text'
  },
  infoDeleted: {
    id: 'manageContactsInfoDeleted',
    defaultMessage: 'Archived messages with deleted users',
    description: 'Manage Contacts Dialog: deleted users text'
  }
})

@injectSheet(styles)
class User extends PureComponent {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    onSelectUser: PropTypes.func.isRequired,
    sheet: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  }

  onClick = (e) => {
    const {
      onSelectUser,
      onHide,
      user: {slug}
    } = this.props

    e.preventDefault()
    onHide()
    onSelectUser(slug)
  }

  render() {
    const {sheet: {classes}, user} = this.props
    const {displayName, avatar, status} = user

    return (
      <a href={`/chat/${user.slug}`} className={classes.user} onClick={this.onClick}>
        <Username
          name={displayName}
          avatar={avatar}
          statusBorderColor={colors.white}
          status={userStatusMap[status]} />
      </a>
    )
  }
}

@injectSheet(styles)
@injectIntl
export default class ManageContactsDialog extends PureComponent {
  static propTypes = {
    activeFilter: PropTypes.string.isRequired,
    children: PropTypes.node,
    intl: intlShape.isRequired,
    onHide: PropTypes.func.isRequired,
    onSelectFilter: PropTypes.func.isRequired,
    onSelectUser: PropTypes.func.isRequired,
    sheet: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    users: PropTypes.arrayOf(
      PropTypes.object.isRequired
    ).isRequired
  }

  renderUsersList(users) {
    if (!users.length) {
      return null
    }

    const {
      onHide,
      onSelectUser
    } = this.props

    return (
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <User user={user} onHide={onHide} onSelectUser={onSelectUser} />
          </li>
        ))}
      </ul>
    )
  }

  renderFilterLink(filter) {
    const {
      activeFilter,
      intl: {formatMessage},
      onSelectFilter
    } = this.props

    return (
      <Tab active={activeFilter === filter} onClick={onSelectFilter} filter={filter}>
        {formatMessage(messages[`link${capitalize(filter)}`])}
      </Tab>
    )
  }

  render() {
    const {
      show,
      activeFilter,
      intl: {formatMessage},
      onHide,
      users,
      sheet: {classes}
    } = this.props

    return (
      <Dialog
        show={show}
        onHide={onHide}
        title={formatMessage(messages.dialogTitle)}>
        <TabsNav>
          {this.renderFilterLink('active')}
          {this.renderFilterLink('invited')}
          {this.renderFilterLink('deleted')}
        </TabsNav>
        <div className={classes.container}>
          <p className={classes.message}>{formatMessage(messages[`info${capitalize(activeFilter)}`])}</p>
          {this.renderUsersList(users)}
        </div>
      </Dialog>
    )
  }
}
