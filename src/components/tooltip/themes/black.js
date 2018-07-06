import { white } from 'grape-theme/dist/base-colors'
import { small } from 'grape-theme/dist/fonts'

export const arrowSize = 10
export const borderSize = 0

export const styles = {
  pointer: {
    background: 'rgba(0,0,0,0.8)',
  },
  body: {
    extend: small,
    color: white,
    textShadow: '0 1px 1px #000',
    borderRadius: 5,
    padding: [8, 13],
    background: 'rgba(0,0,0,0.8)',
    whiteSpace: 'inherit',
  },
}
