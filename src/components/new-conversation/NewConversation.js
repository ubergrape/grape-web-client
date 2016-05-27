import React, {Component, PropTypes} from 'react'
import sample from 'lodash/collection/sample'
import {colors, icons} from 'grape-theme/dist/room-settings'
import {useSheet} from 'grape-web/lib/jss'

import style from './style'
import ChooseUsersDialog from '../choose-users-dialog/ChooseUsersDialog'
import Settings from './Settings'

function FooterButtons(props) {
  const {
    listed, showRoomSettings,
    onClickSettings, theme
  } = props
  const {classes} = theme
  return (
    <div className={classes.footer}>
      <div>
        {!showRoomSettings &&
          <button
            className={classes.roomSettingsButton}
            onClick={onClickSettings}>
            Advanced Options
          </button>
        }
      </div>
      <button
        className={classes.createButton}
        disabled={!listed.length}>
        Create
      </button>
    </div>
  )
}

FooterButtons.propTypes = {
  listed: PropTypes.array.isRequired,
  showRoomSettings: PropTypes.bool.isRequired,
  onClickSettings: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
}

const initialState = {
  name: '',
  isPrivate: false,
  color: sample(colors),
  icon: sample(icons),
  showRoomSettings: false,
  roomNameFocused: false
}

@useSheet(style)
export default class NewConversation extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    addToNewConversation: PropTypes.func.isRequired,
    removeFromNewConversation: PropTypes.func.isRequired,
    hideNewConversation: PropTypes.func.isRequired,
    filterNewConversation: PropTypes.func.isRequired,
    listed: PropTypes.array.isRequired
  }

  constructor() {
    super()
    this.state = initialState
  }

  componentWillReceiveProps({show}) {
    if (!show) this.setState({...initialState})
  }

  onSetRoomIcon = icon => {
    this.setState({icon})
  }

  onSetRoomColor = color => {
    this.setState({color})
  }

  onClickRoomName = ({target}) => {
    this.setState({roomNameFocused: true}, () => target.focus())
  }

  onBlurRoomName = () => {
    this.setState({roomNameFocused: false})
  }

  onChangeRoomName = ({target}) => {
    this.setState({name: target.value})
  }

  onPrivacyChange = () => {
    this.setState({isPrivate: !this.state.isPrivate})
  }

  onClickSettings = () => {
    this.setState({showRoomSettings: true})
  }

  render() {
    const {
      sheet,
      hideNewConversation,
      filterNewConversation,
      addToNewConversation,
      removeFromNewConversation
    } = this.props

    const {classes} = sheet
    return (
      <ChooseUsersDialog
        {...this.props}
        title="New Conversation"
        onHide={this.onHide}
        theme={{classes}}
        preventFilterFocus={this.state.roomNameFocused}
        beforeList={(
          <Settings
            {...this.props}
            {...this.state}
            onChangeRoomName={this.onChangeRoomName}
            onPrivacyChange={this.onPrivacyChange}
            onClickRoomName={this.onClickRoomName}
            onBlurRoomName={this.onBlurRoomName}
            onSetRoomColor={this.onSetRoomColor}
            onSetRoomIcon={this.onSetRoomIcon}
            theme={{classes}} />
        )}
        onHide={hideNewConversation}
        onChangeFilter={value => filterNewConversation(value)}
        onSelectUser={user => addToNewConversation(user)}
        onRemoveSelectedUser={user => removeFromNewConversation(user)}>
        <FooterButtons
          {...this.props}
          {...this.state}
          onClickSettings={this.onClickSettings}
          theme={{classes}} />
      </ChooseUsersDialog>
    )
  }
}
