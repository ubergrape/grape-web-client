import React, {PropTypes, PureComponent} from 'react'

export default class Link extends PureComponent {
  static propTypes = {
    active: PropTypes.bool,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired
  }

  render() {
    const {
      active,
      children,
      onClick,
      filter,
      ...rest
    } = this.props

    if (active) {
      return <span {...rest}>{children}</span>
    }

    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          onClick(filter)
        }}
        {...rest}>
        {children}
      </button>
    )
  }
}
