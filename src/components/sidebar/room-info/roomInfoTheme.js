import color from 'color'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import {small, normal, bigger} from 'grape-theme/dist/fonts'
import {blue, grayDark, grayBlueDark, grayBlue, grayBlueLight, red} from 'grape-theme/dist/base-colors'
import {borderLight} from 'grape-theme/dist/web-colors'
import {icon as iconSize} from 'grape-theme/dist/sizes'

import {settingsButtonSize} from './constants'
import {iconSize as roomIconSize} from '../../room-icon-settings'
import linkButton from '../../button/link'
import buttonIcon from '../../button/icon'
import {spacing} from '../constants'

const marginBottom = 15
const paddingBottom = 15

const hoverColor = color(blue).lighten(0.05).rgbaString()

const baseButton = {
  extend: [linkButton, normal, ellipsis],
  width: '100%',
  textAlign: 'left',
  marginBottom: marginBottom / 2,
  '&:hover': {
    isolate: false,
    color: hoverColor,
    textDecoration: 'underline'
  }
}

const divider = {
  display: 'block',
  marginBottom,
  paddingBottom,
  borderBottom: [1, 'solid', grayBlueLight]
}

export const styles = {
  channelInfo: {
    display: 'block',
    color: grayBlueDark,
    padding: spacing
  },
  actions: {
    extend: divider,
    marginBottom,
    '& > :last-child': {
      isolate: false,
      marginBottom: 0
    }
  },
  actionItem: {
    display: 'block',
    listStyleType: 'none',
    marginTop: 10
  },
  buttonInvite: {
    extend: [
      baseButton,
      buttonIcon('invite', {color: blue, hoverColor, size: iconSize.s})
    ],
    color: blue
  },
  buttonIntegration: {
    extend: [
      baseButton,
      buttonIcon('iconLink', {color: grayBlueDark, hoverColor, size: iconSize.s})
    ],
    color: grayBlueDark
  },
  buttonLeave: {
    extend: [
      baseButton,
      buttonIcon('exit', {color: grayDark, hoverColor, size: iconSize.s})
    ],
    color: grayDark
  },
  roomName: {
    extend: bigger,
    width: '100%',
    color: grayDark
  },
  roomDescription: {
    extend: [normal, divider],
    color: grayDark
  },
  mainSettings: {
    extend: divider,
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
  notificationsButtonInherit: buttonIcon('bell', {stroke: grayDark, hoverStroke: blue, iconOnly: true, size: settingsButtonSize}),
  notificationsButtonOff: buttonIcon('bellSlashOpen', {stroke: grayDark, hoverStroke: blue, iconOnly: true, size: settingsButtonSize}),
  notificationsButtonCustom: buttonIcon('bellOpen', {stroke: grayDark, hoverStroke: blue, iconOnly: true, size: settingsButtonSize}),
  settingsButton: buttonIcon('cog', {stroke: grayDark, hoverStroke: blue, iconOnly: true, size: settingsButtonSize}),
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
