import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { Link } from 'grape-web/lib/router'

import getSvg from './getSvg'
import theme from './theme'

@injectSheet(theme)
export default class InternalLinkWithIcon extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    icon: PropTypes.string,
  }

  static defaultProps = {
    icon: 'file',
  }

  render() {
    const { url, children, classes, icon } = this.props

    const svgPath = getSvg(icon, {
      defaultIcon: this.constructor.defaultProps.icon,
    })
    const style = { backgroundImage: `url(${svgPath})` }

    return (
      <Link to={url}>
        <span className={classes.icon} style={style} /> {children}
      </Link>
    )
  }
}
