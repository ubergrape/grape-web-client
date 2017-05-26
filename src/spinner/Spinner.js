import PropTypes from 'prop-types'
import React, {Component} from 'react'

import injectSheet from '../jss'
import style from './style'

@injectSheet(style)
export default class Spinner extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    active: PropTypes.bool,
    delay: PropTypes.number,
    image: PropTypes.string,
    overlay: PropTypes.bool,
    size: PropTypes.number
  }

  static defaultProps = {
    active: false,
    delay: 1000,
    image: undefined,
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
      sheet,
      size: width,
      size: height,
      image
    } = this.props

    const backgroundImage = `url(${image})`
    const {classes} = sheet
    let className = classes.spinner
    if (this.props.overlay) className += ` ${classes.overlay}`
    // TODO use svg.
    return (
      <span className={className}>
        <i
          className={classes.animation}
          style={{backgroundImage, width, height}}
        />
      </span>
    )
  }
}
