import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import pluck from 'lodash/collection/pluck'
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

const InviteButton = ({ listed, channelType, classes, onClick }) => (
  <div className={classes.submit}>
    <button
      className={classes.buttonInvite}
      onClick={onClick}
      disabled={!listed.length}
    >
      {getFormattedMessage(channelType, 'button')}
    </button>
  </div>
)

InviteButton.propTypes = {
  listed: PropTypes.array.isRequired,
  channelType: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
}

@injectSheet({
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
})
@injectIntl
export default class ChannelMembersInvite extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    sheet: PropTypes.object.isRequired,
    addToChannelMembersInvite: PropTypes.func.isRequired,
    removeFromChannelMembersInvite: PropTypes.func.isRequired,
    inviteToChannel: PropTypes.func.isRequired,
    hideChannelMembersInvite: PropTypes.func.isRequired,
    searchUsersToInvite: PropTypes.func.isRequired,
    showToastNotification: PropTypes.func.isRequired,
    listed: PropTypes.array.isRequired,
    channelType: PropTypes.string,
  }

  onInvite = () => {
    const {
      listed,
      inviteToChannel,
      hideChannelMembersInvite,
      channelType,
      showToastNotification,
    } = this.props

    if (!listed.length) return
    if (channelType === 'room') inviteToChannel(pluck(listed, 'email'))
    hideChannelMembersInvite()
    showToastNotification(
      <InviteSuccess invited={pluck(listed, 'displayName')} />,
    )
  }

  render() {
    const {
      sheet: { classes },
      intl: { formatMessage },
      channelType,
      searchUsersToInvite,
      addToChannelMembersInvite,
      removeFromChannelMembersInvite,
      listed,
      inviteToChannel,
      hideChannelMembersInvite,
      ...rest
    } = this.props

    if (!channelType) return null

    return (
      <ChooseUsersDialog
        {...rest}
        title={formatMessage(getFormattedMessage(channelType, 'title'))}
        theme={{ classes }}
        listed={listed}
        onHide={hideChannelMembersInvite}
        onChangeFilter={searchUsersToInvite}
        onSelectUser={addToChannelMembersInvite}
        onRemoveSelectedUser={removeFromChannelMembersInvite}
      >
        <InviteButton
          classes={classes}
          listed={listed}
          channelType={channelType}
          onClick={this.onInvite}
        />
      </ChooseUsersDialog>
    )
  }
}
