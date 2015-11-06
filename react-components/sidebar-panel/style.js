import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import utils from 'grape-jss-utils'

const padding = 20

export default {
  sidebarPanel: {
    background: colors.grayBlueLight,
    height: '100%'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    background: colors.grayBlueDark
  },
  title: {
    ...fonts.bigger,
    ...utils.ellipsis,
    flex: 2,
    alignSelf: 'center',
    // XXX
    color: '#666',
    padding
  },
  body: {
    padding
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
