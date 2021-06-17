import { grayDarker, grayBlueDark } from 'grape-theme/dist/base-colors'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'

export const styles = {
  sharedFile: {
    display: 'flex',
    marginBottom: 20,
    '&, & *': {
      isolate: false,
      cursor: 'pointer',
    },
  },
  leftColumn: {
    flexShrink: 0,
    width: 50,
    height: 50,
    marginRight: 15,
    marginTop: 5,
  },
  rightColumn: {
    flex: 1,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  icon: {
    width: '100%',
    height: '100%',
    background: 'transparent no-repeat center',
    backgroundSize: 'contain',
    borderRadius: sizes.borderRadius.big,
  },
  thumbnail: {
    composes: '$icon',
    backgroundSize: 'cover',
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15)',
  },
  name: {
    extend: [ellipsis, fonts.normal],
    color: grayDarker,
  },
  meta: {
    extend: [ellipsis, fonts.small],
    color: grayBlueDark,
  },
}
