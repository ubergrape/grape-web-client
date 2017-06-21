import {grayDark, white} from 'grape-theme/dist/base-colors'
import {smaller} from 'grape-theme/dist/fonts'
import {icon as iconSize} from 'grape-theme/dist/sizes'

import create from '../inline-icon/create'
import style from './style'

const createIcon = ({name, width}) => ({
  extend: create(name, {color: grayDark, width, top: '0.1em'}),
  marginRight: 5
})

export default {
  ...style,
  abbr: {
    textAlign: 'center',
    flexShrink: 0,
    color: white,
    lineHeight: `${iconSize.l}px`
  },
  info: {
    extend: smaller,
    display: 'flex'
  },
  usersCountIcon: createIcon({name: 'users', width: '1.4em'}),
  creator: {
    marginLeft: 10
  },
  creatorIcon: createIcon({name: 'user'})
}
