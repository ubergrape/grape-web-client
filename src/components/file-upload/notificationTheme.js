import fonts from 'grape-theme/dist/fonts'
import {white, green, grayLight} from 'grape-theme/dist/base-colors'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'

export const styles = {
  title: {
    extend: fonts.normal,
    color: white
  },
  list: {},
  upload: {
    margin: [5, 0]
  },
  name: {
    extend: fonts.normal,
    color: white,
    opacity: 0.7,
    display: 'flex',
    alignItems: 'center'
  },
  nameCompleted: {
    opacity: 1,
    color: green
  },
  nameErrored: {
    color: grayLight
  },
  nameText: {
    flexGrow: 1
  },
  error: {
    extend: [ellipsis, fonts.normal],
    display: 'flex',
    alignItems: 'center',
    color: grayLight
  },
  icon: {
    flexShrink: 0,
    marginLeft: 5
  }
}
