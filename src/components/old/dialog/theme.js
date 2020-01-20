import { black, white } from 'grape-theme/dist/base-colors'
import { small, biggest } from 'grape-theme/dist/fonts'
import { borderRadius } from 'grape-theme/dist/sizes'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'

import { zIndex } from '../../../utils/z-index/index'

export default {
  overlay: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modal: {
    composes: '$overlay',
    zIndex: zIndex('dialog'),
    overflowY: 'auto',
  },
  backdrop: {
    composes: '$overlay',
    backgroundColor: black,
    opacity: 0.3,
    zIndex: zIndex('below'),
  },
  content: {
    borderRadius: borderRadius.big,
    boxShadow: '0px 4px 10px -1px rgba(33,32,34,0.5)',
    overflow: 'hidden',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translateY(-50%)',
    outline: 0,
  },
  header: {
    display: 'flex',
    background: white,
    height: 50,
  },
  close: {
    isolate: false,
    fontSize: small.fontSize,
    opacity: 0.5,
    marginLeft: 'auto',
    '&:hover': {
      isolate: false,
      opacity: 1,
    },
  },
  title: {
    extend: [biggest, ellipsis],
    alignSelf: 'center',
    paddingLeft: 20,
    width: `100%`,
  },
  body: {
    display: 'block',
    background: white,
  },
}
