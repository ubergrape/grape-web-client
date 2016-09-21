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
  },
  loadingLinkPlaceholder: {
    id: 'loadingLink',
    description: 'used in invite to org link input placeholder, while link is loading',
    defaultMessage: 'Loading link…'
  },
  error: {
    id: 'inviteToOrgError',
    defaultMessage: 'Enter valid email addresses separated by a space.'
  }
})

@useSheet(styles)
@injectIntl
export default class InviteToOrg extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    show: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    inviteLinkFeature: PropTypes.bool.isRequired,
    inviteLink: PropTypes.string.isRequired,
    orgId: PropTypes.number,
    isInviter: PropTypes.bool.isRequired,
    onlyInvited: PropTypes.array.isRequired,
    hideInviteToOrg: PropTypes.func.isRequired,
    getInviteToOrgLink: PropTypes.func.isRequired,
    clearInviteToOrgError: PropTypes.func.isRequired,
    inviteToOrg: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      value: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      isInviter, show, orgId,
      inviteLink, getInviteToOrgLink
    } = nextProps

    if (isInviter && show && !inviteLink && orgId) getInviteToOrgLink()
  }

  onInviteesChange = ({target: {value}}) => this.setState({value})

  onInvite = e => {
    e.preventDefault()
    this.props.inviteToOrg(this.state.value)
  }

  onClickInviteLink = ({target}) => {
    target.selectionStart = 0
    target.selectionEnd = target.value.length
  }

  onClearError = () => {
    this.props.clearInviteToOrgError()
  }

  getError() {
    if (!this.props.error) return null

    return {
      level: 'error',
      message: this.props.intl.formatMessage(messages.error)
    }
  }

  render() {
    const {
      sheet: {classes},
      intl: {formatMessage},
      hideInviteToOrg, show,
      inviteLinkFeature, inviteLink,
      isInviter, onlyInvited
    } = this.props

    console.log(onlyInvited)

    if (!isInviter) return null

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
                value={this.state.value}
                error={this.getError()}
                onChange={this.onInviteesChange}
                clearError={this.onClearError}
                className={classes.textarea}
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
                className={classes.textarea}
                id="personalMessage"
                placeholder={formatMessage(messages.messagesPlaceholder)} />
            </div>
            <div className={classes.submit}>
              <button
                className={classes.submitButton}
                type="submit">
                <FormattedMessage
                  id="sendInvites"
                  defaultMessage="Send invitation emails" />
              </button>
            </div>
          </form>
          {inviteLinkFeature &&
            <div className={classes.inviteLink}>
              <label
                className={classes.label}
                htmlFor="inviteLink">
                <FormattedMessage
                  id="useInviteLink"
                  defaultMessage="Or use this invite-link" />
              </label>
              <Input
                id="inviteLink"
                onClick={this.onClickInviteLink}
                placeholder={formatMessage(messages.loadingLinkPlaceholder)}
                value={inviteLink}
                readonly />
            </div>
          }
        </div>
      </Dialog>
    )
  }
}
