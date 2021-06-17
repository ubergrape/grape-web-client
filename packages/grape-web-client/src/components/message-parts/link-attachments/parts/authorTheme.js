import { grayBombay } from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

export const styles = {
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    color: grayBombay,
  },
  link: {
    color: grayBombay,
    textDecoration: 'none',
    '&:hover, &:focus': {
      isolate: false,
      textDecoration: 'underline',
    },
  },
  icon: {
    width: fonts.normal.fontSize,
    height: fonts.normal.fontSize,
    marginRight: 5,
  },
  text: {
    lineHeight: 'normal',
    marginTop: 2,
  },
}
