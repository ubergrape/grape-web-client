import fonts from 'grape-theme/dist/fonts'
import {white, green, red} from 'grape-theme/dist/base-colors'
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
    display: 'flex',
    alignItems: 'center'
  },
  nameCompleted: {
    opacity: 1,
    color: green
  },
  nameErrored: {
    color: red
  },
  error: {
    extend: [ellipsis, fonts.normal],
    display: 'flex',
    alignItems: 'center',
    color: red
  },
  icon: {
    marginLeft: 5
  }
}
