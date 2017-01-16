import color from 'color'
import {small} from 'grape-theme/dist/fonts'
import {link} from 'grape-theme/dist/web-colors'

export const styles = {
  container: {
    extend: small,
    textTransform: 'uppercase'
  },
  link: {
    color: link,
    textDecoration: 'none',
    '&:hover, &:focus': {
      isolate: false,
      textDecoration: 'none',
      color: color(link).lighten(0.2).hexString(),
      borderBottom: '1px solid'
    }
  }
}
