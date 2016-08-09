import buttonIcon from '../button/icon'
import {gainsboroDark} from 'grape-theme/dist/base-colors'

const size = 50

// We need even size so arrow will be centered.
const dimension = size % 2 ? size : size + 1
const contrast = 'rgba(255,255,255,0.75)'
export const styles = {
  jumper: {
    extend: buttonIcon('arrowDown', {color: gainsboroDark}),
    position: 'absolute',
    fontSize: size,
    bottom: 20,
    left: '50%',
    width: dimension,
    height: dimension,
    padding: 5,
    transform: 'translateX(-50%)',
    background: contrast,
    border: `2px solid ${gainsboroDark}`,
    borderRadius: '50%',
    boxShadow: `0 0 0 3px ${contrast}`,
    cursor: 'pointer',
    boxSizing: 'content-box'
  }
}
