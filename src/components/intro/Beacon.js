import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

import beacons from './beacons'

@injectSheet({
  beacon: {
    display: 'inline',
    position: 'absolute',
    visibility: 'hidden',
    height: 0,
    width: 0,
  },
})
export default class Beacon extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    placement: PropTypes.string,
    shift: PropTypes.object,
    arrowOffsetLeft: PropTypes.number,
    arrowOffsetTop: PropTypes.number,
    className: PropTypes.string,
  }

  static defaultProps = {
    placement: undefined,
    shift: undefined,
    arrowOffsetLeft: undefined,
    arrowOffsetTop: undefined,
    className: undefined,
  }

  componentWillMount() {
    const { id } = this.props
    beacons[id] = new Promise(resolve => {
      this.resolve = resolve
    })
  }

  componentDidMount() {
    const { placement, shift, arrowOffsetLeft, arrowOffsetTop } = this.props
    this.resolve({
      target: this,
      placement,
      shift,
      arrowOffsetLeft,
      arrowOffsetTop,
    })
  }

  render() {
    const { classes, className } = this.props
    return <span className={cn(classes.beacon, className)} />
  }
}
