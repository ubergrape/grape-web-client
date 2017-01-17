import {blue, white} from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

import {zIndex} from '../../utils/z-index'

export const styles = {
  dropzone: {},
  overlay: {
    position: 'absolute',
    background: 'rgba(0,0,0,.85)',
    zIndex: zIndex('base'),
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  body: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
    border: {
      width: 2,
      style: 'dashed',
      color: blue,
      radius: 15
    }
  },
  content: {
    width: '50%',
    marginTop: '-10%',
    textAlign: 'center'
  },
  image: {
    width: '50%'
  },
  headline: {
    extend: fonts.biggest,
    color: blue,
    textAlign: 'center'
  },
  descr: {
    extend: fonts.small,
    lineHeight: 2,
    color: white,
    textAlign: 'center'
  }
}
