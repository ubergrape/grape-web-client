import React, {PropTypes, PureComponent} from 'react'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import colors from 'grape-theme/dist/base-colors'

import {
  ACTIVE_CONTACT,
  INVITED_CONTACT,
  DELETED_CONTACT
} from '../../constants/contacts'
import {userStatusMap} from '../../constants/app'

import Username from '../avatar-name/Username'
import Dialog from '../dialog/Dialog'
import {Tab, TabsNav} from '../tabs'

import {styles} from './theme'

const messages = defineMessages({
  dialogTitle: {
    id: 'contactsDialogTitle',
    defaultMessage: 'Manage Private Messages',
    description: 'Contacts Dialog: dialog title'
  },
  [`link${ACTIVE_CONTACT}`]: {
    id: 'contactsLinkActive',
    defaultMessage: 'active',
    description: 'Contacts Dialog: show active users link'
  },
  [`link${INVITED_CONTACT}`]: {
    id: 'contactsLinkInvited',
    defaultMessage: 'invited',
    description: 'Contacts Dialog: show invited users link'
  },
  [`link${DELETED_CONTACT}`]: {
    id: 'contactsLinkDeleted',
    defaultMessage: 'deleted',
    description: 'Contacts Dialog: show deleted users link'
  },
  [`info${ACTIVE_CONTACT}`]: {
    id: 'contactsInfoActive',
    defaultMessage: 'All active users in your organization',
    description: 'Contacts Dialog: active users text'
  },
  [`info${INVITED_CONTACT}`]: {
    id: 'contactsInfoInvited',
    defaultMessage: 'Users who have not accepted their invitation yet',
    description: 'Contacts Dialog: invited users text'
  },
  [`info${DELETED_CONTACT}`]: {
    id: 'contactsInfoDeleted',
    defaultMessage: 'Archived messages with deleted users',
    description: 'Contacts Dialog: deleted users text'
  }
})

@injectSheet(styles)
@injectIntl
export default class ContactsDialog extends PureComponent {
  static propTypes = {
    activeFilter: PropTypes.string.isRequired,
    children: PropTypes.node,
    intl: intlShape.isRequired,
    onHide: PropTypes.func.isRequired,
    onSelectFilter: PropTypes.func.isRequired,
    onSelectUser: PropTypes.func.isRequired,
    sheet: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired
  }

  onUserClick(e, slug) {
    const {
      onSelectUser,
      onHide
    } = this.props
    e.preventDefault()
    onHide()
    onSelectUser(slug)
  }

  renderUser(user) {
    const {sheet: {classes}} = this.props
    const {displayName, avatar, status} = user
    return (
      <a
        className={classes.userLink}
        href={`/chat/${user.slug}`}
        onClick={e => this.onUserClick(e, user.slug)}>
        <Username
          name={displayName}
          avatar={avatar}
          statusBorderColor={colors.white}
          status={userStatusMap[status]} />
      </a>
    )
  }

  renderUsersList(users) {
    if (!users.length) {
      return null
    }

    return (
      <ul>
        {users.map(user => (
          <li key={user.id}>{this.renderUser(user)}</li>
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
        {formatMessage(messages[`link${filter}`])}
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
          {this.renderFilterLink(ACTIVE_CONTACT)}
          {this.renderFilterLink(INVITED_CONTACT)}
          {this.renderFilterLink(DELETED_CONTACT)}
        </TabsNav>

        <div className={classes.container}>
          <p className={classes.message}>{formatMessage(messages[`info${activeFilter}`])}</p>
          {this.renderUsersList(users)}
        </div>
      </Dialog>
    )
  }
}
