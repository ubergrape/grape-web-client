import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'

import { styles } from './theme'

@injectSheet(styles)
export default class TabsNav extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    sheet: PropTypes.object.isRequired,
  }

  render() {
    const {
      children,
      sheet: { classes },
    } = this.props

    const tabLinks = React.Children.map(children, (child, index) => (
      <li className={classes.item} key={index}>
        {child}
      </li>
    ))

    return <ul className={classes.tabs}>{tabLinks}</ul>
  }
}
