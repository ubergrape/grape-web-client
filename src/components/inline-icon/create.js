import * as icons from 'grape-web/lib/svg-icons/data'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

/**
 * Creates a mixin which adds an icon to any rule.
 */
export default function create(name, options = {}) {
  let backgroundImage

  if (name) {
    const icon = options.color ? getColoredIcon({name, color: options.color}) : icons[name]
    backgroundImage = `url('${icon}')`
  }

  const style = {
    '&:before': {
      backgroundImage,
      backgroundPosition: '50% 50%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      content: '""',
      display: 'inline-block',
      width: options.width || options.size || '1em',
      height: options.height || options.size || '1em',
      position: 'relative',
      top: options.top || 'auto'
    }
  }

  if (name && options.hoverColor) {
    const hoverIcon = getColoredIcon({name, color: options.hoverColor})
    style['&:hover:before'] = {
      isolate: false,
      backgroundImage: `url('${hoverIcon}')`
    }
  }

  return style
}
