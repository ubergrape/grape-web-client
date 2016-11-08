import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './duplicatesBadgeTheme'

@injectSheet(styles)
export default class DuplicatesBadge extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    value: PropTypes.number.isRequired
  }

  render() {
    const {sheet: {classes}, value} = this.props
    return (
      <span className={classes.badge}>
        {`x${value + 1}`}
      </span>
    )
  }
}
