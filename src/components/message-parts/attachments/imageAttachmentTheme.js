import {borderRadius} from 'grape-theme/dist/sizes'

export const styles = {
  thumbnail: {
    borderRadius: borderRadius.big,
    background: 'no-repeat center',
    backgroundSize: 'contain',
    // FIXME move color to the theme
    backgroundColor: '#f7f7f9',
    cursor: 'pointer',
    maxWidth: '100%'
  }
}
