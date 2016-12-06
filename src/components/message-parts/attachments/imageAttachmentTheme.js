import {borderRadius} from 'grape-theme/dist/sizes'
import {grayLighter} from 'grape-theme/dist/base-colors'

export const styles = {
  thumbnail: {
    borderRadius: borderRadius.big,
    background: 'no-repeat center',
    backgroundSize: 'contain',
    backgroundColor: grayLighter,
    cursor: 'pointer',
    maxWidth: '100%'
  }
}
