import colors from 'grape-theme/base-colors'
import webColors from 'grape-theme/web-colors'
import fonts from 'grape-theme/fonts'
import defaults from 'lodash-es/object/defaults'
import Color from 'color'

import * as tabStyle from './tabStyle'

let arrow = defaults({
  position: 'absolute',
  top: 0,
  padding: '0 12px',
  extend: fonts.small,
  color: Color(colors.grapeTypo).alpha(.3).rgbaString(),
  zIndex: 1,
  border: '0px solid ' + colors.silverDark,
  backgroundColor: colors.white,
  '&:hover': {
    color: Color(colors.grapeTypo).alpha(.6).rgbaString(),
  },
}, tabStyle.container)

export default {
  container: {
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
