import color from 'color'
import {normal} from 'grape-theme/dist/fonts'
import {link} from 'grape-theme/dist/web-colors'

export const styles = {
  container: {
    extend: normal,
    fontWeight: 'bold',
    lineHeight: 1.4
  },
  link: {
    color: link,
    textDecoration: 'none',
    '&:hover, &:focus': {
      isolate: false,
      textDecoration: 'none',
      color: color(link).lighten(0.2).hexString(),
      borderBottom: {
        width: 1,
        style: 'solid'
      }
    }
  }
}
