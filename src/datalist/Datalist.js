import React, {Component} from 'react'
import {useSheet} from '../jss'
import {shouldPureComponentUpdate} from 'react-pure-render'
import findIndex from 'lodash/array/findIndex'

import style from './style'

@useSheet(style)
export default class Datalist extends Component {
  static defaultProps = {
    data: [],
    className: '',
    onDidMount: undefined,
    onSelect: undefined
  }

  constructor(props) {
    super(props)
    this.state = this.createState(this.props)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidMount() {
    this.props.onDidMount(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.createState(nextProps))
  }

  render() {
    let {classes} = this.props.sheet
    let {data} = this.state

    if (!data.length) return null

    return (
      <div className={`${classes.container} ${this.props.className}`}>
        {data.map((item, i) => (
          <div
            onMouseDown={::this.onMouseDown}
            onMouseOver={this.onMouseOver.bind(this, item)}
            className={classes[item === this.state.focused ? 'itemFocused' : 'item']}
            key={i}>
            <span className={classes.icon}>{item.icon}</span>
            <span className={classes.name}>{item.name}</span>
          </div>
        ))}
      </div>
    )
  }

  createState(props) {
    let {data} = props
    let focused = data[0]
    return {data, focused}
  }

  focus(id) {
    let {data} = this.state
    let index = findIndex(data, item => item === this.state.focused)
    let item

    if (typeof id == 'string') {
      if (id === 'next') index++
      else if (id === 'prev') index--
      item = data[index]
    }
    else item = id

    if (!item) return

    this.setState({focused: item})
  }

  onMouseOver(item) {
    this.focus(item)
  }

  onMouseDown(e) {
    // Important!!!
    // Avoids loosing focus and though caret position in editable.
    e.preventDefault()
    this.props.onSelect(this.state.focused)
  }
}
