import fonts from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
import linkButton from '../button/link'

const common = {
  font: 'inherit',
  lineHeight: 1,
  width: '100%',
  padding: '5px 7px',
  marginRight: 10,
  color: 'inherit',
  borderRadius: 4,
  outline: 'none',
  border: 'none',
  resize: 'none'
}

export default {
  formInput: {
    display: 'flex'
  },
  string: {
    ...common,
    background: 'transparent',
    cursor: 'text',
    '&:hover': {
      background: 'rgba(255,255,255,0.5)'
    }
  },
  input: {
    ...common,
    background: colors.white,
    '& + button': {
      visibility: 'visible'
    }
  },
  submit: {
    visibility: 'hidden',
    ...linkButton,
    ...fonts.normal
  }
}
