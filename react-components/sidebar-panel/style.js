import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import utils from 'grape-jss-utils'

const padding = 20

export default {
  sidebarPanel: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: colors.grayBlueLight
  },
  header: {
    display: 'flex',
    background: colors.grayBlueDark,
    // Used to overlap absolutely positioned content e.g. loading indicator.
    position: 'relative',
    zIndex: 1
  },
  title: {
    ...fonts.bigger,
    ...utils.ellipsis,
    flex: 2,
    alignSelf: 'center',
    // XXX
    color: '#666',
    padding: '14px 20px'
  },
  body: {
    padding,
    background: colors.grayBlueLight,
    overflow: 'auto'
  },
  close: {
    ...fonts.biggest,
    padding: '0 20px',
    border: 'none',
    // XXX
    color: '#ABB0B9',
    '&:before': {
      content: '"×"'
    }
  }
}
