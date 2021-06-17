import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import defaults from 'lodash/defaults'
import color from 'color'

import * as tabStyle from './tabStyle'

const arrow = defaults(
  {
    position: 'absolute',
    top: 0,
    padding: '0 12px',
    ...fonts.small,
    color: color(colors.grayDark)
      .alpha(0.3)
      .rgbaString(),
    zIndex: 1,
    border: `0px solid ${colors.silverDark}`,
    backgroundColor: colors.white,
    '&:hover': {
      isolate: false,
      color: color(colors.grayDark)
        .alpha(0.6)
        .rgbaString(),
    },
  },
  tabStyle.container,
)

export default {
  controls: {
    position: 'relative',
    margin: 0,
    padding: 0,
  },
  prevArrow: {
    ...arrow,
    borderRightWidth: 1,
    left: 0,
  },
  nextArrow: {
    ...arrow,
    borderLeftWidth: 1,
    right: 0,
  },
}
