import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {small} from 'grape-theme/dist/fonts'
import {white, blue} from 'grape-theme/dist/base-colors'
import cn from 'classnames'

@injectSheet({
  tag: {
    extend: small,
    display: 'inline-block',
    padding: [2, 8],
    background: white,
    color: blue,
    borderRadius: '1pc'
  }
})
export default class Tag extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  }

  static defaultProps = {
    className: null
  }

  render() {
    const {classes, children, className, ...rest} = this.props
    delete rest.sheet
    return (
      <span className={cn(classes.tag, className)} {...rest}>
        {children}
      </span>
    )
  }
}
