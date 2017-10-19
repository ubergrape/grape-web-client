import React from 'react'
import PropTypes from 'prop-types'
import noop from 'lodash/utility/noop'
import {FormattedMessage} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import sizes from 'grape-theme/dist/sizes'
import fonts from 'grape-theme/dist/fonts'

import linkButton from '../../button/link'
import buttonIcon from '../../button/icon'
import {settingsButtonSize} from './constants'

const styles = ({palette}) => {
  const iconOptions = {
    color: palette.text.primary,
    hoverColor: palette.accent.A200,
    size: settingsButtonSize
  }

  return {
    action: {
      display: 'block',
      listStyleType: 'none',
      marginTop: sizes.spacer.s,
      '&:first-child': {
        isolate: false,
        marginTop: 0
      },
      '&:last-child': {
        isolate: false,
        marginBottom: 0
      }
    },
    baseButton: {
      extend: [linkButton, fonts.small, ellipsis],
      width: '100%',
      textAlign: 'left',
      marginBottom: sizes.spacer.xs,
      '&:hover': {
        isolate: false,
        color: palette.accent.A200,
        textDecoration: 'underline'
      }
    },
    buttonInvite: {
      composes: '$baseButton',
      extend: buttonIcon('invite', {...iconOptions, color: palette.accent.A200}),
      color: palette.accent.A200
    },
    buttonIntegration: {
      composes: '$baseButton',
      extend: buttonIcon('plug', iconOptions),
      color: palette.text.primary
    },
    buttonLeave: {
      composes: '$baseButton',
      extend: buttonIcon('leave', iconOptions),
      color: palette.text.primary
    }
  }
}

const RoomActions = ({classes, onLeave, onInvite, onAddIntegration, channel}) => (
  <ul>
    <li className={classes.action}>
      <button
        onClick={onInvite}
        className={classes.buttonInvite}
      >
        <FormattedMessage
          id="inviteMoreToGroup"
          defaultMessage="Invite more people to this group"
          description="Room Info Panel: link to invite people to the group/room"
        />
      </button>
    </li>
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
    <li className={classes.action}>
      <button
        onClick={onLeave}
        className={classes.buttonLeave}
      >
        <FormattedMessage
          id="leaveChannel"
          defaultMessage="Leave {channel}"
          values={{channel: channel.name}}
          description="Room Info Panel: leave room link"
        />
      </button>
    </li>
  </ul>
)

RoomActions.propTypes = {
  classes: PropTypes.object.isRequired,
  onLeave: PropTypes.func,
  onInvite: PropTypes.func,
  onAddIntegration: PropTypes.func,
  channel: PropTypes.shape({
    name: PropTypes.string.isRequired
  })
}

RoomActions.defaultProps = {
  onLeave: noop,
  onInvite: noop,
  onAddIntegration: noop,
  channel: {
    name: 'Undefined'
  }
}

export default injectSheet(styles)(RoomActions)
