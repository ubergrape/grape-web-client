import {small} from 'grape-theme/dist/fonts'
import color from 'color'
import colors from 'grape-theme/dist/base-colors'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

import buttonIcon from '../button/icon'

const button = {
  extend: small,
  lineHeight: 1.7,
  position: 'relative',
  display: 'block',
  width: '100%',
  paddingLeft: 35,
  textAlign: 'left',
  color: colors.grayBlueDark,
  cursor: 'pointer',
  '&:hover': {
    isolate: false,
    color: colors.grayDark
  }
}

const darkenBackground = color(colors.grayBlueLighter).darken(0.05).hexString()
const buttonSettings = {color: colors.grayDark, hoverColor: colors.blue}
const newConversation = {
  ...buttonIcon('createConversation', buttonSettings),
  ...button
}
const contacts = {
  ...buttonIcon('users', buttonSettings),
  ...button
}
const channels = {
  ...buttonIcon('conversations', buttonSettings),
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
  color: colors.grayBlueDark
}

export const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    userSelect: 'none',
    flex: 1,
    // Fixes flex box bug in Firefox.
    overflowY: 'hidden',
    background: colors.grayBlueLighter
  },
  navigation: {
    overflowY: 'auto',
    flex: '1 0'
  },
  navigationWrapper: {
    display: 'block',
    padding: [15, 0],
    height: '100%'
  },
  manage: {
    paddingLeft: 15
  },
  manageItem: {
    display: 'block',
    marginTop: 10,
    listStyle: 'none'
  },
  newConversation,
  contacts,
  channels,
  section: {
    display: 'block',
    marginTop: 20
  },
  list: {
    display: 'block',
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
  unjoinedTitle: {
    ...title,
    marginTop: 20,
    marginBottom: 10
  },
  recent: {
    backgroundImage: `url(${getColoredIcon({name: 'timeMachine', color: colors.grayBlueDark})})`,
    backgroundSize: 'auto 12px',
    backgroundPosition: '0 2px'
  },
  favorites: {
    backgroundImage: `url(${getColoredIcon({name: 'starFilled', color: colors.grayBlueDark})})`,
    backgroundSize: 'auto 13px',
    backgroundPosition: '0 2px'
  },
  channel: {
    extend: small,
    display: 'block',
    padding: [3, 15],
    '&:hover $channelName': {
      isolate: false,
      color: colors.grayDark
    },
    '&, & *': {
      isolate: false,
      cursor: 'pointer'
    }
  },
  channelInner: {
    display: 'flex',
    alignItems: 'center'
  },
  channelCurrent: {
    color: colors.grayDarker,
    background: darkenBackground,
    '& $channelName': {
      isolate: false,
      fontWeight: 'bold',
      color: colors.grayDarker
    }
  },
  channelFocused: {
    background: darkenBackground
  },
  channelName: {
    color: colors.grayBlueDark
  },
  avatarName: {
    flexGrow: 1
  },
  sign: {
    extend: small,
    fontWeight: 'normal',
    minWidth: 24,
    padding: [1, 7, 0],
    textAlign: 'center',
    borderRadius: 50,
    color: colors.white
  },
  importantSign: {
    background: colors.green
  },
  defaultSign: {
    background: colors.grayBlueDark
  },
  filter: {
    flexShrink: 0,
    padding: 8,
    background: colors.grayBlueLighter
  },
  filterInput: {
    extend: small,
    background: `${darkenBackground} no-repeat 10px 50%`,
    backgroundImage: `url(${getColoredIcon({name: 'conversationsSearch', color: colors.grayBlueDark})})`,
    backgroundSize: 19,
    border: 'none',
    padding: [7, 5, 6, 35],
    color: colors.grayDarker,
    borderRadius: 6,
    outline: 'none',
    width: '100%',
    '&::-webkit-search-cancel-button': {
      isolate: false,
      WebkitAppearance: 'searchfield-cancel-button !important'
    },
    '&:focus': {
      isolate: false,
      backgroundImage: `url(${getColoredIcon({name: 'conversationsSearch', color: colors.grayDark})})`
    }
  }
}
