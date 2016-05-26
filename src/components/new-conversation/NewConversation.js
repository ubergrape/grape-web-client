import React, {PropTypes} from 'react'

import ChooseUsersDialog from '../choose-users-dialog/ChooseUsersDialog'
import style from './style'
import {useSheet} from 'grape-web/lib/jss'

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

function NewConversation(props) {
  const {
    sheet,
    hideNewConversation,
    filterNewConversation,
    addToNewConversation,
    removeFromNewConversation
  } = props

  const {classes} = sheet
  return (
    <ChooseUsersDialog
      {...props}
      title="New Conversation"
      theme={{classes}}
      beforeList=<span>asd</span>
      onHide={() => hideNewConversation()}
      onChangeFilter={value => filterNewConversation(value)}
      onSelectUser={user => addToNewConversation(user)}
      onRemoveSelectedUser={user => removeFromNewConversation(user)}>
      <FooterButtons {...props} theme={{classes}} />
    </ChooseUsersDialog>
  )
}

NewConversation.propTypes = {
  sheet: PropTypes.object.isRequired,
  addToNewConversation: PropTypes.func.isRequired,
  removeFromNewConversation: PropTypes.func.isRequired,
  hideNewConversation: PropTypes.func.isRequired,
  filterNewConversation: PropTypes.func.isRequired,
  listed: PropTypes.array.isRequired
}

export default useSheet(NewConversation, style)
