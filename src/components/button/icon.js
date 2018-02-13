import createInlineIcon from '../inline-icon/create'
import reset from './reset'

/**
 * Creates a mixin which adds an icon to a button.
 */
export default function create(name, options = {}) {
  const icon = createInlineIcon(name, options)
  icon['&:before'] = {
    ...icon['&:before'],
    verticalAlign: options.iconOnly ? 'top' : 'middle',
    marginRight: options.iconOnly ? 0 : 5
  }

  return {
    ...reset,
    display: 'inline-block',
    lineHeight: options.iconOnly ? 1 : 'inherit',
    cursor: options.cursor ? options.cursor : 'pointer',
    pointerEvents: options.pointerEvents ? options.pointerEvents : 'auto',
    ...icon
  }
}
