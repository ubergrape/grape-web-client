import * as icons from 'grape-web/lib/svg-icons/data'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

/**
 * Creates a mixin which adds an icon to a button.
 */
export default function create(name, options = {}) {
  const icon = options.color ? getColoredIcon({name, color: options.color}) : icons[name]
  const style = {
    background: 'none',
    cursor: 'pointer',
    outline: 'none',
    margin: 0,
    padding: 0,
    border: 'none',
    '&:before': {
      content: '""',
      width: options.size || '1em',
      height: options.size || '1em',
      display: 'inline-block',
      verticalAlign: options.iconOnly ? 'baseline' : 'middle',
      marginRight: options.iconOnly ? 0 : 5,
      background: 'no-repeat 50% 50%',
      backgroundImage: `url('${icon}')`,
      backgroundSize: 'contain'
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
