import utils from 'grape-jss-utils'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'

const image = {
  width: '100%',
  height: '100%',
  background: '#fff no-repeat center',
  borderRadius: sizes.borderRadius.big
}

export default {
  sharedFile: {
    display: 'flex',
    flexDirection: 'row',
    cursor: 'pointer',
    marginBottom: 20
  },
  leftColumn: {
    flexShrink: 0,
    width: 120,
    height: 80,
    marginRight: 10
  },
  rightColumn: {
    flex: 1,
    alignSelf: 'center'
  },
  thumbnail: {
    ...image,
    backgroundSize: 'cover'
  },
  icon: {
    ...image
  },
  name: {
    ...utils.ellipsis,
    ...fonts.big,
    // XXX
    color: '#666'
  },
  meta: {
    ...utils.ellipsis,
    // XXX
    color: '#707782'
  },
  channel: {
    ...utils.ellipsis
  }
}
