import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import reset from '../button/reset'
import color from 'color'
import colors from 'grape-theme/dist/base-colors'

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

const {blue} = colors
const lightBlue = color(blue).lighten(0.2).rgbaString()

function getIcon(name, hover) {
  return `url('${getColoredIcon({name, color: hover ? lightBlue : blue})}')`
}

export default {
  header: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: 56,
    padding: '0 25px',
    '&:after': {
      position: 'absolute',
      zIndex: 1,
      left: 0,
      right: 0,
      bottom: '-1px',
      height: '1px',
      background: 'rgba(0,0,0,0.15)',
      content: '""'
    }
  },
  title: {
    width: '100%'
  },
  actions: {
    display: 'flex',
    alignItems: 'center'
  },
  action: {
    lineHeight: 0
  },
  invite: {
    ...button,
    backgroundImage: getIcon('invite'),
    '&:hover': {
      backgroundImage: getIcon('invite', true)
    }
  },
  info: {
    ...button,
    backgroundImage: getIcon('info'),
    '&:hover': {
      backgroundImage: getIcon('info', true)
    }
  },
  files: {
    ...button,
    backgroundImage: getIcon('fileBold'),
    '&:hover': {
      backgroundImage: getIcon('fileBold', true)
    }
  },
  mentions: {
    ...button,
    backgroundImage: getIcon('at'),
    '&:hover': {
      backgroundImage: getIcon('at', true)
    }
  },
  support: {
    ...button,
    backgroundImage: getIcon('help'),
    '&:hover': {
      backgroundImage: getIcon('help', true)
    }
  }
}
