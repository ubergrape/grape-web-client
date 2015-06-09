import colors from 'grape-theme/base-colors'
import sizes from 'grape-theme/sizes'

export default {
  container: {
    display: 'flex',
    flexDirection: 'column',
    background: colors.white,
    borderRadius: sizes.borderRadius.small,
    overflow: 'hidden',
    boxShadow: '0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15)'
  }
}
