import React, {Component, PropTypes} from 'react'
import uniq from 'lodash/array/uniq'
import {useSheet} from 'grape-web/lib/jss'
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
    justInvited: PropTypes.bool.isRequired,
    hideInviteToOrg: PropTypes.func.isRequired,
    getInviteToOrgLink: PropTypes.func.isRequired,
    clearInviteToOrgError: PropTypes.func.isRequired,
    clearJustInvited: PropTypes.func.isRequired,
    inviteToOrg: PropTypes.func.isRequired
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
      isInviter, show, orgId, clearJustInvited,
      inviteLink, getInviteToOrgLink, justInvited
    } = nextProps

    if (isInviter && show && !inviteLink && orgId) getInviteToOrgLink()

    if (justInvited) {
      this.setState({
        invited: uniq(this.state.value.split(', ')),
        loading: false,
        value: ''
      })
      return
    }

    this.setState({invited: [], loading: false}, clearJustInvited)
  }

  onInviteesChange = ({target: {value}}) => {
    this.setState({value, invited: []}, this.props.clearJustInvited)
  }

  onMessageChange = ({target: {value}}) => {
    this.setState({message: value}, this.props.clearJustInvited)
  }

  onInvite = e => {
    e.preventDefault()
    this.setState({loading: true}, () => {
      this.props.inviteToOrg({
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
      isInviter, clearInviteToOrgError
    } = this.props

    if (!isInviter) return null
    const {value, invited, loading, message} = this.state
    return (
      <Dialog
        show={show}
        onHide={hideInviteToOrg}
        title={formatMessage(messages.title)}>
        <div className={classes.wrapper}>
          <form
            className={classes.form}
            onSubmit={this.onInvite}>
            <EmailsInput
              theme={{classes}}
              value={value}
              disabled={loading}
              error={this.getError()}
              onChange={this.onInviteesChange}
              clearError={clearInviteToOrgError}
              placeholder={formatMessage(messages.invitePlaceholder)} />
            <PersonalMessageInput
              theme={{classes}}
              value={message}
              disabled={loading}
              onChange={this.onMessageChange}
              placeholder={formatMessage(messages.messagesPlaceholder)} />
            <JustInvited
              theme={{classes}}
              invited={invited} />
            <div className={classes.submit}>
              <button
                type="submit"
                className={classes.submitButton}
                disabled={!value || loading}>
                <FormattedMessage
                  id="sendInvites"
                  defaultMessage="Send invitation emails" />
              </button>
            </div>
            {loading && <Spinner image={spinner} size={32} />}
          </form>
          <InviteLink
            show={inviteLinkFeature}
            link={inviteLink}
            theme={{classes}}
            placeholder={formatMessage(messages.loadingLinkPlaceholder)}
            onClick={this.onClickInviteLink} />
        </div>
      </Dialog>
    )
  }
}
