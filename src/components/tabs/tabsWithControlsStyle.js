import colors from 'grape-theme/base-colors'
import fonts from 'grape-theme/fonts'
import defaults from 'lodash-es/object/defaults'
import color from 'color'

import * as tabStyle from './tabStyle'

let arrow = defaults({
  position: 'absolute',
  top: 0,
  padding: '0 12px',
  extend: fonts.small,
  color: color(colors.grapeTypo).alpha(0.3).rgbaString(),
  zIndex: 1,
  border: '0px solid ' + colors.silverDark,
  backgroundColor: colors.white,
  '&:hover': {
    color: color(colors.grapeTypo).alpha(0.6).rgbaString()
  }
}, tabStyle.container)

export default {
  controls: {
    position: 'relative',
    margin: 0,
    padding: 0
  },
  prevArrow: {
    extend: arrow,
    borderRightWidth: 1,
    left: 0
  },
  nextArrow: {
    extend: arrow,
    borderLeftWidth: 1,
    right: 0
  }
}
