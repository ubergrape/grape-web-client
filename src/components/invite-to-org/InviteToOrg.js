import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import Spinner from 'grape-web/lib/components/spinner'

import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl,
} from 'react-intl'

import { InviteSuccess } from '../i18n/i18n'
import Dialog from '../dialog/Dialog'
import InviteGuests from '../invite-guests/InviteGuests'
import InviteLink from './InviteLink'
import EmailsInput from './EmailsInput'
import PersonalMessageInput from './PersonalMessageInput'
import { styles } from './inviteToOrgTheme'

const messages = defineMessages({
  title: {
    id: 'inviteToOrgTitle',
    defaultMessage: 'Invite members to your organization',
  },
  invitePlaceholder: {
    id: 'inviteToOrgNote',
    defaultMessage:
      'Invite multiple members at once, just separate their e-mail addresses with a comma.',
  },
  messagesPlaceholder: {
    id: 'InviteToOrgMessage',
    defaultMessage: 'You can add personal message to the invitation email.',
  },
  loadingLinkPlaceholder: {
    id: 'loadingLink',
    description:
      'used in invite to org link input placeholder, while link is loading',
    defaultMessage: 'Loading link…',
  },
  error: {
    id: 'inviteToOrgError',
    defaultMessage: 'Enter valid e-mail addresses separated by a comma.',
  },
})

@injectSheet(styles)
@injectIntl
export default class InviteToOrg extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    channel: PropTypes.object,
    conf: PropTypes.object,
    intl: intlShape.isRequired,
    show: PropTypes.bool.isRequired,
    showError: PropTypes.bool.isRequired,
    showInviteLinkFeature: PropTypes.bool.isRequired,
    inviteLink: PropTypes.string.isRequired,
    orgId: PropTypes.number,
    isInviter: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    getIniviteLink: PropTypes.func.isRequired,
    onHideError: PropTypes.func.isRequired,
    onInvite: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
  }

  static defaultProps = {
    orgId: null,
    channel: {},
    conf: {},
  }

  state = {
    message: '',
    value: '',
    isLoading: false,
  }

  componentWillReceiveProps(nextProps) {
    const { isInviter, show, orgId, inviteLink, getIniviteLink } = nextProps

    if (isInviter && show && !inviteLink && orgId) getIniviteLink()

    this.setState({ isLoading: false })
  }

  onInviteesChange = ({ target: { value } }) => {
    this.setState({ value })
  }

  onMessageChange = ({ target }) => {
    this.setState({ message: target.value })
  }

  onInvite = e => {
    e.preventDefault()
    const { onInvite, onSuccess } = this.props
    const { value, message } = this.state
    this.setState({ isLoading: true }, () => {
      onInvite(
        {
          emails: value,
          message,
        },
        ({ emails }) => {
          onSuccess(<InviteSuccess invited={emails} />)
        },
      )
    })
  }

  onClickInviteLink = ({ target }) => {
    /* eslint-disable no-param-reassign */
    target.selectionStart = 0
    target.selectionEnd = target.value.length
    /* eslint-enable no-param-reassign */
  }

  getError() {
    const {
      showError,
      intl: { formatMessage },
    } = this.props
    if (!showError) return null

    return {
      level: 'error',
      message: formatMessage(messages.error),
    }
  }

  render() {
    const {
      sheet: { classes },
      intl: { formatMessage },
      onHide,
      show,
      showInviteLinkFeature,
      inviteLink,
      isInviter,
      onHideError,
      channel,
      conf,
    } = this.props
    const { value, isLoading, message } = this.state

    if (!isInviter) return null

    return (
      <Dialog show={show} onHide={onHide} title={formatMessage(messages.title)}>
        <div className={classes.wrapper}>
          <form className={classes.form} onSubmit={this.onInvite}>
            <EmailsInput
              theme={{ classes }}
              focused
              value={value}
              disabled={isLoading}
              error={this.getError()}
              onChange={this.onInviteesChange}
              clearError={onHideError}
              placeholder={formatMessage(messages.invitePlaceholder)}
            />
            <PersonalMessageInput
              theme={{ classes }}
              value={message}
              disabled={isLoading}
              onChange={this.onMessageChange}
              placeholder={formatMessage(messages.messagesPlaceholder)}
            />
            <div className={classes.submit}>
              <button
                type="submit"
                className={classes.submitButton}
                disabled={!value || isLoading}
              >
                <FormattedMessage
                  id="sendInvites"
                  defaultMessage="Send invitation e-mails"
                />
              </button>
            </div>
            {isLoading && <Spinner overlay />}
          </form>
        </div>
        <InviteLink
          show={showInviteLinkFeature}
          link={inviteLink}
          theme={{ classes }}
          placeholder={formatMessage(messages.loadingLinkPlaceholder)}
          onClick={this.onClickInviteLink}
        />
        <InviteGuests channel={channel} conf={conf} />
      </Dialog>
    )
  }
}
