import createInlineIcon from '../inline-icon/createWithoutBefore'
import reset from './reset'

/**
 * Creates a mixin which adds an icon to a button.
 */
export default function create(name, options = {}) {
  const icon = createInlineIcon(name, options)

  return {
    ...reset,
    ...icon,
    cursor: 'pointer',
    display: 'inline-block',
    lineHeight: options.iconOnly ? 1 : 'inherit',
    verticalAlign: options.iconOnly ? 'top' : 'middle',
    marginRight: options.iconOnly ? 0 : 5
  }
}
