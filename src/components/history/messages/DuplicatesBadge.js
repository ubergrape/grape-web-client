import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {gold, white} from 'grape-theme/dist/base-colors'
import Chip from 'material-ui/Chip'

@injectSheet({
  badge: {
    display: 'inline-block',
    background: gold,
    color: white,
    marginLeft: 5,
    alignSelf: 'flex-start'
  }
})
export default class DuplicatesBadge extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.number.isRequired
  }

  render() {
    const {classes, value} = this.props
    return <Chip className={classes.badge} label={`x${value + 1}`} />
  }
}
