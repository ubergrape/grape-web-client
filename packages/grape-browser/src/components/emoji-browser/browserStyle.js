import fonts from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'

import style from '../browser/style'

export default {
  ...style,
  sectionContent: {
    margin: 5,
  },
  input: {
    ...fonts.big,
    border: 'solid 1px #E5E5E5',
    width: '100%',
    color: colors.grayDark,
    padding: 15,
    outline: 'none',
  },
}
