import {normal} from 'grape-theme/dist/fonts'
import linkButton from '../button/link'

export default {
  formInput: {
    display: 'flex',
    '& $submit': {
      marginLeft: 10
    }
  },
  submit: {
    extend: [linkButton, normal],
    flexShrink: 0
  },
  hidden: {
    display: 'none'
  },
  invisible: {
    visibility: 'hidden'
  }
}
