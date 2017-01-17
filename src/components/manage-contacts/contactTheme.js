import {grayDark, white} from 'grape-theme/dist/base-colors'
import {link} from 'grape-theme/dist/web-colors'

export const styles = {
  item: {
    color: grayDark,
    display: 'block',
    padding: [10, 20],
    '&:hover, &:focus': {
      backgroundColor: link,
      color: white
    }
  }
}
