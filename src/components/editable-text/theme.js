import { normal } from 'grape-theme/dist/fonts'
import { blue } from 'grape-theme/dist/base-colors'

import linkButton from '../button/link'

export const styles = {
  formInput: {
    color: 'inherit',
    display: 'flex',
    font: 'inherit',
    '& $submit': {
      isolate: false,
      marginLeft: 10,
    },
  },
  submit: {
    extend: [linkButton, normal],
    flexShrink: 0,
    color: ({ colors }) => colors.button || blue,
  },
  hidden: {
    display: 'none',
  },
  invisible: {
    visibility: 'hidden',
  },
}
