import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'

import { styles } from './tabTheme'

@injectSheet(styles)
export default class Tab extends PureComponent {
  static propTypes = {
    active: PropTypes.bool,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    sheet: PropTypes.object.isRequired,
  }

  onClick = e => {
    const { onClick, filter } = this.props
    e.preventDefault()
    onClick(filter)
  }

  render() {
    const {
      active,
      children,
      sheet: { classes },
    } = this.props

    if (active) {
      return (
        <span className={`${classes.tab} ${classes.active}`}>{children}</span>
      )
    }

    return (
      <button className={classes.tab} type="button" onClick={this.onClick}>
        {children}
      </button>
    )
  }
}
