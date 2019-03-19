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
    width,
    height,
    size,
    top,
    format,
    color,
    hoverColor,
    cursor,
  } = options

  const style = {
    '&:before': {
      font: 'inherit',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundPosition: '50% 50%',
      content: '""',
      display: 'inline-block',
      width: width || size || '1em',
      height: height || size || '1em',
      position: 'relative',
      top: top || 'auto',
    },
  }

  if (!name) return style

  if (!color) {
    style['&:before'].backgroundImage = `url('${icons[name]}')`
    return style
  }

  style['&:before'].backgroundImage = `url('${getColoredIcon({
    name,
    color,
    format,
  })}')`

  if (hoverColor) {
    style['&:hover:before'] = {
      isolate: false,
      backgroundImage: `url('${getColoredIcon({
        name,
        color: hoverColor,
        format,
      })}')`,
    }
  }

  if (cursor) {
    style['&:before'].cursor = cursor
  }

  return style
}
