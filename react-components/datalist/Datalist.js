import React, {Component} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import findIndex from 'lodash/array/findIndex'
import noop from 'lodash/utility/noop'

export default class Datalist extends Component {
  static defaultProps = {
    items: [],
    className: '',
    onSelect: noop,
    renderItem: noop
  }

  constructor(props) {
    super(props)
    this.state = this.createState(this.props)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillReceiveProps(nextProps) {
    this.setState(this.createState(nextProps))
  }

  render() {
    let {items} = this.state

    if (!items.length) return null

    return (
      <div className={this.props.className}>
        {items.map((item, i) => {
          let props = {
            onMouseDown: ::this.onMouseDown,
            onMouseOver: ::this.onMouseOver,
            key: 'item-' + i
          }
          return this.props.renderItem(item, props, this.state)
        })}
      </div>
    )
  }

  createState(props) {
    let {items} = props
    let focused = items[0]
    return {items, focused}
  }

  focus(id) {
    let {items} = this.state
    let index = findIndex(items, item => item === this.state.focused)
    let item

    if (typeof id == 'string') {
      if (id === 'next') index++
      else index--
      item = items[index]
    }
    else item = id

    if (!item) return

    this.setState({focused: item})
  }

  onMouseOver(item) {
    this.focus(item)
  }

  onMouseDown(e) {
    // Avoids loosing focus and though caret position in input.
    e.preventDefault()
    this.props.onSelect(this.state.focused)
  }
}
