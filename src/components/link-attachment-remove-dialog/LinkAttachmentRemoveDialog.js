/* eslint-disable jsx-a11y/label-has-for */

import React, {PropTypes, PureComponent} from 'react'
import parseUrl from 'grape-web/lib/parse-url'
import injectSheet from 'grape-web/lib/jss'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'
import Button from 'material-ui/Button'

import Dialog from '../dialog/Dialog'
import {styles} from './theme'

const messages = defineMessages({
  title: {
    id: 'linkAttachmentRemoveDialogTitle',
    description: 'Link attachment Remove Dialog: modal dialog title',
    defaultMessage: 'Remove attachment'
  },
  option1: {
    id: 'linkAttachmentRemoveDialogAdminDomain',
    description: 'Link attachment Remove Dialog: remove all the links from this domain',
    defaultMessage: 'All links from {domain}'
  },
  option2: {
    id: 'linkAttachmentRemoveDialogAdminLinkForOrg',
    description: 'Link attachment Remove Dialog: remove this link for the entire org',
    defaultMessage: 'Just the link {url}'
  },
  cancel: {
    id: 'linkAttachmentRemoveDialogCancel',
    description: 'Link attachment Remove Dialog: close the dialog without removing the attachment',
    defaultMessage: 'Cancel'
  },
  confirm: {
    id: 'linkAttachmentRemoveDialogConfirm',
    description: 'Link attachment Remove Dialog: confirm attachment removal',
    defaultMessage: 'Yes, remove'
  }
})

const getInitialState = () => ({
  type: 0,
  isChecked: false
})

@injectSheet(styles)
@injectIntl
export default class LinkAttachmentRemoveDialog extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    onHide: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    channelId: PropTypes.number,
    messageId: PropTypes.string,
    onRemove: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    url: PropTypes.string
  }

  static defaultProps = {
    isAdmin: false,
    channelId: null,
    messageId: null,
    url: null
  }

  state = getInitialState()

  componentWillReceiveProps(nextProps) {
    if (!nextProps.show) {
      this.setState(getInitialState())
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    const {type} = this.state
    const {
      channelId,
      messageId,
      url,
      onRemove,
      onHide
    } = this.props

    onRemove({
      channelId,
      messageId,
      type,
      url
    })
    onHide()
  }

  onCancel = (e) => {
    e.preventDefault()
    this.props.onHide()
  }

  onCheck = () => {
    this.setState({
      isChecked: !this.state.isChecked,
      type: this.state.isChecked ? 0 : this.state.type || 1
    })
  }

  onSelect = (e) => {
    this.setState({
      type: Number(e.target.value)
    })
  }

  renderAdminForm() {
    const {
      classes,
      url,
      intl: {formatMessage}
    } = this.props
    const {isChecked} = this.state

    return (
      <fieldset className={classes.adminField}>
        <label className={classes.container}>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={this.onCheck}
          />
          <FormattedMessage
            id="linkAttachmentRemoveDialogAdminCheckbox"
            description="Link attachment Remove Dialog: admin checkbox to remove the link for the organization"
            defaultMessage="Disable future attachments from this website?"
          />
        </label>
        <label className={classes.container}>
          <select
            name="type"
            disabled={!isChecked}
            onChange={this.onSelect}
            className={classes.select}
          >
            <option value="1">
              {formatMessage(messages.option1, {domain: parseUrl(url).host})}
            </option>
            <option value="2">
              {formatMessage(messages.option2, {url})}
            </option>
          </select>
        </label>
      </fieldset>
    )
  }

  render() {
    const {
      intl: {formatMessage},
      classes,
      show,
      isAdmin,
      onHide
    } = this.props

    return (
      <Dialog
        show={show}
        onHide={onHide}
        title={formatMessage(messages.title)}
      >
        <form
          method="post"
          onSubmit={this.onSubmit}
          className={classes.wrapper}
        >
          <FormattedMessage
            id="linkAttachmentRemoveDialogMessage"
            description="Link attachment Remove Dialog: ask user to confirm removal."
            defaultMessage="Are you sure you wish to remove this attachment from the message?"
          />
          {isAdmin && this.renderAdminForm()}
          <div className={classes.buttons}>
            <Button
              raised
              onClick={this.onCancel}
            >
              {formatMessage(messages.cancel)}
            </Button>
            <Button
              raised
              accent
              className={classes.submitButton}
              type="submit"
            >
              {formatMessage(messages.confirm)}
            </Button>
          </div>
        </form>
      </Dialog>
    )
  }
}
