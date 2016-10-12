import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'
import mixins from 'grape-web/lib/jss-utils/mixins'

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
    background: colors.white,
    height: 50
  },
  close: {
    border: 'none',
    opacity: 0.5,
    padding: 0,
    '&:before': {
      content: '"×"',
      fontSize: 26,
      fontWeight: 'bold',
      padding: '0 20px',
      cursor: 'pointer'
    },
    '&:hover': {
      isolate: false,
      opacity: 1
    }
  },
  title: {
    ...fonts.biggest,
    ...mixins.ellipsis,
    flex: 2,
    alignSelf: 'center',
    paddingLeft: 20
  },
  body: {
    background: colors.white
  }
}
