import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import capitalize from 'lodash/string/capitalize'
import {grayBlue} from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

import Dialog from '../dialog/Dialog'
import {Tab, TabsNav} from '../tabs'
import Contact from './Contact'

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

@injectSheet({
  container: {
    display: 'block',
    extend: fonts.normal,
    height: 356,
    padding: [10, 0],
    overflowY: 'auto'
  },
  message: {
    extend: fonts.normal,
    color: grayBlue,
    padding: [0, 20, 10]
  }
})
@injectIntl
export default class ManageContactsDialog extends PureComponent {
  static propTypes = {
    activeFilter: PropTypes.string.isRequired,
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

  onSelectContact = ({id}) => {
    const {
      onHide,
      onSelectUser
    } = this.props
    onHide()
    onSelectUser(id)
  }

  renderContactsList(users) {
    if (!users.length) {
      return null
    }

    return (
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <Contact
              user={user}
              onSelect={this.onSelectContact}
            />
          </li>
        ))}
      </ul>
    )
  }

  renderFilterLink({filter}) {
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
        title={formatMessage(messages.dialogTitle)}
      >
        <TabsNav>
          {this.renderFilterLink({filter: 'active'})}
          {this.renderFilterLink({filter: 'invited'})}
          {this.renderFilterLink({filter: 'deleted'})}
        </TabsNav>
        <div className={classes.container}>
          <p className={classes.message}>{formatMessage(messages[`info${capitalize(activeFilter)}`])}</p>
          {this.renderContactsList(users)}
        </div>
      </Dialog>
    )
  }
}
