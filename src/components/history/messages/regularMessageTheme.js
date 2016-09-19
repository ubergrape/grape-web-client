import {small} from 'grape-theme/dist/fonts'
import {red, gray} from 'grape-theme/dist/base-colors'

import {styles as baseStyles} from './baseMessageTheme'
import createInlineIcon from '../../inline-icon/create'

const stateIndicatorSize = 12
const stateIndicatorIcon = {
  '&::before': {
    position: 'absolute',
    right: 0,
    top: 0
  }
}

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
    right: 0,
    bottom: 0,
    width: stateIndicatorSize,
    height: stateIndicatorSize
  },
  stateIndicatorPending: {
    ...createInlineIcon('waiting', {color: gray, size: stateIndicatorSize}),
    ...stateIndicatorIcon
  },
  stateIndicatorUnsent: {
    ...createInlineIcon('waiting', {color: gray, size: stateIndicatorSize}),
    ...stateIndicatorIcon
  },
  stateIndicatorSent: {
    ...createInlineIcon('checkmark', {color: gray, size: stateIndicatorSize}),
    ...stateIndicatorIcon
  },
  stateIndicatorRead: {
    ...createInlineIcon('checkmarkFilled', {color: gray, size: stateIndicatorSize}),
    ...stateIndicatorIcon
  },
  stateIndicatorTooltipTrigger: {
    display: 'block',
    width: stateIndicatorSize,
    height: stateIndicatorSize
  }
}
