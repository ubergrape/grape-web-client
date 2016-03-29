import colors from 'grape-theme/dist/base-colors'
import utils from 'grape-jss-utils'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'

const image = {
  width: '100%',
  height: '100%',
  background: 'transparent no-repeat center',
  backgroundSize: 'contain',
  borderRadius: sizes.borderRadius.big
}

export default {
  sharedFile: {
    display: 'flex',
    cursor: 'pointer',
    marginBottom: 20
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
    color: colors.grayDark
  },
  meta: {
    ...utils.ellipsis,
    ...fonts.small,
    color: colors.grayBlueDark
  }
}
