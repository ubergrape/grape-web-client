import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import {gray, grayDarker, blue, white} from 'grape-theme/dist/base-colors'
import {borderDefault, alertDanger} from 'grape-theme/dist/web-colors'
import {small, big} from 'grape-theme/dist/fonts'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import color from 'color'

import reset from '../button/reset'
import {iconSize, height} from './constants'

const button = {
  ...reset,
  fontSize: iconSize,
  display: 'inline-block',
  width: 34,
  height: 34,
  borderRadius: '100%',
  background: 'no-repeat 50% 50%',
  backgroundSize: ['auto', iconSize],
  cursor: 'pointer',
  verticalAlign: 'middle'
}

function getIcon(name, type) {
  let iconColor
  switch (type) {
    case 'hover':
      iconColor = color(blue).lighten(0.2).rgbaString()
      break
    case 'active':
      iconColor = white
      break
    default:
      iconColor = blue
  }
  return `url('${getColoredIcon({name, color: iconColor})}')`
}

const info = {
  ...button,
  backgroundImage: getIcon('info'),
  '&:hover': {
    isolate: false,
    backgroundImage: getIcon('info', 'hover')
  }
}

const infoActive = {
  ...button,
  backgroundColor: blue,
  backgroundImage: getIcon('info', 'active')
}

const action = {
  listStyle: 'none'
}

export const styles = {
  header: {
    display: 'flex',
    height,
    padding: '0 25px',
    alignItems: 'center',
    borderBottom: `1px solid ${borderDefault}`,
    flexShrink: 0
  },
  headerDisabled: {
    opacity: 0.4,
    WebkitFilter: 'grayscale(100%)',
    filter: 'grayscale(100%)',
    pointerEvents: 'none'
  },
  favorite: {
    extend: action,
    flexShrink: 0,
    position: 'relative',
    marginRight: 5
  },
  title: {
    extend: action,
    overflow: 'hidden',
    flexGrow: 1,
    minWidth: 50,
    paddingLeft: 10
  },
  name: {
    ...ellipsis,
    ...big,
    fontWeight: 'bold',
    lineHeight: 1.2,
    color: grayDarker
  },
  description: {
    ...ellipsis,
    ...small,
    lineHeight: 1.2,
    color: gray
  },
  action: {
    extend: action,
    position: 'relative',
    flexShrink: 0,
    marginLeft: 5,
    lineHeight: 0
  },
  searchAction: {
    extend: action,
    marginLeft: 5,
    lineHeight: 0,
    flex: '0 1 237px',
    minWidth: 165
  },
  search: {
    extend: small,
    background: `${white} no-repeat 12px 50%`,
    backgroundImage: `url('${getColoredIcon({name: 'magnifier', color: '#929292'})}')`,
    backgroundSize: 15,
    border: `1px solid ${borderDefault}`,
    padding: '7px 10px 7px 35px',
    color: grayDarker,
    borderRadius: 100,
    outline: 'none',
    width: '100%',
    '&::-webkit-search-cancel-button': {
      isolate: false,
      WebkitAppearance: 'searchfield-cancel-button !important'
    },
    '&:focus': {
      isolate: false,
      borderColor: blue
    }
  },
  invite: {
    ...button,
    backgroundImage: getIcon('invite'),
    '&:hover': {
      isolate: false,
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
      isolate: false,
      backgroundImage: getIcon('fileBold', 'hover')
    }
  },
  filesActive: {
    ...button,
    backgroundColor: blue,
    backgroundImage: getIcon('fileBold', 'active')
  },
  mentions: {
    ...button,
    backgroundImage: getIcon('at'),
    '&:hover': {
      isolate: false,
      backgroundImage: getIcon('at', 'hover')
    }
  },
  mentionsActive: {
    ...button,
    backgroundColor: blue,
    backgroundImage: getIcon('at', 'active')
  },
  labeledMessages: {
    ...button,
    backgroundImage: getIcon('tag'),
    '&:hover': {
      isolate: false,
      backgroundImage: getIcon('tag', 'hover')
    }
  },
  labeledMessagesActive: {
    ...button,
    backgroundColor: blue,
    backgroundImage: getIcon('tag', 'active')
  },
  badge: {
    position: 'absolute',
    boxSizing: 'content-box',
    top: 2,
    right: 2,
    width: 7,
    height: 7,
    background: alertDanger,
    borderRadius: '50%',
    border: `2px solid ${white}`
  }
}
