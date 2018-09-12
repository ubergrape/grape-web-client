import fonts from 'grape-theme/dist/fonts'
import { white, green, red } from 'grape-theme/dist/base-colors'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'

export const styles = {
  title: {
    extend: fonts.normal,
    color: white,
  },
  list: {
    display: 'block',
  },
  upload: {
    display: 'block',
    margin: [5, 0],
  },
  name: {
    display: 'flex',
    opacity: 0.7,
    alignItems: 'center',
    color: white,
  },
  nameCompleted: {
    opacity: 1,
    color: green,
  },
  nameErrored: {
    color: red,
  },
  nameText: {
    display: 'flex',
    overflow: 'hidden',
    width: '100%',
    color: 'inherit',
    '& > span': {
      isolate: false,
      extend: fonts.normal,
      whiteSpace: 'nowrap',
      color: 'inherit',
    },
  },
  nameTextLeft: ellipsis,
  error: {
    extend: [ellipsis, fonts.normal],
    display: 'flex',
    alignItems: 'center',
    color: red,
  },
  icon: {
    flexShrink: 0,
    marginLeft: 5,
  },
  iconSuccess: {
    composes: '$icon',
    fill: green,
  },
  iconError: {
    composes: '$icon',
    fill: red,
  },
}
