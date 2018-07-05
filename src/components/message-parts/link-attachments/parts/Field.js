import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'

@injectSheet({
  root: {
    display: 'block',
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
})
export default class Field extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    sheet: PropTypes.object.isRequired,
  }

  render() {
    const {
      title,
      value,
      sheet: { classes },
    } = this.props

    return (
      <div className={classes.root}>
        <div className={classes.title}>{title}</div>
        <div className={classes.value}>{value}</div>
      </div>
    )
  }
}
