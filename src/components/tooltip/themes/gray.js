import {white} from 'grape-theme/dist/base-colors'
import {borderDark} from 'grape-theme/dist/web-colors'

export const arrowSize = 18
export const borderSize = 1

export const styles = {
  pointer: {
    background: white,
    border: `${borderSize}px solid ${borderDark}`
  },
  body: {
    padding: 15,
    borderRadius: 6,
    background: white,
    boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
    border: `${borderSize}px solid ${borderDark}`
  }
}
