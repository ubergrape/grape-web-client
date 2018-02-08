/**
 * Legacy icon implementation.
 * Use material-ui/IconButton instead.
 */

import icons from 'grape-web/lib/svg-icons/data'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

/**
 * Creates a mixin which adds an icon to any rule.
 */
export default function create(name, options = {}) {
  const {
    width, height, size, top, format,
    color, hoverColor
  } = options

  const style = {
    font: 'inherit',
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    display: 'inline-block',
    width: width || size || '1.25em',
    height: height || size || '1.25em',
    position: 'relative',
    top: top || 'auto'
  }

  if (!name) return style

  if (!color) {
    style.backgroundImage = `url('${icons[name]}')`
    return style
  }

  style.backgroundImage = `url('${getColoredIcon({name, color, format})}')`

  if (hoverColor) {
    style['&:hover'] = {
      isolate: false,
      backgroundImage: `url('${getColoredIcon({name, color: hoverColor, format})}')`
    }
  }

  return style
}
