import createInlineIcon from '../inline-icon/create'
import reset from './reset'

/**
 * Creates a mixin which adds an icon to a button.
 */
export default function create(name, options = {}) {
  const icon = createInlineIcon(name, options)
  const { width, height, size, iconOnly } = options
  icon['&:before'] = {
    ...icon['&:before'],
    cursor: 'pointer',
    verticalAlign: iconOnly ? 'top' : 'middle',
    marginRight: iconOnly ? 0 : 5,
  }

  return {
    ...reset,
    cursor: 'pointer',
    display: 'inline-block',
    lineHeight: iconOnly ? 1 : 'inherit',
    width: width || size || '1em',
    height: height || size || '1em',
    ...icon,
  }
}
