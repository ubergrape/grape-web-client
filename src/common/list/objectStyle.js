import colors from 'grape-theme/base-colors'
import fonts from 'grape-theme/fonts'
import utils from 'grape-jss-utils'
import Color from 'color'

import sensorStyle from '../utils/sensorStyle'

export let container = {
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  padding: '6px 12px',
  color: colors.grapeTypo,
  cursor: 'pointer',
  userSelect: 'none',
  borderBottom: '1px solid ' + colors.silverDark
}

let icon = {
  marginBottom: 2
}

let metaItem = {
  extend: fonts.small,
  display: 'block',
  padding: '2px 4px',
  borderRadius: '2px',
  background: colors.silverDark,
  color: colors.gainsboroDark
}

export let style = {
  container: {
    extend: container
  },
  containerFocused: {
    extend: container,
    color: colors.white,
    background: colors.grapeLight
  },
  sensor: sensorStyle,
  icon: {
    extend: icon,
    color: Color(colors.gainsboroDark).lighten(.5).rgbaString()
  },
  iconFocused: {
    extend: icon,
    color: colors.white
  },
  nameContainer: {
    flex: 1,
    marginLeft: 10
  },
  name: {
    extend: [fonts.normal, utils.ellipsis],
    lineHeight: 1.2
  },
  info: {
    extend: [fonts.small, utils.ellipsis],
    marginTop: 4,
    opacity: 0.5
  },
  metaContainer: {
    marginLeft: 8
  },
  metaItem: {
    extend: metaItem
  },
  metaItemFocused: {
    extend: metaItem,
    background: Color(colors.grapeLight).lighten(.2).rgbaString(),
    color: colors.white
  }
}
