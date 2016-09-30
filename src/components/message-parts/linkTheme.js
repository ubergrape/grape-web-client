import color from 'color'
import {link} from 'grape-theme/dist/web-colors'

export const styles = {
  link: {
    textDecoration: 'none',
    color: link,
    '&:hover': {
      isolate: false,
      textDecoration: 'none',
      color: color(link).lighten(0.2).hexString(),
      borderBottom: '1px solid'
    }
  }
}
