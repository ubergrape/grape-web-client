import React from 'react'
import PropTypes from 'prop-types'
import noop from 'lodash/noop'
import { FormattedMessage } from 'react-intl'
import { blue } from 'grape-theme/dist/base-colors'
import injectSheet from 'grape-web/lib/jss'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'
import sizes from 'grape-theme/dist/sizes'
import fonts from 'grape-theme/dist/fonts'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

import linkButton from '../../button/link'
import buttonIcon from '../../button/icon'
import { settingsButtonSize, settingsLinkSize } from './constants'

const icon = (name, palette) =>
  buttonIcon(name, {
    color: palette.text.primary,
    hoverColor: palette.secondary.A200,
    size: settingsButtonSize,
  })

const baseItemStyle = (palette, type, name) => ({
  extend: [linkButton, fonts.small, ellipsis, icon(name, palette)],
  width: '100%',
  textAlign: 'left',
  marginBottom: sizes.spacer.xs,
  color: palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    isolate: false,
    color: palette.text.primary,
  },
  '&:hover:before': {
    isolate: false,
    backgroundSize: 'contain',
    content: '""',
    width: settingsLinkSize,
    height: settingsLinkSize,
    cursor: 'pointer',
    marginRight: 5,
    backgroundImage: ({ colors }) =>
      `url('${getColoredIcon({
        name,
        color: `${colors[type] || blue}`,
      })}')`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 50%',
  },
})

const styles = ({ palette }) => ({
  action: {
    display: 'block',
    listStyleType: 'none',
    marginTop: sizes.spacer.s,
    '&:first-child': {
      isolate: false,
      marginTop: 0,
    },
    '&:last-child': {
      isolate: false,
      marginBottom: 0,
    },
  },
  membersListLink: baseItemStyle(palette, 'link', 'users'),
  buttonInvite: baseItemStyle(palette, 'button', 'invite'),
  buttonIntegration: baseItemStyle(palette, 'button', 'plug'),
  buttonLeave: baseItemStyle(palette, 'button', 'leave'),
})

const RoomActions = ({
  classes,
  onLeave,
  onInvite,
  onAddIntegration,
  channel,
  permissions,
}) => (
  <ul>
    {permissions.canSeeMembersList && (
      <li className={classes.action}>
        <a href={channel.manageMembersUrl} className={classes.membersListLink}>
          <FormattedMessage
            id="membersList"
            defaultMessage="Edit Members List"
            description="Room Info Panel: link to members list of the current room"
          />
        </a>
      </li>
    )}
    {permissions.canInviteMembers && (
      <li className={classes.action}>
        <button onClick={onInvite} className={classes.buttonInvite}>
          <FormattedMessage
            id="inviteMoreToGroup"
            defaultMessage="Invite more members to this group"
            description="Room Info Panel: invite members to the group/room"
          />
        </button>
      </li>
    )}
    {permissions.canAddIntegration && (
      <li className={classes.action}>
        <button
          onClick={onAddIntegration}
          className={classes.buttonIntegration}
        >
          <FormattedMessage
            id="addServiceIntegration"
            defaultMessage="Add service integration"
            description="Room Info Panel: link to add an integration to the current room"
          />
        </button>
      </li>
    )}
    {permissions.canLeaveChannel && (
      <li className={classes.action}>
        <button onClick={onLeave} className={classes.buttonLeave}>
          <FormattedMessage
            id="leaveChannel"
            defaultMessage="Leave {channel}"
            values={{ channel: channel.name }}
            description="Room Info Panel: leave room link"
          />
        </button>
      </li>
    )}
  </ul>
)

RoomActions.propTypes = {
  classes: PropTypes.object.isRequired,
  onLeave: PropTypes.func,
  onInvite: PropTypes.func,
  onAddIntegration: PropTypes.func,
  channel: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  permissions: PropTypes.object,
}

RoomActions.defaultProps = {
  onLeave: noop,
  onInvite: noop,
  onAddIntegration: noop,
  channel: {
    name: 'Undefined',
  },
  permissions: {},
}

export default injectSheet(styles)(RoomActions)
