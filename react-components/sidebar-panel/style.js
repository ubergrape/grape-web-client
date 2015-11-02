import fonts from 'grape-theme/dist/fonts'
import utils from 'grape-jss-utils'

export default {
  sidebarPanel: {
    padding: 10
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    height: 50
  },
  title: {
    ...fonts.big,
    ...utils.ellipsis,
    flex: 2,
    alignSelf: 'center'
  },
  close: {
    ...fonts.bigger,
    fontWeight: 'bold',
    padding: '0 20px',
    border: 'none',
    '&:before': {
      content: '"×"'
    },
    '&:hover': {
      color: 'red'
    }
  }
}
