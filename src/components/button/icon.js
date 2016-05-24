import createInlineIcon from '../inline-icon/create'

/**
 * Creates a mixin which adds an icon to a button.
 */
export default function create(name, options = {}) {
  const icon = createInlineIcon(name, options)
  icon['&:before'] = {
    ...icon['&:before'],
    verticalAlign: options.iconOnly ? 'baseline' : 'middle',
    marginRight: options.iconOnly ? 0 : 5
  }

  return {
    background: 'none',
    cursor: 'pointer',
    outline: 'none',
    margin: 0,
    padding: 0,
    border: 'none',
    ...icon
  }
}
