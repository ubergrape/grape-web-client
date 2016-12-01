import {grayBlue, grayDark, white} from 'grape-theme/dist/base-colors'
import {normal} from 'grape-theme/dist/fonts'
import {link} from 'grape-theme/dist/web-colors'

const userLinkHover = {
  backgroundColor: link,
  color: white,
  textDecoration: 'none'
}

export const styles = {
  container: {
    extend: normal,
    height: 356,
    padding: [10, 0],
    overflowY: 'auto'
  },
  message: {
    extend: normal,
    color: grayBlue,
    padding: [0, 20, 10]
  },
  userLink: {
    color: grayDark,
    display: 'block',
    padding: [10, 20],
    textDecoration: 'none',
    '&:hover, &:focus': userLinkHover
  }
}
