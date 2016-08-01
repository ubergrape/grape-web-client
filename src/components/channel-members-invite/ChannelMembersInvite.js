import React, {PropTypes} from 'react'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

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

const messages = defineMessages({
  pm: {
    id: 'CreateNewPrivateGroup',
    defaultMessage: 'Create new private group'
  },
  room: {
    id: 'InviteToGroup',
    defaultMessage: 'Invite to group'
  }
})

function getFormattedMessage(channelType, mission) {
  if (mission === 'title') return messages[channelType]

  if (mission === 'button') {
    switch (channelType) {
      case 'pm':
        return (
          <FormattedMessage
            id="CreateGroup"
            defaultMessage="Create group" />
        )
      case 'room':
        return (
        <FormattedMessage
          id="InviteMembers"
          defaultMessage="Invite members" />
        )
      default:
        return null
    }
  }

  return null
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
        {getFormattedMessage(channelType, 'button')}
      </button>
    </div>
  )
}

InviteButton.propTypes = {
  listed: PropTypes.array.isRequired,
  channelType: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  inviteToChannel: PropTypes.func.isRequired,
  createRoomFromPmAndInvite: PropTypes.func.isRequired,
  hideChannelMembersInvite: PropTypes.func.isRequired
}

function ChannelMembersInvite(props) {
  const {
    sheet, channelType, setInviteFilterValue,
    addToChannelMembersInvite, removeFromChannelMembersInvite,
    listed, inviteToChannel, createRoomFromPmAndInvite, hideChannelMembersInvite,
    ...rest
  } = props

  if (!channelType) return null

  const {formatMessage} = props.intl
  const {classes} = sheet
  return (
    <ChooseUsersDialog
      {...rest}
      title={formatMessage(getFormattedMessage(channelType, 'title'))}
      theme={{classes}}
      listed={listed}
      onHide={hideChannelMembersInvite}
      onChangeFilter={setInviteFilterValue}
      onSelectUser={addToChannelMembersInvite}
      onRemoveSelectedUser={removeFromChannelMembersInvite}>
      <InviteButton
        theme={{classes}}
        listed={listed}
        channelType={channelType}
        inviteToChannel={inviteToChannel}
        createRoomFromPmAndInvite={createRoomFromPmAndInvite}
        hideChannelMembersInvite={hideChannelMembersInvite} />
    </ChooseUsersDialog>
  )
}

ChannelMembersInvite.propTypes = {
  intl: intlShape.isRequired,
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

export default injectIntl(useSheet(ChannelMembersInvite, style))
