import React, {Component, PropTypes} from 'react'
import sample from 'lodash/collection/sample'
import {colors, icons} from 'grape-theme/dist/room-settings'
import {useSheet} from 'grape-web/lib/jss'

import style from './style'
import ChooseUsersDialog from '../choose-users-dialog/ChooseUsersDialog'
import RoomSettings from './RoomSettings'

function FooterButtons(props) {
  const {
    listed, roomSettingsOn,
    showNewConversationRoomSettings, theme
  } = props
  const {classes} = theme
  return (
    <div className={classes.footer}>
      <div>
        {!roomSettingsOn &&
          <button
            className={classes.roomSettingsButton}
            onClick={showNewConversationRoomSettings}>
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
  roomSettingsOn: PropTypes.bool.isRequired,
  showNewConversationRoomSettings: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
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
    this.state = {
      name: '',
      color: sample(colors),
      icon: sample(icons)
    }
  }

  onSetRoomIcon = (icon) => {
    this.setState({icon})
  }

  onSetRoomColor = (color) => {
    this.setState({color})
  }

  render() {
    const {
      sheet,
      hideNewConversation,
      filterNewConversation,
      addToNewConversation,
      removeFromNewConversation
    } = this.props

    const {color, icon} = this.state

    const {classes} = sheet
    return (
      <ChooseUsersDialog
        {...this.props}
        title="New Conversation"
        theme={{classes}}
        beforeList={
          <RoomSettings
            {...this.props}
            channel={{icon, color}}
            onSetRoomIcon={this.onSetRoomIcon}
            onSetRoomColor={this.onSetRoomColor}
            theme={{classes}} />
        }
        onHide={() => hideNewConversation()}
        onChangeFilter={value => filterNewConversation(value)}
        onSelectUser={user => addToNewConversation(user)}
        onRemoveSelectedUser={user => removeFromNewConversation(user)}>
        <FooterButtons {...this.props} theme={{classes}} />
      </ChooseUsersDialog>
    )
  }
}
