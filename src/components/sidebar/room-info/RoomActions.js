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
import { settingsButtonSize } from './constants'

const icon = (name, palette) =>
  buttonIcon(name, {
    color: palette.text.primary,
    hoverColor: palette.secondary.A200,
    size: settingsButtonSize,
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
  baseButton: {
    extend: [linkButton, fonts.small, ellipsis],
    width: '100%',
    textAlign: 'left',
    marginBottom: sizes.spacer.xs,
    '&:hover': {
      isolate: false,
      color: palette.text.primary,
    },
  },
  buttonInvite: {
    composes: '$baseButton',
    extend: icon('invite', palette),
    color: palette.text.secondary,
    display: 'flex',
    '&:hover:before': {
      isolate: false,
      backgroundSize: 'contain',
      content: '""',
      width: settingsButtonSize,
      height: settingsButtonSize,
      cursor: 'pointer',
      marginRight: 5,
      backgroundImage: ({ colors }) =>
        `url('${getColoredIcon({
          name: 'invite',
          color: `${colors.button || blue}`,
        })}')`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '50% 50%',
    },
  },
  buttonIntegration: {
    composes: '$baseButton',
    extend: icon('plug', palette),
    color: palette.text.secondary,
    display: 'flex',
    '&:hover:before': {
      isolate: false,
      backgroundSize: 'contain',
      content: '""',
      width: settingsButtonSize,
      height: settingsButtonSize,
      cursor: 'pointer',
      marginRight: 5,
      backgroundImage: ({ colors }) =>
        `url('${getColoredIcon({
          name: 'plug',
          color: `${colors.button || blue}`,
        })}')`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '50% 50%',
    },
  },
  buttonLeave: {
    composes: '$baseButton',
    extend: icon('leave', palette),
    color: palette.text.secondary,
    display: 'flex',
    '&:hover:before': {
      isolate: false,
      backgroundSize: 'contain',
      content: '""',
      width: settingsButtonSize,
      height: settingsButtonSize,
      cursor: 'pointer',
      marginRight: 5,
      backgroundImage: ({ colors }) =>
        `url('${getColoredIcon({
          name: 'leave',
          color: `${colors.button || blue}`,
        })}')`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '50% 50%',
    },
  },
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
    {permissions.canInviteMembers && (
      <li className={classes.action}>
        <button onClick={onInvite} className={classes.buttonInvite}>
          <FormattedMessage
            id="inviteMoreToGroup"
            defaultMessage="Invite more people to this group"
            description="Room Info Panel: link to invite people to the group/room"
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
