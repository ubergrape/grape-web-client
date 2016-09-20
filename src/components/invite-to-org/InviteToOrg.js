import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import Input from '../input/GrayInputNormal'
import {styles} from './inviteToOrgTheme'
import Dialog from '../dialog/Dialog'

const messages = defineMessages({
  title: {
    id: 'inviteToOrgTitle',
    defaultMessage: 'Invite people to your organization'
  },
  invitePlaceholder: {
    id: 'inviteToOrgNote',
    defaultMessage: 'You can invite multiple users at once, just separate their email addresses with a comma.'
  },
  messagesPlaceholder: {
    id: 'InviteToOrgMessage',
    defaultMessage: 'You can add personal message to the invitation email.'
  }
})

@useSheet(styles)
@injectIntl
export default class NewConversation extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    show: PropTypes.bool.isRequired,
    hideInviteToOrg: PropTypes.func.isRequired
  }

  onInvite = () => {

  }

  render() {
    const {
      sheet: {classes},
      intl: {formatMessage},
      hideInviteToOrg, show
    } = this.props

    return (
      <Dialog
        show={show}
        onHide={hideInviteToOrg}
        title={formatMessage(messages.title)}>
        <div className={classes.wrapper}>
          <form onSubmit={this.onInvite}>
            <div className={classes.line}>
              <label
                className={classes.label}
                htmlFor="emailAddresses">
                <FormattedMessage
                  id="emailAddresses"
                  defaultMessage="Email addresses" />
              </label>
              <Input
                type="textarea"
                id="emailAddresses"
                placeholder={formatMessage(messages.invitePlaceholder)} />
            </div>
            <div className={classes.line}>
              <label
                className={classes.label}
                htmlFor="personalMessage">
                <FormattedMessage
                  id="personalMessage"
                  defaultMessage="Personal message" />
              </label>
              <Input
                type="textarea"
                id="personalMessage"
                placeholder={formatMessage(messages.messagesPlaceholder)} />
            </div>
            <div className={classes.submit}>
              <button type="submit">
                <FormattedMessage
                  id="sendInvites"
                  defaultMessage="Send invitation emails" />
              </button>
            </div>
          </form>
        </div>
      </Dialog>
    )
  }
}
