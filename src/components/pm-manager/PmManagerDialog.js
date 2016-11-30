import React, {PropTypes, PureComponent} from 'react'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import colors from 'grape-theme/dist/base-colors'

import {ACTIVE_PM, INVITED_PM, DELETED_PM} from '../../constants/pmManager'
import {userStatusMap} from '../../constants/app'

import Username from '../avatar-name/Username'
import Dialog from '../dialog/Dialog'
import Link from './Link'
import {TabsNav} from '../tabs'

import {styles} from './theme'

const messages = defineMessages({
  dialogTitle: {
    id: 'pmManagerDialogTitle',
    defaultMessage: 'Manage Private Messages',
    description: 'PMs Manager: dialog title'
  },
  [`link${ACTIVE_PM}`]: {
    id: 'pmManagerLinkActive',
    defaultMessage: 'active',
    description: 'PMs Manager: show active users link'
  },
  [`link${INVITED_PM}`]: {
    id: 'pmManagerLinkInvited',
    defaultMessage: 'invited',
    description: 'PMs Manager: show invited users link'
  },
  [`link${DELETED_PM}`]: {
    id: 'pmManagerLinkDeleted',
    defaultMessage: 'deleted',
    description: 'PMs Manager: show deleted users link'
  },
  [`info${ACTIVE_PM}`]: {
    id: 'pmManagerInfoActive',
    defaultMessage: 'All active users in your organization',
    description: 'PMs Manager: active users text'
  },
  [`info${INVITED_PM}`]: {
    id: 'pmManagerInfoInvited',
    defaultMessage: 'Users who have not accepted their invitation yet',
    description: 'PMs Manager: invited users text'
  },
  [`info${DELETED_PM}`]: {
    id: 'pmManagerInfoDeleted',
    defaultMessage: 'Archived messages with deleted users',
    description: 'PMs Manager: deleted users text'
  }
})

@injectSheet(styles)
@injectIntl
export default class PmManagerDialog extends PureComponent {
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
    // don't break on cmd+click etc
    if (e.shiftKey || e.ctrlKey || e.metaKey || e.which !== undefined && e.which > 1) {
      return
    }
    const {onSelectUser, onHide} = this.props
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
      <Link active={activeFilter === filter} onClick={onSelectFilter} filter={filter}>
        {formatMessage(messages[`link${filter}`])}
      </Link>
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
          {this.renderFilterLink(ACTIVE_PM)}
          {this.renderFilterLink(INVITED_PM)}
          {this.renderFilterLink(DELETED_PM)}
        </TabsNav>

        <div className={classes.container}>
          <p className={classes.message}>{formatMessage(messages[`info${activeFilter}`])}</p>
          {this.renderUsersList(users)}
        </div>
      </Dialog>
    )
  }
}
