import {small} from 'grape-theme/dist/fonts'
import {red, gray} from 'grape-theme/dist/base-colors'

import {styles as baseStyles, leftOffset, horizontalMargin} from './baseMessageTheme'
import createInlineIcon from '../../inline-icon/create'

const stateIndicatorSize = 12

export const styles = {
  ...baseStyles,
  pending: {
    opacity: 0.5
  },
  unsent: {
    opacity: 0.5
  },
  bubble: {
    maxWidth: `calc(100% - ${leftOffset}px)`
  },
  unsentWarning: {
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
  },
  stateIndicator: {
    position: 'absolute',
    right: -(stateIndicatorSize + horizontalMargin) / 2,
    bottom: 0
  },
  stateIndicatorPending: createInlineIcon('waiting', {
    color: gray,
    size: stateIndicatorSize
  }),
  stateIndicatorUnsent: createInlineIcon('waiting', {
    color: gray,
    size: stateIndicatorSize
  }),
  stateIndicatorSent: createInlineIcon('checkmark', {
    color: gray,
    size: stateIndicatorSize
  }),
  stateIndicatorRead: createInlineIcon('checkmarkFilled', {
    color: gray,
    size: stateIndicatorSize
  })
}
