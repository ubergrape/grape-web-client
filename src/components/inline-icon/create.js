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
    width, height, size, top,
    color, fill, stroke,
    hoverColor, hoverFill, hoverStroke
  } = options

  const style = {
    '&:before': {
      font: 'inherit',
      backgroundPosition: '50% 50%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      content: '""',
      display: 'inline-block',
      width: width || size || '1em',
      height: height || size || '1em',
      position: 'relative',
      top: top || 'auto'
    }
  }

  if (!name) return style

  const setColor = Boolean(color || fill || stroke)

  if (!setColor) {
    style['&:before'].backgroundImage = `url('${icons[name]}')`
    return style
  }

  style['&:before'].backgroundImage = `url('${getColoredIcon({name, color, fill, stroke})}')`

  const setHoverColor = Boolean(hoverColor || hoverFill || hoverStroke)

  if (setHoverColor) {
    const hoverIcon = getColoredIcon({
      name,
      color: hoverColor,
      fill: hoverFill,
      stroke: hoverStroke
    })

    style['&:hover:before'] = {
      isolate: false,
      backgroundImage: `url('${hoverIcon}')`
    }
  }

  return style
}
