import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

@injectSheet({
  row: {
    display: 'block',
    margin: 0,
  },
  rowSpaced: {
    display: 'block',
    marginTop: 8,
    '&:first-child': {
      isolate: false,
      marginTop: 0,
    },
  },
})
export default class Row extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    spaced: PropTypes.bool.isRequired,
    className: PropTypes.string.isRequired,
    sheet: PropTypes.object.isRequired,
  }

  static defaultProps = {
    spaced: false,
    children: null,
    className: '',
  }

  render() {
    const {
      children,
      spaced,
      className,
      sheet: { classes },
    } = this.props

    return (
      <div className={cn(spaced ? classes.rowSpaced : classes.row, className)}>
        {children}
      </div>
    )
  }
}
