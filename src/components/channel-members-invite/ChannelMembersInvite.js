import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import ChooseUsersDialog from '../choose-users-dialog/ChooseUsersDialog'
import {styles} from './theme'

const messages = defineMessages({
  pm: {
    id: 'createNewPrivateGroup',
    defaultMessage: 'Create new private group'
  },
  room: {
    id: 'inviteToGroup',
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
            id="createGroup"
            defaultMessage="Create group" />
        )
      case 'room':
        return (
          <FormattedMessage
            id="inviteMembers"
            defaultMessage="Invite members" />
        )
      default:
        return null
    }
  }

  return null
}

const InviteButton = ({listed, channelType, classes, onClick}) => (
  <div className={classes.submit}>
    <button
      className={classes.buttonInvite}
      onClick={onClick}
      disabled={!listed.length}>
      {getFormattedMessage(channelType, 'button')}
    </button>
  </div>
)

InviteButton.propTypes = {
  listed: PropTypes.array.isRequired,
  channelType: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
}

@injectSheet(styles)
@injectIntl
export default class ChannelMembersInvite extends PureComponent {
  static propTypes = {
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

  onInvite = () => {
    const {
      listed, inviteToChannel, createRoomFromPmAndInvite,
      hideChannelMembersInvite, channelType
    } = this.props

    if (!listed.length) return
    if (channelType === 'room') inviteToChannel(listed.map(user => user.username))
    if (channelType === 'pm') createRoomFromPmAndInvite(listed)

    hideChannelMembersInvite()
  }

  render() {
    const {
      sheet: {classes},
      intl: {formatMessage},
      channelType, setInviteFilterValue,
      addToChannelMembersInvite, removeFromChannelMembersInvite,
      listed, inviteToChannel, createRoomFromPmAndInvite, hideChannelMembersInvite,
      ...rest
    } = this.props

    if (!channelType) return null

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
          classes={classes}
          listed={listed}
          channelType={channelType}
          onClick={this.onInvite} />
      </ChooseUsersDialog>
    )
  }
}
