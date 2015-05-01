import colors from 'grape-theme/base-colors'
import webColors from 'grape-theme/web-colors'
import fonts from 'grape-theme/fonts'
import defaults from 'lodash-es/object/defaults'
import Color from 'color'

import * as tabStyle from './tabStyle'

let arrow = defaults({
  position: 'absolute',
  top: 0,
  padding: '0 3px',
  '&:hover': {
    background: Color(webColors.roomHeaderBackground).lighten(.2).rgbaString()
  },
  zIndex: 1,
  border: '0px solid ' + Color(colors.grapeDark).darken(.5).rgbaString(),
}, tabStyle.container)

export default {
  container: {
    position: 'relative',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    height: 27,
    whiteSpace: 'nowrap'
  },
  leftArrow: {
    extend: arrow,
    borderRightWidth: 1,
    left: 0
  },
  tabs: {
    display: 'block',
    padding: '0 10px',
    height: '100%',
    overflowX: 'hidden'
  },
  rightArrow: {
    extend: arrow,
    borderLeftWidth: 1,
    right: 0
  }
}
