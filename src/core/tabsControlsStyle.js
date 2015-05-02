import colors from 'grape-theme/base-colors'
import webColors from 'grape-theme/web-colors'
import defaults from 'lodash-es/object/defaults'
import Color from 'color'

import * as tabStyle from './tabStyle'

let arrow = defaults({
  position: 'absolute',
  top: 0,
  padding: '0 3px',
  zIndex: 1,
  border: '0px solid ' + Color(colors.grapeDark).darken(.5).rgbaString(),
  '&:hover': {
    background: Color(webColors.roomHeaderBackground).lighten(.2).rgbaString()
  },
}, tabStyle.container)

export default {
  container: {
    position: 'relative',
    margin: 0,
    padding: 0,
    height: 27
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
