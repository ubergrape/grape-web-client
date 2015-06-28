import React, {Component} from 'react'
import useSheet from 'react-jss'

import style from './style'

@useSheet(style)
export default class Spinner extends Component {
  static defaultProps = {
    active: false,
    delay: 1000
  }

  constructor(props) {
    super(props)
    this.state = this.createState(this.props)
  }

  componentWillReceiveProps(props) {
    this.setState(this.createState(props))
  }

  componentDidMount() {
    this.timeoutId = setTimeout(() => {
      this.setState({active: true})
    }, this.props.delay)
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }

  createState(props) {
    return {...props}
  }

  render() {
    if (!this.state.active) return null
    let {classes} = this.props.sheet
    // TODO use svg.
    return <i className={`fa fa-spinner fa-pulse ${classes.spinner}`}></i>
  }
}
