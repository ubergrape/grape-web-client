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

const sizesMap = {
  s: 32,
  m: 64
}

const animationName = (() => {
  const id = random(10000)
  return (size) => `grape-logo-${size}-${id}`
})()

const keyframes = Object.keys(sizesMap).reduce((styles, size) => {
  styles[`@keyframes ${animationName(size)}`] = {
    to: {
      backgroundPositionX: -sizesMap[size] * steps + 'px'
    }
  }
  return styles
}, {})

@injectSheet({
  ...keyframes,
  spinner: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    height: '100%',
    width: '100%'
  },
  animation: {
    width: ({size}) => sizesMap[size],
    height: ({size}) => sizesMap[size],
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: translate('-50%', '-50%'),
    background: {
      image: `url(${svg2base64(svg)})`,
      repeat: 'no-repeat',
      position: [0, 0],
      size: 'auto 100%'
    },
    animation: {
      duration: '3s',
      timingFunction: `steps(${steps})`,
      iterationCount: 'infinite'
    },
    animationName: ({size}) => animationName(size),
  },
  overlay: {
    background: color(white).alpha(0.7).rgbaString()
  }
})
export default class Spinner extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    active: PropTypes.bool,
    delay: PropTypes.number,
    overlay: PropTypes.bool,
    size: PropTypes.oneOf(['s','m'])
  }

  static defaultProps = {
    active: false,
    delay: 1000,
    overlay: false,
    size: 'm'
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
