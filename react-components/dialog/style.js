import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'
import utils from 'grape-jss-utils'

const overlay = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
}

export default {
  modal: {
    ...overlay,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backdrop: {
    ...overlay,
    backgroundColor: colors.black,
    opacity: 0.3,
    zIndex: -1
  },
  content: {
    width: 525,
    borderRadius: sizes.borderRadius.big,
    boxShadow: '0px 4px 10px -1px rgba(33,32,34,0.5)',
    overflow: 'hidden',
    outline: 0
  },
  header: {
    display: 'flex',
    background: webColors.sidebarBackground,
    height: 50
  },
  close: {
    ...fonts.bigger,
    fontWeight: 'bold',
    color: colors.white,
    padding: '0 20px',
    opacity: 0.8,
    border: 'none',
    '&:before': {
      content: '"×"'
    },
    '&:hover': {
      opacity: 1
    }
  },
  title: {
    ...fonts.big,
    ...utils.ellipsis,
    flex: 2,
    alignSelf: 'center',
    color: webColors.sidebarGroupTitle,
    paddingLeft: 20
  },
  body: {
    background: colors.white
  }
}
