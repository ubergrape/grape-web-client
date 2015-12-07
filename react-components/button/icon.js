import * as icons from 'grape-web/lib/svg-icons/data'
import * as rawIcons from 'grape-web/lib/svg-icons/raw'
import svgDom from 'grape-web/lib/svg-icons/dom'

/**
 * Modifies `fill` attribute of `path`, caches resulting svg string.
 */
const getColoredIcon = (() => {
  const cache = {}

  return (name, color) => {
    const key = name + color

    if (!cache[key]) {
      cache[key] = svgDom(rawIcons[name])
        .find('path')
        .attr('fill', color)
        .attr('stroke', color)
        .data()
    }

    return cache[key]
  }
}())

/**
 * Creates a mixin which adds an icon to a button.
 */
export default function create(name, options = {}) {
  const icon = options.color ? getColoredIcon(name, options.color) : icons[name]
  const style = {
    margin: 0,
    padding: 0,
    border: 'none',
    '&:before': {
      content: '""',
      width: '1em',
      height: '1em',
      display: 'inline-block',
      verticalAlign: 'middle',
      marginRight: options.iconOnly ? 0 : 5,
      backgroundImage: `url('${icon}')`,
      backgroundSize: 'contain'
    }
  }

  if (options.hoverColor) {
    const hoverIcon = getColoredIcon(name, options.hoverColor)
    style['&:hover:before'] = {
      backgroundImage: `url('${hoverIcon}')`
    }
  }

  return style
}
