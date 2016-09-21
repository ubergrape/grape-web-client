import cloneDeep from 'lodash.cloneDeep'
import fonts from 'grape-theme/dist/fonts'
import * as gray from './gray'

const theme = cloneDeep(gray)
theme.styles.input = {
  ...theme.styles.input,
  ...fonts.bigger
}

theme.styles.inputError = {
  ...theme.styles.inputError,
  ...fonts.bigger
}

theme.styles.InputWarning = {
  ...theme.styles.InputWarning,
  ...fonts.bigger
}

export default theme
