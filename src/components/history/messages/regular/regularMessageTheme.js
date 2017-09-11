import {small} from 'grape-theme/dist/fonts'
import {red, gray} from 'grape-theme/dist/base-colors'

import {styles as baseStyles, horizontalMargin} from '../baseMessageTheme'
import createInlineIcon from '../../../inline-icon/create'

const stateIndicatorSize = 12
const stateIndicatorIcon = {
  '&:before': {
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
      isolate: false,
      opacity: 0.8
    }
  },
  authorClickable: {
    compose: '$clickable'
  },
  contentWrapper: {
    width: '100%',
    minWidth: 0
  },
  disabled: {
    opacity: 0.5
  },
  unsentWarning: {
    extend: [createInlineIcon('warning', {color: red}), small],
    color: red,
    marginTop: 5,
    '& a': {
      isolate: false,
      color: red
    }
  },
  stateIndicator: {
    position: 'absolute',
    right: -(stateIndicatorSize + horizontalMargin) / 2,
    bottom: 0,
    width: stateIndicatorSize,
    height: stateIndicatorSize
  },
  stateIndicatorPending: {
    extend: [
      createInlineIcon('waiting', {color: gray, size: stateIndicatorSize}),
      stateIndicatorIcon
    ]
  },
  stateIndicatorUnsent: {
    extend: [
      createInlineIcon('waiting', {color: gray, size: stateIndicatorSize}),
      stateIndicatorIcon
    ]
  },
  stateIndicatorSent: {
    extend: [
      createInlineIcon('checkmark', {color: gray, size: stateIndicatorSize}),
      stateIndicatorIcon
    ]
  },
  stateIndicatorRead: {
    extend: [
      createInlineIcon('checkmarkFilled', {color: gray, size: stateIndicatorSize}),
      stateIndicatorIcon
    ]
  },
  stateIndicatorTooltipTrigger: {
    display: 'block',
    width: stateIndicatorSize,
    height: stateIndicatorSize
  }
}
