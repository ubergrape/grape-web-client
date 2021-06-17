import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'

export default {
  browser: {
    display: 'flex',
    flexDirection: 'column',
    background: colors.white,
    borderRadius: 6,
    overflow: 'hidden',
    boxShadow: [
      '0 5px 11px 0 rgba(0, 0, 0, 0.18)',
      '0 4px 15px 0 rgba(0, 0, 0, 0.15)',
    ].join(','),
    '& a': {
      color: webColors.link,
    },
  },
  column: {
    flex: 1,
    display: 'flex',
    minHeight: 1, // firefox 34+ flexbox bug workaround
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    minWidth: 1, // firefox 34+ flexbox bug workaround
  },
  leftColumn: {
    flex: 6,
    overflowY: 'scroll',
  },
  rightColumn: {
    flex: 4,
    minWidth: 256,
    maxWidth: 384,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
}
