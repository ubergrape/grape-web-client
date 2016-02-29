import buttonIcon from '../button/icon'
import fonts from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

const commonButton = {
  position: 'relative',
  display: 'block',
  width: '100%',
  paddingLeft: 35,
  textAlign: 'left'
}
const contacts = {
  ...buttonIcon('user', {color: colors.grayBlue, hoverColor: colors.grayBlueDark}),
  ...commonButton
}
const channels = {
  ...buttonIcon('users', {color: colors.grayBlue, hoverColor: colors.grayBlueDark}),
  ...commonButton
}
contacts['&:before'] = {
  ...contacts['&:before'],
  position: 'absolute',
  left: 3,
  width: 18,
  height: 21
}
channels['&:before'] = {
  ...channels['&:before'],
  position: 'absolute',
  left: 0,
  width: 24,
  height: 21
}

export default {
  navigation: {
    position: 'absolute',
    left: 0,
    top: 56,
    right: 0,
    bottom: 0,
    overflowY: 'auto',
    userSelect: 'none',
    color: colors.grayBlueDark,
    background: colors.grayBlueLighter
  },
  wrapper: {
    boxSizing: 'border-box',
    padding: '15px 0',
    marginTop: 1,
    height: 'calc(100% - 1px)',
    borderRight: '1px solid rgba(0,0,0,0.1)'
  },
  manage: {
    paddingLeft: 15
  },
  manageItem: {
    marginTop: 10
  },
  contacts,
  channels,
  section: {
    marginTop: 20
  },
  list: {
    marginTop: 10
  },
  title: {
    ...fonts.small,
    paddingLeft: 18,
    marginLeft: 15,
    textTransform: 'uppercase',
    background: '0 0 no-repeat',
    color: colors.grayBlue
  },
  recent: {
    backgroundImage: `url("${getColoredIcon({name: 'timeMachine', color: colors.grayBlue})}")`,
    backgroundSize: 'auto 12px'
  },
  favorites: {
    backgroundImage: `url("${getColoredIcon({name: 'star', color: colors.grayBlue})}")`,
    backgroundSize: 'auto 13px'
  },
  channel: {
    ...fonts.small,
    position: 'relative',
    padding: '3px 42px 3px 3px',
    margin: '0 -1px 0 12px',
    cursor: 'pointer',
    borderRadius: '100px 0 0 100px',
    // TODO: this color should be presented at the grape-theme
    '&:hover': {
      background: '#d9dee5'
    }
  },
  currentChannel: {
    background: colors.white,
    boxShadow: '0 0 3px rgba(0,0,0,0.14)',
    '&:hover': {
      background: colors.white
    }
  },
  sign: {
    fontWeight: 'normal',
    position: 'absolute',
    right: 15,
    top: 9,
    minWidth: 24,
    padding: '1px 7px 0',
    textAlign: 'center',
    borderRadius: 50,
    color: colors.white
  },
  importantSign: {
    background: colors.green
  },
  defaultSign: {
    background: colors.grayBlue
  }
}
