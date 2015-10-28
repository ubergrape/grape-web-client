import utils from 'grape-jss-utils'
import fonts from 'grape-theme/dist/fonts'

const height = 100

export default {
  file: {
    display: 'flex',
    flexDirection: 'row',
    height: height
  },
  leftColumn: {
    flex: 1,
    flexShrink: 0
  },
  rightColumn: {
    flex: 2
  },
  thumbnail: {
    width: '100%',
    height: height,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  },
  icon: {

  },
  name: {
    ...utils.ellipsis,
    ...fonts.big
  },
  meta: {
    ...utils.ellipsis
  },
  channel: {
    ...utils.ellipsis
  }
}
