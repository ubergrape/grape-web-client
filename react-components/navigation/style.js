import buttonIcon from '../button/icon'
import fonts from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

const commonButton = {
  position: 'relative',
  paddingLeft: 35
}
const contacts = {
  ...buttonIcon('user', {color: colors.grayBlue, hoverColor: colors.grayBlueDark}),
  ...commonButton
}
const groups = {
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
groups['&:before'] = {
  ...groups['&:before'],
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
    padding: '15px 15px 15px 0',
    color: colors.grayBlueDark,
    background: colors.grayBlueLighter
  },
  manage: {
    paddingLeft: 15
  },
  manageItem: {
    marginTop: 10
  },
  contacts,
  groups,
  section: {
    marginTop: 20
  },
  list: {
    marginTop: 10
  },
  title: {
    ...fonts.small,
    lineHeight: '14px', // equal to icon height
    paddingLeft: 18,
    marginLeft: 15,
    textTransform: 'uppercase',
    background: '0 50% no-repeat',
    color: colors.grayBlue
  },
  recent: {
    backgroundImage: `url("${getColoredIcon({name: 'timeMachine', color: colors.grayBlue})}")`
  },
  channel: {
    padding: '3px 42px 3px 15px',
    cursor: 'pointer',
    borderRadius: '0 100px 100px 0',
    // XXX
    '&:hover': {
      background: '#d9dee5'
    }
  },
  currentRoom: {
    color: colors.white
  },
  currentPM: {
    background: colors.blue,
    color: colors.white,
    '&:hover': {
      background: colors.blue
    }
  }
}
