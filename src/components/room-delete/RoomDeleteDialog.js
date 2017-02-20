import React, {PropTypes, PureComponent} from 'react'
import Icon from 'grape-web/lib/svg-icons/Icon'
import injectSheet from 'grape-web/lib/jss'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import TextField from 'material-ui/TextField'
import Dialog from '../dialog/Dialog'
import {styles} from './roomDeleteDialogTheme'

const messages = defineMessages({
  title: {
    id: 'roomDeleteDialogTitle',
    defaultMessage: 'Delete "{roomName}"?'
  }
})

const getInitialState = () => ({
  roomName: ''
})

@injectSheet(styles)
@injectIntl
export default class RoomDeleteDialog extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    onHide: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    room: PropTypes.object
  }

  static defaultProps = {
    room: null
  }

  state = getInitialState()

  onChange = (e) => {
    const roomName = e.target.value.trim()
    this.setState({roomName})
  }

  onHide = () => {
    const {onHide} = this.props
    onHide()
    this.setState(getInitialState())
  }

  onRefInput = (el) => { this.input = el }

  onSubmit = (e) => {
    e.preventDefault()
    const {onDelete, room: {id: roomId, name}} = this.props
    const {roomName} = this.state
    if (!roomName) {
      this.input.setCustomValidity('Please enter the name of the room you want to delete.')
      return
    }
    if (name !== roomName) {
      this.input.setCustomValidity('Room name doesn\'t match')
      return
    }
    onDelete({
      roomId,
      roomName
    })
    this.onHide()
  }

  render() {
    const {
      intl: {formatMessage},
      classes,
      show,
      room
    } = this.props

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
              <p>Are you sure you want to delete this room?</p>
              <p className={classes.messageWarning}>Warning: This action can\'t be undone!</p>
            </div>
          </div>
          <form onSubmit={this.onSubmit}>
            <div className={classes.inputContainer}>
              <TextField
                type="text"
                id="room-remove-input"
                label="Please type in the name of the room to confirm"
                required
                value={this.state.roomName}
                inputProps={{
                  ref: this.onRefInput,
                  onChange: this.onChange,
                  placeholder: 'Confirm room name...'
                }}
              />
              {/* <Input
                type="text"
                value={this.state.roomName}
                placeholder="Confirm room name..."
                onChange={this.onChange}
                autoComplete="off"
                ref={this.onRefInput}
                underline={false}
              />*/}
            </div>
            <div className={classes.buttonContainer}>
              <button type="submit" className={classes.deleteButton}>delete</button>
            </div>
          </form>
        </div>
      </Dialog>
    )
  }
}
