import fonts from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
import linkButton from '../button/link'

const common = {
  font: 'inherit',
  lineHeight: 1.1,
  width: '100%',
  padding: '5px 7px',
  marginLeft: -7,
  color: 'inherit',
  borderRadius: 4,
  outline: 'none',
  border: 'none',
  resize: 'none'
}

export default {
  formInput: {
    display: 'flex',
    '& > button': {
      marginLeft: 10
    }
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
    ...linkButton,
    ...fonts.normal,
    visibility: 'hidden'
  }
}
