import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'
import fonts from 'grape-theme/dist/fonts'

export default {
  modal: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    opacity: 0.3
  },
  content: {
    position: 'absolute',
    width: 525,
    top: '50%',
    left: '50%',
    transform: 'translate3d(-50%, -50%, 0)',
    borderRadius: 4,
    boxShadow: '0px 4px 10px -1px rgba(33,32,34,0.5)',
    overflow: 'hidden'
  },
  header: {
    position: 'relative',
    background: webColors.sidebarBackground,
    padding: '15px 20px'
  },
  close: {
    position: 'absolute',
    color: colors.white,
    padding: '4px 10px 4px 9px',
    fontSize: '1.5em',
    opacity: 0.8,
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    border: 'none',
    '&:before': {
      content: '"x"'
    },
    '&:hover': {
      opacity: 1
    }
  },
  title: {
    ...fonts.big,
    color: webColors.sidebarGroupTitle
  },
  body: {
    background: colors.white
  }
}
