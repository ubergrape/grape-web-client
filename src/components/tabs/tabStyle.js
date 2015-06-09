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
  padding: '0 12px',
  listStyleType: 'none',
  cursor: 'pointer',
  height: '32px',
  color: Color(colors.grapeTypo).alpha(.7).rgbaString(),
  userSelect: 'none',
}

export let style = {
  container: {
    extend: container,
    '&:hover': {
      color: colors.grapeTypo
    }
  },
  containerSelected: {
    extend: container,
    color: colors.grapeTypo,
    boxShadow: '0 2px 0 ' + colors.grapeLight
  },
  text: text,
  amount: amount
}
