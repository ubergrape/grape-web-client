import fonts from 'grape-theme/dist/fonts'
import { red } from 'grape-theme/dist/base-colors'

import { styles as baseStyles } from '../baseMessageTheme'
import createInlineIcon from '../../../inline-icon/create'

export const styles = {
  ...baseStyles,
  clickable: {
    cursor: 'pointer',
    '&:hover': {
      isolate: false,
      opacity: 0.8,
    },
  },
  authorClickable: {
    composes: '$clickable',
  },
  disabled: {
    opacity: 0.5,
  },
  unsentWarning: {
    extend: [createInlineIcon('warning', { color: red }), fonts.small],
    color: red,
    marginTop: 5,
    '& button': {
      isolate: false,
      color: red,
      border: 0,
      background: 'none',
      cursor: 'pointer',
    },
  },
}