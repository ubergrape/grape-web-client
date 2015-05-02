import colors from 'grape-theme/base-colors'
import webColors from 'grape-theme/web-colors'
import Color from 'color'
import fonts from 'grape-theme/fonts'

import sensorStyle from '../common/utils/sensorStyle'

export let text = {
  extend: fonts.small,
  color: Color(colors.white).alpha(.5).rgbaString(),
  fontWeight: 'bold',
  lineHeight: 0,
  textTransform: 'uppercase',
  verticalAlign: 'middle'
}

export let container = {
  position: 'relative',
  display: 'inline-block',
  padding: '0 16px',
  listStyleType: 'none',
  cursor: 'pointer',
  height: '100%',
  background: webColors.roomHeaderBackground,
  userSelect: 'none',
  lineHeight: 1.7,
  '& span': text
}

export let style = {
  container: {
    extend: container,
    '&:hover': {
      background: Color(webColors.roomHeaderBackground).lighten(.2).rgbaString()
    }
  },
  containerSelected: {
    extend: container,
    background: colors.grapeLight,
    color: colors.white
  },
  sensor: sensorStyle
}
