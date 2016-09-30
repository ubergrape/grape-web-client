import color from 'color'
import mixins from 'grape-web/lib/jss-utils/mixins'
import {small, normal, bigger} from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'

import linkButton from '../button/link'
import buttonIcon from '../button/icon'

const marginBottom = 15
const paddingBottom = 15

const hoverColor = color(colors.blue).lighten(0.05).rgbaString()

const button = {
  extend: [linkButton, normal],
  display: 'block',
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
  borderBottom: `1px solid ${colors.grayBlueLight}`
}

export const additionalActionsButtonSize = normal.fontSize

export const styles = {
  channelInfo: {
    color: colors.grayBlueDark
  },
  header: {
    marginBottom,
    borderBottom: webColors.borderDefault
  },
  description: {
    ...divider
  },
  descriptionText: {
    ...normal
  },
  actions: {
    ...divider,
    marginBottom,
    '& :last-child': {
      marginBottom: 0
    }
  },
  actionItem: {
    marginTop: 10
  },
  buttonInvite: {
    ...button,
    ...buttonIcon('invite', {color: colors.blue, hoverColor, size: 18})
  },
  buttonIntegration: {
    ...button,
    color: colors.grayBlueDark,
    ...buttonIcon('iconLink', {color: colors.grayBlueDark, hoverColor, size: 18})
  },
  buttonLeave: {
    ...button,
    color: colors.grayBlueDark,
    ...buttonIcon('exit', {color: colors.grayBlueDark, hoverColor, size: 18})
  },
  buttonKick: {
    extend: [
      buttonIcon('close', {color: colors.grayBlueDark, hoverColor, iconOnly: true}),
      small
    ],
    flexShrink: 0,
    display: 'none'
  },
  row: {
    display: 'flex',
    marginBottom: 10,
    cursor: 'pointer',
    '&:hover button': {
      display: 'block'
    }
  },
  avatar: {
    borderRadius: '50%',
    flexShrink: 0,
    width: 32,
    height: 32,
    marginRight: 10
  },
  name: {
    ...mixins.ellipsis,
    ...normal,
    flex: 1,
    alignSelf: 'center',
    color: colors.grayBlueDark,
    '&:hover': {
      isolate: false,
      color: hoverColor
    }
  },
  roomName: {
    ...bigger,
    width: '100%'
  },
  roomDescription: {
    ...normal,
    ...divider
  },
  mainSettings: {
    ...divider,
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    ...small,
    textTransform: 'uppercase',
    background: '0 0 no-repeat',
    color: colors.grayBlue
  },
  additionalActions: {
    flexShrink: 0,
    marginLeft: 20
  },
  additionalActionsButton: {
    ...normal,
    ...buttonIcon('cog', {color: webColors.button, hoverColor: colors.blue, iconOnly: true}),
    display: 'block',
    width: additionalActionsButtonSize,
    height: additionalActionsButtonSize
  },
  additionalActionButton: {
    ...linkButton,
    ...normal,
    display: 'block',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    width: '100%',
    textAlign: 'left',
    padding: '10px',
    borderBottom: `1px solid ${webColors.borderLight}`,
    '&:hover': {
      isolate: false,
      color: colors.red,
      textDecoration: 'underline'
    }
  },
  deleteRoomButton: {
    color: colors.red
  },
  settingsWrapper: {
    flexShrink: 0
  }
}
