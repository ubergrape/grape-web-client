import React, {PureComponent, PropTypes} from 'react'
import uniq from 'lodash/array/uniq'
import injectSheet from 'grape-web/lib/jss'
import Spinner from 'grape-web/lib/spinner/Spinner'
import {spinner} from '../../constants/images'

import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import {styles} from './inviteToOrgTheme'
import Dialog from '../dialog/Dialog'

import InviteLink from './InviteLink'
import EmailsInput from './EmailsInput'
import PersonalMessageInput from './PersonalMessageInput'
import JustInvited from './JustInvited'

const messages = defineMessages({
  title: {
    id: 'inviteToOrgTitle',
    defaultMessage: 'Invite people to your organization'
  },
  invitePlaceholder: {
    id: 'inviteToOrgNote',
    defaultMessage: 'Invite multiple users at once, just separate their email addresses with a comma.'
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

@injectSheet(styles)
@injectIntl
export default class InviteToOrg extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    show: PropTypes.bool.isRequired,
    showError: PropTypes.bool.isRequired,
    showInviteLinkFeature: PropTypes.bool.isRequired,
    inviteLink: PropTypes.string.isRequired,
    orgId: PropTypes.number,
    isInviter: PropTypes.bool.isRequired,
    showJustInvited: PropTypes.bool.isRequired,
    hideJustInvited: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    getIniviteLink: PropTypes.func.isRequired,
    onHideError: PropTypes.func.isRequired,
    onInvite: PropTypes.func.isRequired
  }

  constructor() {
    super()
    this.state = {
      invited: [],
      message: '',
      value: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      isInviter, show, orgId, hideJustInvited,
      inviteLink, getIniviteLink, showJustInvited
    } = nextProps

    if (isInviter && show && !inviteLink && orgId) getIniviteLink()

    if (showJustInvited) {
      this.setState({
        invited: uniq(this.state.value.split(', ')),
        isLoading: false,
        value: ''
      })
      return
    }

    this.setState({invited: [], isLoading: false}, hideJustInvited)
  }

  onInviteesChange = ({target: {value}}) => {
    this.setState({value, invited: []}, this.props.hideJustInvited)
  }

  onMessageChange = ({target: {value}}) => {
    this.setState({message: value}, this.props.hideJustInvited)
  }

  onInvite = e => {
    e.preventDefault()
    this.setState({isLoading: true}, () => {
      this.props.onInvite({
        emails: this.state.value,
        message: this.state.message
      })
    })
  }

  onClickInviteLink = ({target}) => {
    target.selectionStart = 0
    target.selectionEnd = target.value.length
  }

  getError() {
    const {showError, intl: {formatMessage}} = this.props
    if (!showError) return null

    return {
      level: 'error',
      message: formatMessage(messages.error)
    }
  }

  render() {
    const {
      sheet: {classes},
      intl: {formatMessage},
      onHide, show,
      showInviteLinkFeature, inviteLink,
      isInviter, onHideError
    } = this.props
    const {value, invited, isLoading, message} = this.state

    if (!isInviter) return null

    return (
      <Dialog
        show={show}
        onHide={onHide}
        title={formatMessage(messages.title)}>
        <div className={classes.wrapper}>
          <form
            className={classes.form}
            onSubmit={this.onInvite}>
            <EmailsInput
              theme={{classes}}
              focused
              value={value}
              disabled={isLoading}
              error={this.getError()}
              onChange={this.onInviteesChange}
              clearError={onHideError}
              placeholder={formatMessage(messages.invitePlaceholder)} />
            <PersonalMessageInput
              theme={{classes}}
              value={message}
              disabled={isLoading}
              onChange={this.onMessageChange}
              placeholder={formatMessage(messages.messagesPlaceholder)} />
            <JustInvited
              theme={{classes}}
              invited={invited} />
            <div className={classes.submit}>
              <button
                type="submit"
                className={classes.submitButton}
                disabled={!value || isLoading}>
                <FormattedMessage
                  id="sendInvites"
                  defaultMessage="Send invitation emails" />
              </button>
            </div>
            {isLoading && <Spinner image={spinner} size={32} />}
          </form>
          <InviteLink
            show={showInviteLinkFeature}
            link={inviteLink}
            theme={{classes}}
            placeholder={formatMessage(messages.loadingLinkPlaceholder)}
            onClick={this.onClickInviteLink} />
        </div>
      </Dialog>
    )
  }
}
