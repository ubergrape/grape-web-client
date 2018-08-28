import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { gold, white } from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import Chip from 'grape-web/lib/components/chip'

class DuplicatesBadge extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.number.isRequired,
  }

  render() {
    const { classes, value } = this.props
    return <Chip className={classes.badge} label={`x${value + 1}`} />
  }
}

export default injectSheet({
  badge: {
    extend: fonts.normal,
    display: 'inline-block',
    background: gold,
    color: white,
    marginLeft: 5,
    verticalAlign: 'top',
    padding: 0,
  },
})(DuplicatesBadge)
