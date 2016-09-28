import buttonIcon from '../button/icon'
import {small, normal} from 'grape-theme/dist/fonts'
import color from 'color'
import colors from 'grape-theme/dist/base-colors'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

const button = {
  extend: small,
  lineHeight: `${normal.fontSize * normal.lineHeight}px`,
  position: 'relative',
  display: 'block',
  width: '100%',
  paddingLeft: 35,
  textAlign: 'left'
}
const darkenBackground = color(colors.grayBlueLighter).darken(0.05).hexString()
const buttonSettings = {color: colors.grayBlue, hoverColor: colors.grayBlueDark}
const newConversation = {
  ...buttonIcon('pencilWindow', buttonSettings),
  ...button
}
const contacts = {
  ...buttonIcon('user', buttonSettings),
  ...button
}
const channels = {
  ...buttonIcon('users', buttonSettings),
  ...button
}
newConversation['&:before'] = {
  ...newConversation['&:before'],
  position: 'absolute',
  left: 3,
  width: 21,
  height: 21
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

const title = {
  ...small,
  marginLeft: 15,
  textTransform: 'uppercase',
  background: '0 0 no-repeat',
  color: colors.grayBlue
}

export default {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    top: 56,
    right: 0,
    bottom: 0,
    userSelect: 'none',
    color: colors.grayBlueDark,
    background: colors.grayBlueLighter
  },
  navigation: {
    overflowY: 'auto',
    flex: '1 0'
  },
  navigationWrapper: {
    boxSizing: 'border-box',
    padding: '15px 0',
    height: '100%'
  },
  manage: {
    paddingLeft: 15
  },
  manageItem: {
    marginTop: 10,
    listStyle: 'none'
  },
  newConversation,
  contacts,
  channels,
  section: {
    marginTop: 20
  },
  list: {
    marginTop: 10
  },
  notFound: {
    padding: 10,
    textAlign: 'center'
  },
  title: {
    ...title,
    paddingLeft: 18
  },
  unJoinedTitle: {
    ...title,
    marginTop: 20,
    marginBottom: 10
  },
  recent: {
    backgroundImage: `url(${getColoredIcon({name: 'timeMachine', color: colors.grayBlue})})`,
    backgroundSize: 'auto 12px',
    backgroundPosition: '0 2px'
  },
  favorites: {
    backgroundImage: `url(${getColoredIcon({name: 'star', color: colors.grayBlue})})`,
    backgroundSize: 'auto 13px',
    backgroundPosition: '0 2px'
  },
  channel: {
    ...small,
    position: 'relative',
    padding: '3px 42px 3px 15px',
    cursor: 'pointer',
    '&:hover': {
      isolate: false,
      background: darkenBackground
    }
  },
  channelCurrent: {
    fontWeight: 'bold',
    color: colors.grayDark,
    background: darkenBackground
  },
  channelFocused: {
    background: darkenBackground
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
  },
  filter: {
    flexShrink: 0,
    padding: 8,
    background: colors.grayBlueLighter
  },
  filterInput: {
    extend: small,
    boxSizing: 'border-box !important',
    background: `${darkenBackground} no-repeat 10px 50%`,
    backgroundImage: `url(${getColoredIcon({name: 'searchFilter', color: colors.grayBlue})})`,
    backgroundSize: 19,
    border: 'none',
    padding: '7px 5px 6px 35px',
    color: colors.grayDark,
    borderRadius: 6,
    outline: 'none',
    width: '100%',
    '&::-webkit-search-cancel-button': {
      WebkitAppearance: 'searchfield-cancel-button !important'
    }
  }
}
