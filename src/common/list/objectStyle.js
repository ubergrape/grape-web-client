import colors from 'grape-theme/base-colors'
import fonts from 'grape-theme/fonts'
import utils from 'grape-jss-utils'

import sensorStyle from '../utils/sensorStyle'

export let container = {
  position: 'relative',
  padding: '5px 7px',
  color: colors.grapeTypo,
  cursor: 'pointer',
  userSelect: 'none'
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
    color: colors.gainsboroLight,
    fontSize: 10,
    marginLeft: 7
  },
  date: {
    extend: fonts.small,
    padding: '0 8px',
    textTransform: 'uppercase'
  },
  icon: {
    color: colors.gainsboroDark,
    paddingRight: 5
  }
}
