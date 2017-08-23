import fonts from 'grape-theme/dist/fonts'
import {white, green, red} from 'grape-theme/dist/base-colors'
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
    opacity: 0.7,
    display: 'flex',
    alignItems: 'center',
    color: white
  },
  nameCompleted: {
    opacity: 1,
    color: green
  },
  nameErrored: {
    color: red
  },
  nameText: {
    display: 'flex',
    overflow: 'hidden',
    width: '100%',
    color: 'inherit',
    '& > span': {
      whiteSpace: 'nowrap',
      extend: fonts.normal,
      color: 'inherit'
    }
  },
  nameTextLeft: ellipsis,
  error: {
    extend: [ellipsis, fonts.normal],
    display: 'flex',
    alignItems: 'center',
    color: red
  },
  icon: {
    flexShrink: 0,
    marginLeft: 5
  },
  iconSuccess: {
    composes: '$icon',
    fill: green
  },
  iconError: {
    composes: '$icon',
    fill: red
  }
}
