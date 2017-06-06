import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {white} from 'grape-theme/dist/base-colors'
import color from 'color'
import cn from 'classnames'
import random from 'lodash/number/random'
import {translate} from 'css-functions'

import injectSheet from '../../jss'
import svg2base64 from '../../jss-utils/svg2base64'
import svg from './grape.svg'

/**
 * Spinner renders a graphic after a `delay` if its not unmounted.
 */

const steps = 101
const animationName = `grape-logo-${random(10000)}`

@injectSheet({
  spinner: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    height: '100%',
    width: '100%'
  },
  animation: {
    width: ({size}) => size,
    height: ({size}) => size,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: translate('-50%', '-50%'),
    background: {
      image: `url(${svg2base64(svg)})`,
      repeat: 'no-repeat',
      position: [0, 0],
      size: ({size}) => `auto ${size}px`
    },
    animation: {
      name: animationName,
      duration: '3s',
      timingFunction: `steps(${steps})`,
      iterationCount: 'infinite'
    }
  },
  overlay: {
    background: color(white).alpha(0.7).rgbaString()
  },
  [`@keyframes ${animationName}`]: {
    to: {
      backgroundPosition: ({size}) => `${-size * steps}px 0`
    }
  }
})
export default class Spinner extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    active: PropTypes.bool,
    delay: PropTypes.number,
    overlay: PropTypes.bool,
    // eslint-disable-next-line react/no-unused-prop-types
    size: PropTypes.number
  }

  static defaultProps = {
    active: false,
    delay: 1000,
    overlay: false,
    size: 60
  }

  constructor(props) {
    super(props)
    this.state = {active: props.active}
  }

  componentDidMount() {
    if (this.state.active) return
    this.timeoutId = setTimeout(() => {
      this.setState({active: true})
    }, this.props.delay)
  }

  componentWillReceiveProps(props) {
    this.setState({active: props.active})
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }

  render() {
    if (!this.state.active) return null

    const {
      classes,
      overlay
    } = this.props

    return (
      <span className={cn(classes.spinner, overlay && classes.overlay)}>
        <i className={classes.animation} />
      </span>
    )
  }
}
