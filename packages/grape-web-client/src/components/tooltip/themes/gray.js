import { white } from 'grape-theme/dist/base-colors'
import { borderDark } from 'grape-theme/dist/web-colors'
import { small } from 'grape-theme/dist/fonts'
import { rgba } from 'css-functions'

export const arrowSize = 18
export const borderSize = 1
const border = [borderSize, 'solid', borderDark]

export const styles = {
  pointer: {
    background: white,
    border,
  },
  body: {
    extend: small,
    background: white,
    boxShadow: {
      x: 0,
      y: 3,
      blur: 8,
      color: rgba(0, 0, 0, 0.15),
    },
    border,
    borderRadius: 6,
    overflow: 'hidden',
    whiteSpace: 'inherit',
  },
}
