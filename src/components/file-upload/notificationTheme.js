import fonts from 'grape-theme/dist/fonts'
import {white, green, redLighter} from 'grape-theme/dist/base-colors'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'

export const styles = {
  title: {
    extend: fonts.normal,
    color: white
  },
  list: {},
  progress: {
    margin: [5, 0]
  },
  name: {
    extend: fonts.normal,
    color: white,
    opacity: 0.7,
    '&:after': {
      content: '" \\2714"',
      color: 'transparent'
    }
  },
  nameCompleted: {
    opacity: 1,
    color: green,
    '&:after': {
      color: green
    }
  },
  nameErrored: {
    color: redLighter,
    '&:after': {
      content: '" \\2718"',
      color: redLighter
    }
  },
  error: {
    extend: [ellipsis, fonts.normal],
    color: redLighter
  }
}
