import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {small} from 'grape-theme/dist/fonts'
import {white, blue} from 'grape-theme/dist/base-colors'
import cn from 'classnames'

@injectSheet({
  badge: {
    extend: small,
    display: 'inline-block',
    padding: [2, 8],
    background: white,
    color: blue,
    borderRadius: '1pc'
  }
})
export default class Badge extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    style: PropTypes.object
  }

  static defaultProps = {
    className: null,
    style: null
  }

  render() {
    const {classes, children, className, style} = this.props
    return (
      <span className={cn(classes.badge, className)} style={style}>
        {children}
      </span>
    )
  }
}
