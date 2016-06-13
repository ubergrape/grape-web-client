import fonts from 'grape-theme/dist/fonts'
import linkButton from '../button/link'

const submit = {
  ...linkButton,
  ...fonts.normal,
  flexShrink: 0
}

export default {
  formInput: {
    display: 'flex',
    '& > button': {
      marginLeft: 10
    }
  },
  submit: {
    ...submit,
    visibility: 'hidden'
  },
  submitVisible: submit
}
