import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import reset from '../button/reset'
import color from 'color'
import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'
import fonts from 'grape-theme/dist/fonts'
import mixins from 'grape-web/lib/jss-utils/mixins'

const headerHeight = 56

const button = {
  ...reset,
  fontSize: 22,
  display: 'inline-block',
  width: 34,
  height: 34,
  borderRadius: '100%',
  background: 'no-repeat 50% 50%',
  backgroundSize: 'auto 22px'
}

function getIcon(name, type) {
  let iconColor
  switch (type) {
    case 'hover':
      iconColor = color(colors.blue).lighten(0.2).rgbaString()
      break
    case 'active':
      iconColor = colors.white
      break
    default:
      iconColor = colors.blue
  }
  return `url('${getColoredIcon({name, color: iconColor})}')`
}

const info = {
  ...button,
  backgroundImage: getIcon('info'),
  '&:hover': {
    backgroundImage: getIcon('info', 'hover')
  }
}

const infoActive = {
  ...button,
  backgroundColor: colors.blue,
  backgroundImage: getIcon('info', 'active')
}

export default {
  headerWrapper: {
    position: 'relative',
    height: headerHeight,
    padding: '0 25px',
    '&:after': {
      position: 'absolute',
      zIndex: 1,
      left: 0,
      right: 0,
      bottom: -1,
      height: 1,
      background: 'rgba(0,0,0,0.15)',
      content: '""'
    }
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: headerHeight
  },
  headerDisabled: {
    opacity: 0.4,
    WebkitFilter: 'grayscale(100%)',
    filter: 'grayscale(100%)',
    pointerEvents: 'none'
  },
  favorite: {
    flexShrink: 0,
    position: 'relative',
    marginRight: 5
  },
  title: {
    overflow: 'hidden',
    flexGrow: 1,
    minWidth: 50,
    paddingLeft: 10,
    boxSizing: 'border-box'
  },
  name: {
    ...mixins.ellipsis,
    ...fonts.big,
    fontWeight: 'bold',
    lineHeight: 1.2,
    color: colors.grayDark
  },
  description: {
    ...mixins.ellipsis,
    ...fonts.small,
    lineHeight: 1.2,
    color: colors.gray
  },
  action: {
    position: 'relative',
    flexShrink: 0,
    marginLeft: 5,
    lineHeight: 0
  },
  searchAction: {
    marginLeft: 5,
    lineHeight: 0,
    flex: '0 1 237px',
    minWidth: 165
  },
  search: {
    boxSizing: 'border-box !important',
    background: `${colors.white} no-repeat 12px 50%`,
    backgroundImage: `url('${getColoredIcon({name: 'magnifier', color: '#929292'})}')`,
    backgroundSize: 15,
    border: '1px solid #d3d3d3',
    padding: '7px 10px 7px 35px',
    color: colors.grayDark,
    borderRadius: 100,
    outline: 'none',
    width: '100%',
    '&::-webkit-search-cancel-button': {
      WebkitAppearance: 'searchfield-cancel-button !important'
    },
    '&:focus': {
      borderColor: colors.blue
    }
  },
  invite: {
    ...button,
    backgroundImage: getIcon('invite'),
    '&:hover': {
      backgroundImage: getIcon('invite', 'hover')
    }
  },
  room: info,
  pm: info,
  roomActive: infoActive,
  pmActive: infoActive,
  files: {
    ...button,
    backgroundImage: getIcon('fileBold'),
    '&:hover': {
      backgroundImage: getIcon('fileBold', 'hover')
    }
  },
  filesActive: {
    ...button,
    backgroundColor: colors.blue,
    backgroundImage: getIcon('fileBold', 'active')
  },
  mentions: {
    ...button,
    backgroundImage: getIcon('at'),
    '&:hover': {
      backgroundImage: getIcon('at', 'hover')
    }
  },
  mentionsActive: {
    ...button,
    backgroundColor: colors.blue,
    backgroundImage: getIcon('at', 'active')
  },
  badge: {
    position: 'absolute',
    boxSizing: 'content-box',
    top: 2,
    right: 2,
    width: 7,
    height: 7,
    background: webColors.alertDanger,
    borderRadius: '50%',
    border: `2px solid ${colors.white}`
  },
  intercom: {
    ...button,
    backgroundImage: getIcon('help'),
    '&:hover': {
      backgroundImage: getIcon('help', 'hover')
    }
  },
  intercomActive: {
    ...button,
    backgroundColor: colors.blue,
    backgroundImage: getIcon('help', 'active')
  }
}
