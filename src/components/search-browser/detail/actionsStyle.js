import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'

export default {
  action: {
    display: 'flex',
    padding: '5px 15px',
    cursor: 'pointer',
    color: colors.grayBlueDark
  },
  actionFocused: {
    background: webColors.buttonBgDefault,
    color: colors.white
  },
  // When parent component is not focused, but action is.
  actionFocusedInactive: {
    background: colors.grayBlueLighter
  },
  icon: {
    flexShrink: 0,
    width: 16,
    height: 16,
    marginRight: 10,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    alignSelf: 'center'
  },
  text: {
    flex: 1
  }
}
