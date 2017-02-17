import {gray, grayLighter, grayBombay, white} from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'

export default {
  ...fonts.normal,
  background: white,
  color: gray,
  border: [1, 'solid', grayBombay],
  borderRadius: sizes.borderRadius.big,
  padding: [4, 14],
  transition: 'background 0.15s, color 0.15s, font-size 0.15s',
  '&:hover, &:focus': {
    isolate: false,
    background: grayLighter
  }
}
