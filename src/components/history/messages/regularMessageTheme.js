import {small} from 'grape-theme/dist/fonts'
import {red} from 'grape-theme/dist/base-colors'

import {styles as baseStyles, leftOffset} from './baseMessageTheme'
import createInlineIcon from '../../inline-icon/create'

export const styles = {
  ...baseStyles,
  pending: {
    opacity: 0.5
  },
  unsent: {
    extend: [createInlineIcon('warning', {color: red}), small],
    color: red,
    marginTop: 5,
    marginLeft: leftOffset,
    '& a': {
      color: red
    }
  },
  menu: {
    position: 'absolute',
    top: -13,
    right: 15
  }
}
