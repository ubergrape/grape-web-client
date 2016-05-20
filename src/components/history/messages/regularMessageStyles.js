import {red} from 'grape-theme/dist/base-colors'

import {styles, leftOffset} from './messageTheme'
import createInlineIcon from '../../inline-icon/create'

export default {
  ...styles,
  pending: {
    opacity: 0.5
  },
  unsent: {
    extend: createInlineIcon('warning', {color: red}),
    color: red,
    fontSize: '0.8em',
    marginTop: 10,
    marginLeft: leftOffset,
    '& a': {
      color: red
    }
  }
}
