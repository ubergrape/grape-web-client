import {small, normal, bigger} from 'grape-theme/dist/fonts'
import {blue, grayDark, grayBlueDark, grayBlue, red} from 'grape-theme/dist/base-colors'
import {borderLight} from 'grape-theme/dist/web-colors'

import {settingsButtonSize} from './constants'
import {iconSize as roomIconSize} from '../../room-icon-settings'
import linkButton from '../../button/link'
import buttonIcon from '../../button/icon'
import {spacing} from '../constants'

const marginBottom = 15
const paddingBottom = 15

export const styles = {
  channelInfo: {
    display: 'block',
    color: grayBlueDark,
    padding: spacing
  },
  roomName: {
    extend: bigger,
    width: '100%',
    color: grayDark
  },
  roomDescription: {
    extend: [normal],
    color: grayDark
  },
  mainSettings: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    minHeight: roomIconSize + marginBottom + paddingBottom
  },
  title: {
    extend: small,
    textTransform: 'uppercase',
    background: '0 0 no-repeat',
    color: grayBlue
  },
  additionalActions: {
    display: 'flex',
    flexShrink: 0,
    '& > *': {
      isolate: false,
      marginLeft: 10
    }
  },
  notificationsButtonInherit: buttonIcon('bell', {color: grayDark, hoverColor: blue, iconOnly: true, size: settingsButtonSize}),
  notificationsButtonOff: buttonIcon('bellMuted', {color: grayDark, hoverColor: blue, iconOnly: true, size: settingsButtonSize}),
  notificationsButtonCustom: buttonIcon('bellCustom', {color: grayDark, hoverColor: blue, iconOnly: true, size: settingsButtonSize}),
  settingsButton: buttonIcon('cog', {color: grayDark, hoverColor: blue, iconOnly: true, size: settingsButtonSize}),
  additionalActionsDropdown: {},
  additionalActionButton: {
    extend: [linkButton, normal],
    display: 'block',
    whiteSpace: 'nowrap',
    width: '100%',
    textAlign: 'left',
    padding: 10,
    borderBottom: [1, 'solid', borderLight],
    '&:hover': {
      isolate: false,
      color: red,
      textDecoration: 'underline'
    }
  },
  deleteRoomButton: {
    color: red
  },
  settingsWrapper: {
    flexShrink: 0
  }
}
