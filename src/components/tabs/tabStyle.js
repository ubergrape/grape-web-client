import colors from 'grape-theme/base-colors'
import webColors from 'grape-theme/web-colors'
import Color from 'color'
import fonts from 'grape-theme/fonts'

export let text = {
  extend: fonts.small,
  fontWeight: 'bold',
  lineHeight: 0,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  verticalAlign: 'middle'
}

export let amount = {
  letterSpacing: 0,
  fontWeight: 'normal',
  marginLeft: '4px',
  opacity: '0.75'
}

export let container = {
  position: 'relative',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0 16px',
  listStyleType: 'none',
  cursor: 'pointer',
  height: '100%',
  color: Color(colors.white).alpha(.5).rgbaString(),
  background: webColors.roomHeaderBackground,
  userSelect: 'none',
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
  text: text,
  amount: amount
}
