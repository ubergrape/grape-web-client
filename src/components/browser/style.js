import colors from 'grape-theme/base-colors'
import sizes from 'grape-theme/sizes'

export default {
  browser: {
    display: 'flex',
    flexDirection: 'column',
    background: colors.silverDark,
    borderRadius: sizes.borderRadius.small,
    overflow: 'hidden',
    boxShadow: '0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15)'
  },
  column: {
    flex: 1,
    display: 'flex'
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row'
  },
  leftColumn: {
    flex: 6,
    overflowY: 'scroll'
  },
  rightColumn: {
    flex: 4,
    display: 'flex',
    minWidth: 256,
    maxWidth: 384,
    overflowX: 'hidden',
    overflowY: 'scroll'
  }
}
