import color from 'color'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import {small, normal, bigger} from 'grape-theme/dist/fonts'
import {blue, grayBlueDark, grayBlue, grayBlueLight, red} from 'grape-theme/dist/base-colors'
import {borderLight, button} from 'grape-theme/dist/web-colors'

import linkButton from '../button/link'
import buttonIcon from '../button/icon'
import {iconSize} from '../room-icon-settings/theme'

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
    textDecoration: 'underline !important'
  }
}

const divider = {
  marginBottom,
  paddingBottom,
  borderBottom: `1px solid ${grayBlueLight}`
}

export const settingsButtonSize = normal.fontSize

export const styles = {
  channelInfo: {
    color: grayBlueDark
  },
  actions: {
    extend: divider,
    marginBottom,
    '& :last-child': {
      marginBottom: 0
    }
  },
  actionItem: {
    marginTop: 10
  },
  buttonInvite: {
    extend: [
      baseButton,
      buttonIcon('invite', {color: blue, hoverColor, size: 18})
    ]
  },
  buttonIntegration: {
    extend: [
      baseButton,
      buttonIcon('iconLink', {color: grayBlueDark, hoverColor, size: 18})
    ],
    color: grayBlueDark
  },
  buttonLeave: {
    extend: [
      baseButton,
      buttonIcon('exit', {color: grayBlueDark, hoverColor, size: 18})
    ],
    color: grayBlueDark
  },
  roomName: {
    extend: bigger,
    width: '100%'
  },
  roomDescription: {
    extend: [normal, divider]
  },
  mainSettings: {
    extend: divider,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    minHeight: iconSize + marginBottom + paddingBottom
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
      marginLeft: 10
    }
  },
  notificationsButtonInherit: buttonIcon('bell', {color: button, hoverColor: blue, iconOnly: true, size: settingsButtonSize}),
  notificationsButtonOff: buttonIcon('bellSlashOpen', {color: blue, hoverColor: blue, iconOnly: true, size: settingsButtonSize}),
  notificationsButtonCustom: buttonIcon('bellOpen', {color: blue, hoverColor: blue, iconOnly: true, size: settingsButtonSize}),
  settingsButton: buttonIcon('cog', {color: button, hoverColor: blue, iconOnly: true, size: settingsButtonSize}),
  additionalActionsDropdown: {},
  additionalActionButton: {
    extend: [linkButton, normal],
    display: 'block',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    width: '100%',
    textAlign: 'left',
    padding: 10,
    borderBottom: `1px solid ${borderLight}`,
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
