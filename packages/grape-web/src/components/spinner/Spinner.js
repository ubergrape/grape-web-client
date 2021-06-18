import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { white } from 'grape-theme/dist/base-colors'
import color from 'color'
import cn from 'classnames'
import random from 'lodash/random'

import injectSheet from '../../jss'
import svg2base64 from '../../jss-utils/svg2base64'
import svg from './grape.svg'

/**
 * Spinner renders a graphic after a `delay` if its not unmounted.
 */

const steps = 101

const sizesMap = {
  s: 32,
  m: 64,
}

const animationName = (() => {
  const id = random(10000)
  return size => `grape-logo-${size}-${id}`
})()

const keyframes = Object.keys(sizesMap).reduce((styles, size) => {
  // eslint-disable-next-line no-param-reassign
  styles[`@keyframes ${animationName(size)}`] = {
    to: {
      backgroundPositionX: -sizesMap[size] * steps,
    },
  }
  return styles
}, {})

const styles = {
  ...keyframes,
  spinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  animation: {
    width: ({ size }) => sizesMap[size],
    height: ({ size }) => sizesMap[size],
    background: {
      image: `url(${svg2base64(svg)})`,
      repeat: 'no-repeat',
      position: [0, 0],
      size: 'auto 100%',
    },
    animation: {
      duration: '3s',
      timingFunction: `steps(${steps})`,
      iterationCount: 'infinite',
    },
    animationName: ({ size }) => animationName(size),
  },
  overlay: {
    background: color(white)
      .alpha(0.7)
      .rgbaString(),
  },
}

class Spinner extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    delay: PropTypes.number,
    overlay: PropTypes.bool,
    // eslint-disable-next-line react/no-unused-prop-types
    size: PropTypes.oneOf(['s', 'm']),
    className: PropTypes.string,
  }

  static defaultProps = {
    delay: 1000,
    overlay: false,
    size: 'm',
    className: null,
  }

  constructor(props) {
    super(props)
    this.state = { active: !props.delay }
  }

  componentDidMount() {
    if (this.state.active) return
    this.timeoutId = setTimeout(() => {
      this.setState({ active: true })
    }, this.props.delay)
  }

  componentWillReceiveProps(props) {
    this.setState({ active: !props.delay })
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }

  render() {
    if (!this.state.active) return null

    const { classes, overlay, className } = this.props

    return (
      <span
        className={cn(classes.spinner, overlay && classes.overlay, className)}
      >
        <i className={classes.animation} />
      </span>
    )
  }
}

export default injectSheet(styles)(Spinner)
