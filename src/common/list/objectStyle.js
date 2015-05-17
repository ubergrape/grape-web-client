import colors from 'grape-theme/base-colors'
import fonts from 'grape-theme/fonts'
import utils from 'grape-jss-utils'
import Color from 'color'

import sensorStyle from '../utils/sensorStyle'

export let container = {
  display: 'flex',
  height: 42,
  position: 'relative',
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
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '6px',
    width: 40
  },
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
    alignSelf: 'center',
    padding: '6px 0'
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
    display: 'flex',
    alignItems: 'center',
    padding: 6
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
