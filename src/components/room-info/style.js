import color from 'color'
import mixins from 'grape-web/lib/jss-utils/mixins'
import fonts from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'

import linkButton from '../button/link'
import buttonIcon from '../button/icon'
import buttonReset from '../button/reset'

const marginBottom = 15
const paddingBottom = 15

const button = {
  ...linkButton,
  ...fonts.normal,
  display: 'block',
  marginBottom: marginBottom / 2,
  '&:hover': {
    color: color(colors.blue).lighten(0.05).rgbaString(),
    textDecoration: 'underline !important'
  }
}

const divider = {
  marginBottom,
  paddingBottom,
  borderBottom: `1px solid ${colors.grayBlueLight}`
}

const iconSettingsButton = {
  ...buttonReset,
  display: 'block',
  marginRight: 10,
  padding: 4,
  borderRadius: '50%',
  border: '1px solid'
}

const roomColorButton = {
  ...buttonReset,
  width: 30,
  height: 30,
  padding: 2,
  borderRadius: '50%',
  border: '1px solid transparent',
  backgroundClip: 'content-box'
}


export default {
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
    ...fonts.normal
  },
  actions: {
    ...divider,
    marginBottom,
    '& :last-child': {
      marginBottom: 0
    }
  },
  buttonInvite: {
    ...button,
    ...buttonIcon('invite', {color: colors.blue, hoverColor: color(colors.blue).lighten(0.05).rgbaString()})
  },
  buttonLeave: {
    ...button,
    color: '#707782',
    ...buttonIcon('exit', {color: colors.grayBlueDark, hoverColor: color(colors.blue).lighten(0.05).rgbaString()})
  },
  buttonKick: {
    ...buttonIcon('close', {color: colors.grayBlueDark, hoverColor: color(colors.blue).lighten(0.05).rgbaString(), iconOnly: true}),
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
    ...fonts.normal,
    flex: 1,
    alignSelf: 'center',
    color: colors.grayBlueDark,
    '&:hover': {
      color: color(colors.blue).lighten(0.05).rgbaString()
    }
  },
  roomName: {
    ...fonts.bigger,
    width: '100%'
  },
  roomDescription: {
    ...fonts.normal,
    ...divider
  },
  mainSettings: {
    ...divider,
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    ...fonts.small,
    textTransform: 'uppercase',
    background: '0 0 no-repeat',
    color: colors.grayBlue
  },
  additionalActions: {
    marginLeft: 20
  },
  additionalActionsButton: {
    ...fonts.normal,
    ...buttonIcon('cog', {color: webColors.button, hoverColor: colors.blue, iconOnly: true}),
    display: 'block',
    width: fonts.normal.fontSize,
    height: fonts.normal.fontSize
  },
  additionalActionButton: {
    ...linkButton,
    ...fonts.normal,
    display: 'block',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    width: '100%',
    textAlign: 'left',
    padding: '10px',
    borderBottom: `1px solid ${webColors.borderLight}`,
    '&:hover': {
      color: colors.red,
      textDecoration: 'underline'
    }
  },
  deleteRoomButton: {
    color: colors.red
  },
  iconSettingsButton: {
    ...iconSettingsButton,
    borderColor: 'transparent'
  },
  iconSettingsButtonActive: {
    ...iconSettingsButton,
    borderColor: webColors.link
  },
  iconSettings: {
    boxSizing: 'border-box',
    width: 310,
    padding: 15,
    paddingRight: 10
  },
  roomColorItem: {
    display: 'inline-block',
    marginRight: 5,
    '&::last-child': {
      marginRight: 0
    }
  },
  roomColorButton: {
    ...roomColorButton,
    borderColor: webColors.borderDefault,
    boxShadow: `inset 0 0 0 2px ${colors.white}, 0 1px 1px rgba(0,0,0,0.1)`
  },
  roomColorButtonActive: {
    ...roomColorButton,
    borderColor: webColors.link
  }
}
