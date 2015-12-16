import React, {Component, PropTypes} from 'react'

import {useSheet} from '../jss'
import style from './style'

@useSheet(style)
export default class Spinner extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    active: PropTypes.bool,
    delay: PropTypes.number,
    image: PropTypes.string,
    overlay: PropTypes.bool
  }

  static defaultProps = {
    active: false,
    delay: 1000,
    image: undefined,
    overlay: false
  }

  constructor(props) {
    super(props)
    this.state = this.createState(this.props)
  }

  componentDidMount() {
    if (this.state.active) return
    this.timeoutId = setTimeout(() => {
      this.setState({active: true})
    }, this.props.delay)
  }

  componentWillReceiveProps(props) {
    this.setState(this.createState(props))
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }

  createState(props) {
    return {...props}
  }

  render() {
    if (!this.state.active) return null
    const {classes} = this.props.sheet
    const backgroundImage = `url(${this.props.image})`
    let className = classes.spinner
    if (this.props.overlay) className += ' ' + classes.overlay
    // TODO use svg.
    return <div className={className} style={{backgroundImage}}></div>
  }
}
