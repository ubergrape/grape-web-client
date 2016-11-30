import React, {PropTypes, PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './tabLinkTheme'

@injectSheet(styles)
export default class TabLink extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    sheet: PropTypes.object.isRequired
  }

  render() {
    const {
      children,
      sheet: {classes}
    } = this.props

    const link = React.Children.only(children)
    const {active, className: linkClasses} = link.props
    const className = [
      linkClasses,
      classes.tabLink,
      active && classes.active
    ].filter(Boolean).join(' ')

    return React.cloneElement(link, {className})
  }
}
