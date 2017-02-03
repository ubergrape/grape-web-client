import {grayBombay} from 'grape-theme/dist/base-colors'
import {normal} from 'grape-theme/dist/fonts'

export const styles = {
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    color: grayBombay
  },
  link: {
    color: grayBombay,
    textDecoration: 'none',
    '&:hover, &:focus': {
      textDecoration: 'underline'
    }
  },
  icon: {
    width: normal.fontSize,
    height: normal.fontSize,
    marginRight: 5
  },
  text: {
    lineHeight: 'normal',
    marginTop: 2
  }
}
