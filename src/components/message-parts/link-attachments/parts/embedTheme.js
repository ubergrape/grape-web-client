import {translate} from 'css-functions'
import {black} from 'grape-theme/dist/base-colors'
import {borderRadius} from 'grape-theme/dist/sizes'

export const styles = {
  media: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 460,
    height: 280,
    maxWidth: '100%',
    maxHeight: '100%',
    background: {
      size: 'contain',
      color: black,
      repeat: 'no-repeat',
      position: 'center center'
    },
    borderRadius: borderRadius.bigger,
    overflow: 'hidden'
  },
  actions: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: translate('-50%', '-50%')
  },
  embed: {
    width: '100%',
    height: '100%',
    '& iframe': {
      maxWidth: '100%',
      maxHeight: '100%'
    }
  }
}
