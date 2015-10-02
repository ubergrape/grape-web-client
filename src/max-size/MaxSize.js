import React, {Component} from 'react'
import noop from 'lodash/utility/noop'
import {shouldPureComponentUpdate} from 'react-pure-render'

/**
 * Limits the size of an outer container by allowing to scroll it if inner size
 * is bigger than defined max props.
 * Triggers resize callbacks if container size is changed and limits are not
 * applied.
 */
export default class MaxSize extends Component {
  static defaultProps = {
    innerHeight: undefined,
    innerWidth: undefined,
    maxHeight: 160,
    maxWidth: Infinity,
    onResize: noop
  }

  constructor(props) {
    super(props)
    this.state = this.createState(props)
  }

  render() {
    return (
      <div style={this.state}>
        {this.props.children}
      </div>
    )
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillReceiveProps(nextProps) {
    let resized = false

    if (this.props.innerWidth !== nextProps.innerWidth &&
      nextProps.innerWidth < this.props.maxWidth) {
      resized = true
    }

    if (this.props.innerHeight !== nextProps.innerHeight &&
      nextProps.innerHeight < this.props.maxHeight) {
      resized = true
    }

    // We don't call resize callback when inner height/width is lower
    // than its maxHeight/maxWidth because container has a maxHeight and
    // it's size won't change.
    if (resized) this.props.onResize()

    this.setState(this.createState(nextProps))
  }

  createState(props) {
    let state = {
      overflow: 'hidden',
      maxHeight: props.maxHeight
    }
    if (props.maxWidth < Infinity) state.maxWidth = props.maxWidth
    if (props.innerWidth > props.maxWidth) state.overflowX = 'auto'
    if (props.innerHeight > props.maxHeight) state.overflowY = 'auto'
    return state
  }
}
