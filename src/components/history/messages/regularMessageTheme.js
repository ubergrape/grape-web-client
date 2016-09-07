import {small} from 'grape-theme/dist/fonts'
import {red, gray} from 'grape-theme/dist/base-colors'

import {styles as baseStyles, horizontalMargin} from './baseMessageTheme'
import createInlineIcon from '../../inline-icon/create'

const stateIndicatorSize = 12

export const styles = {
  ...baseStyles,
  clickable: {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8
    }
  },
  authorClickable: {
    extend: 'clickable'
  },
  disabled: {
    opacity: 0.5
  },
  unsentWarning: {
    extend: [createInlineIcon('warning', {color: red}), small],
    color: red,
    marginTop: 5,
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
