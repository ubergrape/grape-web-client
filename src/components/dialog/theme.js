import {black, white} from 'grape-theme/dist/base-colors'
import {biggest} from 'grape-theme/dist/fonts'
import {borderRadius} from 'grape-theme/dist/sizes'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import {zIndex} from '../../utils/z-index'

const overlay = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
}

export const styles = {
  modal: {
    extend: overlay,
    zIndex: zIndex('dialog'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto'
  },
  backdrop: {
    extend: overlay,
    backgroundColor: black,
    opacity: 0.3,
    zIndex: zIndex('below')
  },
  content: {
    width: 525,
    borderRadius: borderRadius.big,
    boxShadow: '0px 4px 10px -1px rgba(33,32,34,0.5)',
    overflow: 'hidden',
    outline: 0
  },
  header: {
    display: 'flex',
    background: white,
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
    extend: [biggest, ellipsis],
    flex: 2,
    alignSelf: 'center',
    paddingLeft: 20
  },
  body: {
    background: white
  }
}
