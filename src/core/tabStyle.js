import colors from 'grape-theme/base-colors'
import webColors from 'grape-theme/web-colors'
import Color from 'color'
import fonts from 'grape-theme/fonts'

let container = {
  extend: fonts.small,
  position: 'relative',
  display: 'inline-block',
  padding: '8px 16px 8px',
  listStyleType: 'none',
  cursor: 'pointer',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  color: Color(colors.white).alpha(.5).rgbaString()
}

export default {
  container: {
    extend: container,
    '&:hover': {
      background: Color(webColors.roomHeaderBackground).lighten(.2).rgbaString()
    }
  },
  containerSelected: {
    extend: container,
    background: colors.grapeLight,
    color: colors.white,
    '&:after': {
      position: 'absolute',
      top: '100%',
      left: '50%',
      content: '" "',
      height: 0,
      width: 0,
      border: '6px solid transparent',
      borderTopColor: colors.grapeLight,
      marginLeft: '-6px'
    }
  }
}
