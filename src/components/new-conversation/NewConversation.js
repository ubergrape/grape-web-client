import React, {PropTypes} from 'react'

import ChooseUsersDialog from '../choose-users-dialog/ChooseUsersDialog'
import style from './style'
import {useSheet} from 'grape-web/lib/jss'

function onInviteUsersClick(props) {
  const {
    listed,
    inviteToChannel,
    createRoomAndInvite,
    hideChannelMembersInvite,
    channelType
  } = props

  if (!listed.length) return
  if (channelType === 'room') inviteToChannel(listed.map(user => user.username))
  if (channelType === 'pm') createRoomAndInvite(listed)

  hideChannelMembersInvite()
}

function InviteButton(props) {
  const {listed, channelType, theme} = props
  const {classes} = theme
  return (
    <div className={classes.submit}>
      <button
        className={classes.buttonInvite}
        onClick={() => onInviteUsersClick(props)}
        disabled={!listed.length}>
        {channelType === 'pm' ? 'Create group' : 'Invite members'}
      </button>
    </div>
  )
}

InviteButton.propTypes = {
  listed: PropTypes.array.isRequired,
  channelType: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired
}

function getTitle(channelType) {
  switch (channelType) {
    case 'room':
      return 'Invite to group'
    case 'pm':
      return 'Create new private group'
    default:
      return ''
  }
}

function NewConversation(props) {
  console.log(props)
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
      onHide={() => hideNewConversation()}
      onChangeFilter={value => filterNewConversation(value)}
      onSelectUser={user => addToNewConversation(user)}
      onRemoveSelectedUser={user => removeFromNewConversation(user)}>
      <button>hui</button>
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
