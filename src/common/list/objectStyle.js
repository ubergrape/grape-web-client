import colors from 'grape-theme/base-colors'
import fonts from 'grape-theme/fonts'
import utils from 'grape-jss-utils'
import Color from 'color'

import sensorStyle from '../utils/sensorStyle'

export let container = {
  position: 'relative',
  padding: '5px 12px',
  color: colors.grapeTypo,
  cursor: 'pointer',
  userSelect: 'none'
}

let icon = {
  paddingRight: 8
}

export let style = {
  container: {
    extend: [container, utils.ellipsis, fonts.normal]
  },
  containerFocused: {
    extend: [container, utils.ellipsis, fonts.normal],
    color: colors.white,
    background: colors.grapeLight
  },
  sensor: sensorStyle,
  name: {},
  info: {
    extend: fonts.small,
    marginLeft: 8,
    opacity: 0.5
  },
  date: {
    extend: fonts.small,
    marginLeft: 8,
    textTransform: 'uppercase',
    opacity: 0.5,
  },
  icon: {
    extend: [icon],
    color: Color(colors.gainsboroDark).lighten(.2).rgbaString()
  },
  iconFocused: {
    extend: [icon],
    color: colors.gainsboroLight
  }
}
