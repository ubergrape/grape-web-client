import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import shallowCompare from 'react-addons-shallow-compare'

import {styles} from './duplicatesBadgeTheme'

@useSheet(styles)
export default class DuplicatesBadge extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    value: PropTypes.number.isRequired
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {sheet: {classes}, value} = this.props
    return (
      <span className={classes.badge}>
        {`x${value}`}
      </span>
    )
  }
}
