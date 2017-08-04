import {normal} from 'grape-theme/dist/fonts'
import linkButton from '../button/link'

export const styles = {
  formInput: {
    color: 'inherit',
    display: 'flex',
    '& $submit': {
      marginLeft: 10
    }
  },
  submit: {
    extend: [linkButton, normal],
    color: 'inherit',
    flexShrink: 0
  },
  hidden: {
    display: 'none'
  },
  invisible: {
    visibility: 'hidden'
  }
}
