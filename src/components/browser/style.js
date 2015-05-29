import colors from 'grape-theme/base-colors'

export default {
  browser: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: colors.white,
    borderRadius: '3px',
    overflow: 'hidden',
    boxShadow: '0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15)',
    transform: 'scaleX(1) translate3d(0, 0, 0)',
    animation: 'hifromthebottom 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },
  column: {
    flex: 9,
    overflow: 'hidden'
  },
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  leftColumn: {
    flex: 6,
    overflowY: 'scroll'
  },
  rightColumn: {
    flex: 4,
    minWidth: 256,
    maxWidth: 384,
    overflowX: 'hidden',
    overflowY: 'scroll'
  }
}
