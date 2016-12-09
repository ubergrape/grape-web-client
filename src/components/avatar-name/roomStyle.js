import {grayDark, white} from 'grape-theme/dist/base-colors'
import {smaller} from 'grape-theme/dist/fonts'

import create from '../inline-icon/create'
import style from './style'

const createIcon = ({name, width}) => ([
  create(name, {color: grayDark, width, top: '0.1em'}),
  {
    '&:before': {
      marginRight: 5
    }
  }
])

export default {
  ...style,
  abbr: {
    textAlign: 'center',
    flexShrink: 0,
    color: white,
    lineHeight: '32px'
  },
  info: {
    extend: smaller,
    display: 'flex'
  },
  usersCount: {
    extend: createIcon({name: 'users', width: '1.4em'})
  },
  creator: {
    extend: createIcon({name: 'user'}),
    marginLeft: 10
  }
}
