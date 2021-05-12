import colors from 'grape-theme/dist/base-colors'
import color from 'color'
import fonts from 'grape-theme/dist/fonts'

export const text = {
  ...fonts.small,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

export const amount = {
  letterSpacing: 0,
  fontWeight: 'normal',
  marginLeft: 4,
  opacity: 0.75,
}

export const container = {
  ...fonts.small,
  position: 'relative',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0 12px',
  listStyleType: 'none',
  cursor: 'pointer',
  height: 34,
  color: color(colors.grayDark)
    .alpha(0.7)
    .rgbaString(),
  userSelect: 'none',
}

export const rules = {
  container: {
    extend: container,
    '&:hover': {
      isolate: false,
      color: colors.grayDark,
    },
  },
  containerSelected: {
    composes: '$container',
    color: colors.grayDark,
    boxShadow: `0 2px 0 ${colors.blue}`,
  },
  text,
  amount,
}
