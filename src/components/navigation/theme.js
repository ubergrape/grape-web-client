import {small} from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import sizes from 'grape-theme/dist/sizes'

const title = {
  ...small,
  marginLeft: sizes.spacer.m,
  textTransform: 'uppercase',
  background: '0 0 no-repeat',
  color: colors.grayBlueDark
}

export const styles = ({palette}) => ({
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
    padding: [sizes.spacer.m, 0],
    height: '100%'
  },
  manage: {
    paddingLeft: sizes.spacer.m
  },
  manageItem: {
    display: 'block',
    marginTop: sizes.spacer.s,
    listStyle: 'none'
  },
  section: {
    display: 'block',
    marginTop: sizes.spacer.m
  },
  list: {
    display: 'block',
    marginTop: sizes.spacer.xs
  },
  notFound: {
    padding: sizes.spacer.s,
    textAlign: 'center'
  },
  title: {
    ...title,
    paddingLeft: sizes.spacer.l
  },
  unjoinedTitle: {
    ...title,
    marginTop: sizes.spacer.l,
    marginBottom: sizes.spacer.s
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
    padding: [3, sizes.spacer.m],
    '&:hover': {
      isolate: false,
      background: palette.blueGrey[70]
    },
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
    background: palette.blueGrey[70],
    '& $channelName': {
      isolate: false,
      fontWeight: 'bold',
      color: colors.grayDarker
    }
  },
  channelFocused: {
    background: palette.blueGrey[70]
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
    minWidth: sizes.spacer.xl,
    padding: [1, 7, 0],
    textAlign: 'center',
    borderRadius: 50,
    color: colors.white
  },
  importantSign: {
    background: colors.green
  },
  defaultSign: {
    background: palette.blueGrey[400]
  },
  filter: {
    flexShrink: 0,
    padding: 8,
    background: colors.grayBlueLighter
  },
  filterInput: {
    extend: small,
    background: `${palette.blueGrey[70]} no-repeat 10px 50%`,
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
})
