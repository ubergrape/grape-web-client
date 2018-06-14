import color from 'color'
import { link } from 'grape-theme/dist/web-colors'

export const styles = {
  link: {
    display: 'inline',
    textDecoration: 'none',
    color: link,
    wordBreak: 'break-word',
    cursor: 'pointer',
    '&:hover': {
      isolate: false,
      textDecoration: 'none',
      color: color(link)
        .lighten(0.2)
        .hexString(),
      borderBottom: [1, 'solid'],
    },
  },
}
