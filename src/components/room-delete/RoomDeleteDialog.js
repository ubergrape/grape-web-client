import React, {PropTypes, PureComponent} from 'react'
import Icon from 'grape-web/lib/svg-icons/Icon'
import injectSheet from 'grape-web/lib/jss'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import {Input} from 'material-ui/Input'
import {FormControl, FormLabel} from 'material-ui/Form'
import Dialog from '../dialog/Dialog'
import {styles} from './roomDeleteDialogTheme'

const messages = defineMessages({
  title: {
    id: 'roomDeleteDialogTitle',
    defaultMessage: 'Delete "{roomName}"?',
    description: 'Room Delete Dialog: dialog title'
  },
  provideName: {
    id: 'roomDeleteDialogProvideName',
    defaultMessage: 'Please enter the name of the room you want to delete.',
    description: 'Room Delete Dialog: validation message'
  },
  notMatchingName: {
    id: 'roomDeleteDialogNotMatchingName',
    defaultMessage: 'Room name doesn\'t match',
    description: 'Room Delete Dialog: validation message'
  }
})

const getInitialState = validityMessage => ({
  roomName: '',
  invalid: false,
  customValidity: validityMessage
})

@injectSheet(styles)
@injectIntl
export default class RoomDeleteDialog extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    onHide: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    room: PropTypes.object,
    onDelete: PropTypes.func.isRequired
  }

  static defaultProps = {
    room: null
  }

  state = getInitialState(this.props.intl.formatMessage(messages.provideName))

  componentDidUpdate() {
    this.setCustomValidity(this.state.customValidity)
  }

  onChange = (e) => {
    const roomName = e.target.value.trim()
    const {
      room: {name},
      intl: {formatMessage}
    } = this.props

    if (!roomName) {
      this.setState({
        roomName,
        invalid: true,
        customValidity: formatMessage(messages.provideName)
      })
      return
    }

    if (name !== roomName) {
      this.setState({
        roomName,
        invalid: true,
        customValidity: formatMessage(messages.notMatchingName)
      })
      return
    }

    this.setState({
      roomName,
      invalid: false,
      customValidity: ''
    })
  }

  onHide = () => {
    const {
      onHide,
      intl: {formatMessage}
    } = this.props
    this.setState(
      getInitialState(formatMessage(messages.provideName))
    )
    onHide()
  }

  onRefInput = (component) => {
    if (!component) return
    this.input = component.input
    this.setCustomValidity(this.state.customValidity)
  }

  onSubmit = (e) => {
    e.preventDefault()
    const {onDelete, room: {id: roomId}} = this.props
    const {roomName} = this.state
    if (!this.checkValidity()) return
    onDelete({
      roomId,
      roomName
    })
    this.onHide()
  }

  setCustomValidity = (message) => {
    this.input.setCustomValidity(message)
  }

  checkValidity = () => {
    const {customValidity} = this.state
    if (customValidity) {
      this.setState({invalid: true})
      return false
    }
    return true
  }

  render() {
    const {
      intl: {formatMessage},
      classes,
      show,
      room
    } = this.props

    const {
      roomName,
      invalid
    } = this.state

    return (
      <Dialog
        show={show}
        onHide={this.onHide}
        title={formatMessage(messages.title, {roomName: room && room.name})}
      >
        <div className={classes.wrapper}>
          <div className={classes.messageContainer}>
            <Icon name="warning" className={classes.messageIcon} />
            <div className={classes.message}>
              <p>
                <FormattedMessage
                  id="roomDeleteDialogConfirmMessage"
                  defaultMessage="Are you sure you want to delete this room?"
                  description="Room Delete Dialog: confirm (info) message"
                />
              </p>
              <p className={classes.messageWarning}>
                <FormattedMessage
                  id="roomDeleteDialogConfirmWarning"
                  defaultMessage="Warning: This action can't be undone!"
                  description="Room Delete Dialog: confirm (warning) message"
                />
              </p>
            </div>
          </div>
          <form onSubmit={this.onSubmit}>
            <div className={classes.inputContainer}>
              <FormControl error={invalid}>
                <FormLabel htmlFor="room-remove-input">
                  <FormattedMessage
                    id="roomDeleteDialogInputLabel"
                    defaultMessage="Please type in the name of the room to confirm"
                    description="Room Delete Dialog: input label"
                  />
                </FormLabel>
                <Input
                  type="text"
                  id="room-remove-input"
                  required
                  value={roomName}
                  underline={false}
                  ref={this.onRefInput}
                  onChange={this.onChange}
                  placeholder="Confirm room name..."
                  autoComplete="off"
                  error={invalid}
                />
              </FormControl>
            </div>
            <div className={classes.buttonContainer}>
              <button
                type="submit"
                className={classes.deleteButton}
                onClick={this.checkValidity}
              >
                <FormattedMessage
                  id="roomDeleteDialogDelete"
                  defaultMessage="delete"
                  description="Room Delete Dialog: delete button message"
                />
              </button>
            </div>
          </form>
        </div>
      </Dialog>
    )
  }
}
