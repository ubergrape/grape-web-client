import utils from 'grape-jss-utils'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'

const height = 100

const image = {
  width: '100%',
  height,
  background: '#fff no-repeat center',
  borderRadius: sizes.borderRadius.big
}

export default {
  sharedFile: {
    display: 'flex',
    flexDirection: 'row',
    height,
    cursor: 'pointer',
    '&:hover': {
      background: 'blue'
    }
  },
  leftColumn: {
    flex: 1,
    flexShrink: 0
  },
  rightColumn: {
    flex: 2
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
    ...fonts.big
  },
  meta: {
    ...utils.ellipsis
  },
  channel: {
    ...utils.ellipsis
  }
}
