import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { map } from 'lodash'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl,
} from 'react-intl'
import { white } from 'grape-theme/dist/base-colors'
import injectSheet from 'grape-web/lib/jss'

import ChooseUsersDialog from '../choose-users-dialog/ChooseUsersDialog'
import { InviteSuccess } from '../i18n/i18n'
import buttonPrimary from '../button/primary'
import buttonIcon from '../button/icon'

const messages = defineMessages({
  pm: {
    id: 'createNewPrivateGroup',
    defaultMessage: 'Create new private group',
  },
  room: {
    id: 'inviteToGroup',
    defaultMessage: 'Invite to group',
  },
})

function getFormattedMessage(channelType, mission) {
  if (mission === 'title') return messages[channelType]

  if (mission === 'button') {
    switch (channelType) {
      case 'pm':
        return (
          <FormattedMessage id="createGroup" defaultMessage="Create group" />
        )
      case 'room':
        return (
          <FormattedMessage
            id="inviteMembers"
            defaultMessage="Invite members"
          />
        )
      default:
        return null
    }
  }

  return null
}

const InviteButton = ({ listed, channel, classes, onClick }) => (
  <div className={classes.submit}>
    <button
      className={classes.buttonInvite}
      onClick={onClick}
      disabled={!listed.length}
    >
      {getFormattedMessage(channel.type, 'button')}
    </button>
  </div>
)

InviteButton.propTypes = {
  listed: PropTypes.array.isRequired,
  channel: PropTypes.object,
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
}

InviteButton.defaultProps = {
  channel: {},
}

class ChannelMembersInvite extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    sheet: PropTypes.object.isRequired,
    channel: PropTypes.object,
    addToChannelMembersInvite: PropTypes.func.isRequired,
    removeFromChannelMembersInvite: PropTypes.func.isRequired,
    inviteToChannel: PropTypes.func.isRequired,
    goTo: PropTypes.func.isRequired,
    hideChannelMembersInvite: PropTypes.func.isRequired,
    searchUsersToInvite: PropTypes.func.isRequired,
    showToastNotification: PropTypes.func.isRequired,
    listed: PropTypes.array.isRequired,
  }

  static defaultProps = {
    channel: {},
  }

  onInvite = () => {
    const {
      listed,
      inviteToChannel,
      hideChannelMembersInvite,
      channel,
      showToastNotification,
    } = this.props

    if (!listed.length) return
    if (channel.type === 'room') inviteToChannel(map(listed, 'email'))
    hideChannelMembersInvite()
    showToastNotification(
      <InviteSuccess invited={map(listed, 'displayName')} />,
    )
  }

  render() {
    const {
      sheet: { classes },
      intl: { formatMessage },
      channel,
      searchUsersToInvite,
      goTo,
      addToChannelMembersInvite,
      removeFromChannelMembersInvite,
      listed,
      inviteToChannel,
      hideChannelMembersInvite,
      ...rest
    } = this.props

    if (!channel.type) return null

    return (
      <ChooseUsersDialog
        {...rest}
        title={formatMessage(getFormattedMessage(channel.type, 'title'))}
        theme={{ classes }}
        listed={listed}
        onHide={hideChannelMembersInvite}
        onChangeFilter={searchUsersToInvite}
        onSelectUser={addToChannelMembersInvite}
        onRemoveSelectedUser={removeFromChannelMembersInvite}
        goTo={goTo}
        channel={channel}
        showInviteGuests
        showEmailToInvite={false}
      >
        <InviteButton
          classes={classes}
          listed={listed}
          channel={channel}
          onClick={this.onInvite}
        />
      </ChooseUsersDialog>
    )
  }
}

export default injectSheet({
  submit: {
    display: 'block',
    marginTop: 20,
    textAlign: 'right',
  },
  buttonInvite: {
    extend: [buttonIcon('invite', { color: white }), buttonPrimary],
    '&:disabled': {
      isolate: false,
      opacity: 0.5,
      pointerEvents: 'none',
    },
  },
})(injectIntl(ChannelMembersInvite))
