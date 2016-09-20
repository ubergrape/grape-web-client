import * as gray from './gray'
import fonts from 'grape-theme/dist/fonts'

const theme = {...gray}
theme.styles.input = {
  ...gray.styles.input,
  ...fonts.normal
}

export default theme
