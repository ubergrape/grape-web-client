import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { intlShape, injectIntl } from 'react-intl'
import { borderDefault } from 'grape-theme/dist/web-colors'

import Dialog from '../dialog/Dialog'
import Form from './Form'
import Message from './Message'
import messages from './messages'

const getInitialState = () => ({
  groupName: '',
  isValid: true,
  errorMessage: null,
})

const styles = {
  root: {
    display: 'block',
    padding: 20,
    borderTop: {
      width: 3,
      style: 'solid',
      color: borderDefault,
    },
    maxHeight: '80vh',
    overflowY: 'auto',
  },
}

class RoomDeleteDialog extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    onHide: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    room: PropTypes.object,
    onDelete: PropTypes.func.isRequired,
  }

  static defaultProps = {
    room: null,
  }

  state = getInitialState()

  onChange = e => {
    this.setState({ groupName: e.target.value })
  }

  onHide = () => {
    this.setState(getInitialState())
    this.props.onHide()
  }

  onRefInput = component => {
    if (!component) return
    this.input = component.input
  }

  onSubmit = e => {
    e.preventDefault()
    const {
      onDelete,
      room: { id: roomId },
    } = this.props
    const { groupName } = this.state
    if (!this.checkValidity()) return
    onDelete({
      roomId,
      groupName,
    })
    this.onHide()
  }

  onInvalid = e => {
    e.preventDefault()
    this.checkValidity()
  }

  checkValidity() {
    const { groupName } = this.state
    const {
      room: { name },
      intl: { formatMessage },
    } = this.props

    if (!groupName) {
      this.setState({
        isValid: false,
        errorMessage: formatMessage(messages.provideName),
      })
      return false
    }

    if (name !== groupName) {
      this.setState({
        isValid: false,
        errorMessage: formatMessage(messages.notMatchingName),
      })
      return false
    }

    this.setState({
      isValid: true,
      errorMessage: null,
    })

    return true
  }

  render() {
    const {
      intl: { formatMessage },
      classes,
      show,
      room,
    } = this.props

    const { groupName, isValid, errorMessage } = this.state

    return (
      <Dialog
        show={show}
        onHide={this.onHide}
        title={formatMessage(messages.title, { groupName: room && room.name })}
      >
        <div className={classes.root}>
          <Message />
          <Form
            value={groupName}
            onSubmit={this.onSubmit}
            onChange={this.onChange}
            onRefInput={this.onRefInput}
            onInvalid={this.onInvalid}
            isValid={isValid}
            errorMessage={errorMessage}
            inputPlaceholder={formatMessage(messages.inputPlaceholder)}
          />
        </div>
      </Dialog>
    )
  }
}

export default injectSheet(styles)(injectIntl(RoomDeleteDialog))
