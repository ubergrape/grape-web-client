import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'
import fonts from 'grape-theme/dist/fonts'
import mixins from 'grape-web/lib/jss-utils/mixins'

export default {
  service: {
    display: 'flex',
    position: 'relative',
    background: colors.white,
    color: colors.grayDark,
    userSelect: 'none',
    width: '100%',
    '&, & *': {
      isolate: false,
      cursor: 'pointer',
    },
  },
  serviceFocused: {
    color: colors.white,
    background: webColors.buttonBgDefault,
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 16px',
    fontSize: '1.2em',
  },
  name: {
    ...fonts.normal,
    ...mixins.ellipsis,
    lineHeight: 1.2,
    flex: 1,
    alignSelf: 'center',
    padding: '7px 0',
    minWidth: 1, // firefox 34+ flexbox bug workaround
    color: 'inherit',
  },
  hint: {
    alignSelf: 'center',
    padding: '0 5px',
    color: colors.grayLight,
  },
  return: {
    alignSelf: 'center',
    padding: '0 5px',
  },
}
