import colors from 'grape-theme/dist/base-colors'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'

const image = {
  width: '100%',
  height: '100%',
  background: 'transparent no-repeat center',
  backgroundSize: 'contain',
  borderRadius: sizes.borderRadius.big
}

export const styles = {
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
    ...ellipsis,
    ...fonts.normal,
    fontWeight: '500',
    color: colors.grayDarker
  },
  meta: {
    ...ellipsis,
    ...fonts.small,
    color: colors.grayBlueDark
  }
}
