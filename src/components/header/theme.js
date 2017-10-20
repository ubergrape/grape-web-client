import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import {gray, grayDarker, grayBlueDark, blue, white} from 'grape-theme/dist/base-colors'
import {borderDefault} from 'grape-theme/dist/web-colors'
import {small, big} from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'

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

export const styles = ({palette}) => {
  const getIcon = (name, type) => {
    let color
    switch (type) {
      case 'hover':
        color = palette.accent.A200
        break
      case 'active':
        color = palette.accent.A200
        break
      default:
        color = palette.text.primary
    }
    return `url('${getColoredIcon({name, color})}')`
  }

  return {
    header: {
      display: 'flex',
      height,
      padding: [0, 25],
      alignItems: 'center',
      borderBottom: [1, 'solid', borderDefault],
      flexShrink: 0
    },
    headerDisabled: {
      opacity: 0.4,
      WebkitFilter: 'grayscale(100%)',
      filter: 'grayscale(100%)',
      pointerEvents: 'none'
    },
    favorite: {
      listStyle: 'none',
      flexShrink: 0,
      position: 'relative',
      marginRight: 5
    },
    title: {
      listStyle: 'none',
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
      listStyle: 'none',
      position: 'relative',
      flexShrink: 0,
      marginLeft: 5,
      lineHeight: 0
    },
    searchAction: {
      listStyle: 'none',
      marginLeft: 5,
      lineHeight: 0,
      flex: [0, 1, 237],
      minWidth: 165
    },
    search: {
      extend: small,
      background: {
        color: white,
        repeat: 'no-repeat',
        position: [12, '50%']
      },
      backgroundImage: `url('${getColoredIcon({name: 'magnifier', color: grayBlueDark})}')`,
      border: [1, 'solid', borderDefault],
      padding: [7, 10, 7, 35],
      color: grayBlueDark,
      borderRadius: sizes.borderRadius.bigger,
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
    sidebar: {
      ...button,
      backgroundImage: getIcon('sidebar'),
      '&:hover': {
        isolate: false,
        backgroundImage: getIcon('sidebar', 'hover')
      }
    },
    sidebarActive: {
      ...button,
      backgroundImage: getIcon('sidebar', 'active'),
      '&:hover': {
        isolate: false,
        backgroundImage: getIcon('sidebar', 'hover')
      }
    },
    pm: {
      composes: '$sidebar'
    },
    pmActive: {
      composes: '$sidebarActive'
    },
    room: {
      composes: '$sidebar'
    },
    roomActive: {
      composes: '$sidebarActive'
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
      backgroundImage: getIcon('tag', 'active')
    }
  }
}
