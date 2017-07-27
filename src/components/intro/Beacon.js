import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import beacons from './beacons'

@injectSheet({
  beacon: {
    display: 'inline',
    position: 'absolute',
    visibility: 'hidden',
    height: 0,
    width: 0
  }
})
export default class Beacon extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    placement: PropTypes.string,
    shift: PropTypes.object,
    arrowOffsetLeft: PropTypes.number,
    arrowOffsetTop: PropTypes.number
  }

  static defaultProps = {
    placement: undefined,
    shift: undefined,
    arrowOffsetLeft: undefined,
    arrowOffsetTop: undefined
  }

  componentWillMount() {
    const {id} = this.props
    beacons[id] = new Promise((resolve) => {
      this.resolve = resolve
    })
  }

  componentDidMount() {
    const {placement, shift, arrowOffsetLeft, arrowOffsetTop} = this.props
    this.resolve({
      target: this,
      placement,
      shift,
      arrowOffsetLeft,
      arrowOffsetTop
    })
  }

  componentWillUnmount() {
    const {id} = this.props
    delete beacons[id]
  }

  render() {
    const {classes} = this.props
    return <span className={classes.beacon} />
  }
}
