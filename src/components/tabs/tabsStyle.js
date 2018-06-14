import colors from 'grape-theme/dist/base-colors'

export default {
  tabs: {
    display: 'block',
    padding: '0 0 2px 0',
    backgroundColor: colors.white,
    boxShadow: `inset 0 -2px 0 ${colors.silverDark}`,
    overflow: 'hidden',
  },
  inner: {
    display: 'inline-block',
    padding: 0,
    whiteSpace: 'nowrap',
  },
}
