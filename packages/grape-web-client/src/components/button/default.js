import {
  gray,
  grayLighter,
  grayBombay,
  white,
} from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'

export default {
  ...fonts.normal,
  outline: 'none',
  background: white,
  color: gray,
  border: [1, 'solid', grayBombay],
  borderRadius: sizes.borderRadius.big,
  padding: [4, 14],
  cursor: 'pointer',
  transition: [
    ['background 0.3s'],
    ['border-color 0.3s'],
    ['color 0.3s'],
    ['font-size 0.3s'],
  ],
  '&:hover, &:focus': {
    isolate: false,
    background: grayLighter,
  },
}
