import * as icons from 'grape-web/lib/svg-icons/data'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

/**
 * Creates a mixin which adds an icon to any rule.
 */
export default function create(name, options = {}) {
  const icon = options.color ? getColoredIcon({name, color: options.color}) : icons[name]
  const style = {
    '&:before': {
      backgroundImage: `url('${icon}')`,
      backgroundPosition: '50% 50%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      content: '""',
      display: 'inline-block',
      width: options.size || '1em',
      height: options.size || '1em'
    }
  }

  if (options.hoverColor) {
    const hoverIcon = getColoredIcon({name, color: options.hoverColor})
    style['&:hover:before'] = {
      backgroundImage: `url('${hoverIcon}')`
    }
  }

  return style
}
