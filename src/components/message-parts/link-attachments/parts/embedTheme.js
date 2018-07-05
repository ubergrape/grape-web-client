import { translate } from 'css-functions'
import { black } from 'grape-theme/dist/base-colors'
import { borderRadius } from 'grape-theme/dist/sizes'
import { zIndex, below } from '../../../../utils/z-index'

export const styles = {
  media: {
    display: 'inline-flex',
    verticalAlign: 'middle',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 460,
    maxWidth: '100%',
    maxHeight: '100%',
    background: {
      size: 'contain',
      color: black,
      repeat: 'no-repeat',
      position: 'center center',
    },
    borderRadius: borderRadius.bigger,
    overflow: 'hidden',
    zIndex: zIndex('base'),
  },
  actions: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: translate('-50%', '-50%'),
  },
  iframe: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: below('base'),
  },
}
