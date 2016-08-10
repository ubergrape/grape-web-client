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
  bubbleWithOffset: {
    maxWidth: `calc(100% - ${leftOffset}px)`
  },
  bubble: {
    maxWidth: '100%'
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
  menuTop: {
    position: 'absolute',
    top: -13,
    right: 15
  },
  menuRight: {
    position: 'absolute',
    top: 1,
    left: 'calc(100% + 7px)'
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
