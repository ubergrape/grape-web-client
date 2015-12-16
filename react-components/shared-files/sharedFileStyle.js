import utils from 'grape-jss-utils'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'

const image = {
  width: '100%',
  height: '100%',
  background: 'transparent no-repeat center',
  borderRadius: sizes.borderRadius.big
}

export default {
  sharedFile: {
    display: 'flex',
    cursor: 'pointer',
    marginTop: 10,
    marginBottom: 10
  },
  leftColumn: {
    flexShrink: 0,
    width: 50,
    height: 50,
    marginRight: 15,
    marginTop: 5
  },
  rightColumn: {
    flex: 1,
    alignSelf: 'center'
  },
  thumbnail: {
    ...image,
    backgroundSize: 'cover',
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15)'
  },
  icon: {
    ...image
  },
  name: {
    ...utils.ellipsis,
    ...fonts.normal,
    fontWeight: '500',
    // XXX
    color: '#333'
  },
  meta: {
    ...utils.ellipsis,
    ...fonts.small,
    // XXX
    color: '#707782'
  }
}
