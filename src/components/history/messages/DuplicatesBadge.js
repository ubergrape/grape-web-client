import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {gold, white} from 'grape-theme/dist/base-colors'

import Tag from '../../tag'

@injectSheet({
  badge: {
    background: gold,
    color: white,
    marginLeft: 5,
    alignSelf: 'flex-start'
  }
})
export default class DuplicatesBadge extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    value: PropTypes.number.isRequired
  }

  render() {
    const {sheet: {classes}, value} = this.props
    return (
      <Tag className={classes.badge}>
        {`x${value + 1}`}
      </Tag>
    )
  }
}
