import React, {PropTypes} from 'react'

import ChooseUsersDialog from '../choose-users-dialog/ChooseUsersDialog'
import style from './style'
import {useSheet} from 'grape-web/lib/jss'

function onInviteUsersClick(props) {
  const {
    listed, inviteToChannel, createRoomFromPmAndInvite,
    hideChannelMembersInvite, channelType
  } = props

  if (!listed.length) return
  if (channelType === 'room') inviteToChannel(listed.map(user => user.username))
  if (channelType === 'pm') createRoomFromPmAndInvite(listed)

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

function ChannelMembersInvite(props) {
  const {
    sheet, channelType, hideChannelMembersInvite,
    setInviteFilterValue, addToChannelMembersInvite,
    removeFromChannelMembersInvite
  } = props

  // TODO: return `null` once upgraded to React 0.15.
  if (!channelType) return <noscript />

  const {classes} = sheet
  return (
    <ChooseUsersDialog
      {...props}
      title={getTitle(props.channelType)}
      theme={{classes}}
      onHide={() => hideChannelMembersInvite()}
      onChangeFilter={value => setInviteFilterValue(value)}
      onSelectUser={user => addToChannelMembersInvite(user)}
      onRemoveSelectedUser={user => removeFromChannelMembersInvite(user)}>
      <InviteButton {...props} theme={{classes}} />
    </ChooseUsersDialog>
  )
}

ChannelMembersInvite.propTypes = {
  sheet: PropTypes.object.isRequired,
  addToChannelMembersInvite: PropTypes.func.isRequired,
  removeFromChannelMembersInvite: PropTypes.func.isRequired,
  inviteToChannel: PropTypes.func.isRequired,
  createRoomFromPmAndInvite: PropTypes.func.isRequired,
  hideChannelMembersInvite: PropTypes.func.isRequired,
  setInviteFilterValue: PropTypes.func.isRequired,
  listed: PropTypes.array.isRequired,
  channelType: PropTypes.string
}

export default useSheet(ChannelMembersInvite, style)
