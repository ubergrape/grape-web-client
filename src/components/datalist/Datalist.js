import PropTypes from 'prop-types'
import React, {Component} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {shouldPureComponentUpdate} from 'react-pure-render'
import findIndex from 'lodash/array/findIndex'
import noop from 'lodash/utility/noop'

import style from './style'

@injectSheet(style)
export default class Datalist extends Component {
  static propTypes = {
    data: PropTypes.array,
    className: PropTypes.string,
    onDidMount: PropTypes.func,
    onSelect: PropTypes.func,
    sheet: PropTypes.object.isRequired
  }

  static defaultProps = {
    data: [],
    className: '',
    onDidMount: noop,
    onSelect: noop
  }

  constructor(props) {
    super(props)
    this.state = this.createState(this.props)
  }

  componentDidMount() {
    this.props.onDidMount(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.createState(nextProps))
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onMouseOver(item) {
    this.focus(item)
  }

  onMouseDown(e) {
    // Important!!!
    // Avoids loosing focus and though caret position in editable.
    e.preventDefault()
    this.props.onSelect(this.state.focused)
  }

  createState(props) {
    const {data} = props
    const focused = data[0]
    return {data, focused}
  }

  focus(id) {
    const {data} = this.state
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

  renderItems(listItem, i) {
    const focused = listItem === this.state.focused
    const {item, itemFocused, icon, name, note, noteFocused} = this.props.sheet.classes
    return (
      <div
        onMouseDown={::this.onMouseDown}
        onMouseOver={this.onMouseOver.bind(this, listItem)}
        className={`${item} ${focused ? itemFocused : ''}`}
        key={i}>
        <span className={icon}>{listItem.icon}</span>
        <span className={name}>{listItem.name}</span>
        <span className={`${note} ${focused ? noteFocused : ''}`}>
          {listItem.note}
        </span>
      </div>
    )
  }

  render() {
    const {data} = this.state

    if (!data.length) return null

    const {classes} = this.props.sheet
    return (
      <div
        className={`${classes.datalist} ${this.props.className}`}
        data-test="datalist">
        {data.map(::this.renderItems)}
      </div>
    )
  }
}
