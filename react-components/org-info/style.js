import color from 'color'
import fonts from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'

import buttonIcon from '../button/icon'

const headers = {
  whiteSpace: 'nowrap',
  lineHeight: 'initial',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}

export default {
  orgInfo: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '100%',
    padding: '0 10px 0 20px',
    height: 56,
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
  headers: {
    flexGrow: 1,
    cursor: 'default'
  },
  logo: {
    position: 'relative',
    overflow: 'hidden',
    marginRight: 10,
    borderRadius: '50%'
  },
  orgName: {
    ...fonts.normal,
    ...headers,
    lineHeight: `${fonts.normal.fontSize}px`,
    color: colors.black
  },
  userName: {
    ...fonts.small,
    ...headers,
    color: '#999999'
  },
  settings: {
    ...buttonIcon('cog', {color: colors.blue, hoverColor: color(colors.blue).lighten(0.2).rgbaString(), iconOnly: true}),
    fontSize: 18,
    height: 18,
    display: 'block'
  }
}
