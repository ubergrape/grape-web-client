import React, {PropTypes, PureComponent} from 'react'
import Icon from 'grape-web/lib/svg-icons/Icon'
import injectSheet from 'grape-web/lib/jss'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'
import uniqueId from 'lodash/utility/uniqueId'
import Button from 'material-ui/Button'
import Input from 'material-ui/Input'
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
  },
  inputPlaceholder: {
    id: 'roomDeleteDialoginputPlaceholder',
    defaultMessage: 'Confirm room name...',
    description: 'Room Delete Dialog: input\'s placeholder'
  }
})

const getInitialState = () => ({
  roomName: '',
  isValid: true,
  errorMessage: null
})

const ConfirmMessage = ({classes}) => (
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
)

const ConfirmForm = ({
  classes,
  value,
  onSubmit,
  onChange,
  onRefInput,
  onInvalid,
  isValid,
  errorMessage,
  inputId = uniqueId(),
  inputPlaceholder
}) => (
  <form onSubmit={onSubmit}>
    <div className={classes.inputContainer}>
      <FormControl error={!isValid}>
        <FormLabel htmlFor={inputId}>
          <FormattedMessage
            id="roomDeleteDialogInputLabel"
            defaultMessage="Please type in the name of the room to confirm"
            description="Room Delete Dialog: input label"
          />
        </FormLabel>
        <Input
          type="text"
          id={inputId}
          required
          value={value}
          ref={onRefInput}
          onChange={onChange}
          placeholder={inputPlaceholder}
          autoComplete="off"
          onInvalid={onInvalid}
          error={!isValid}
        />
        {errorMessage && <FormLabel htmlFor={inputId}>{errorMessage}</FormLabel>}
      </FormControl>
    </div>
    <div className={classes.buttonContainer}>
      <Button
        accent
        raised
        type="submit"
        className={classes.deleteButton}
      >
        <FormattedMessage
          id="roomDeleteDialogDelete"
          defaultMessage="delete"
          description="Room Delete Dialog: delete button message"
        />
      </Button>
    </div>
  </form>
)

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

  onChange = (e) => {
    const roomName = e.target.value.trim()
    this.setState({roomName})
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

  onInvalid = (e) => {
    e.preventDefault()
    this.checkValidity()
  }

  checkValidity() {
    const {roomName} = this.state
    const {
      room: {name},
      intl: {formatMessage}
    } = this.props

    if (!roomName) {
      this.setState({
        isValid: false,
        errorMessage: formatMessage(messages.provideName)
      })
      return false
    }

    if (name !== roomName) {
      this.setState({
        isValid: false,
        errorMessage: formatMessage(messages.notMatchingName)
      })
      return false
    }

    this.setState({
      isValid: true,
      errorMessage: null
    })

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
      isValid,
      errorMessage
    } = this.state
    return (
      <Dialog
        show={show}
        onHide={this.onHide}
        title={formatMessage(messages.title, {roomName: room && room.name})}
      >
        <div className={classes.wrapper}>
          <ConfirmMessage classes={classes} />
          <ConfirmForm
            classes={classes}
            value={roomName}
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
