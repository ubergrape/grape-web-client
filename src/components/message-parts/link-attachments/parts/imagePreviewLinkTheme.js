import {white} from 'grape-theme/dist/base-colors'
import {borderRadius} from 'grape-theme/dist/sizes'

export const styles = {
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    backgroundColor: white,
    borderRadius: borderRadius.bigger,
    overflow: 'hidden',
    '& img': {
      maxWidth: '100%',
      maxHeight: '100%'
    }
  }
}
