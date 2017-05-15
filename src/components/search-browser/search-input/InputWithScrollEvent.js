import PropTypes from 'prop-types'
import React, {Component} from 'react'
import noop from 'lodash/utility/noop'
import omit from 'lodash/object/omit'

export default class InputWithScrollEvent extends Component {
  static propTypes = {
    scrollDetectionEvents: PropTypes.array,
    onScroll: PropTypes.func
  }

  static defaultProps = {
    scrollDetectionEvents: ['onInput', 'onKeyDown', 'onKeyUp', 'onFocus',
      'onBlur', 'onClick', 'onChange', 'onPaste', 'onCut', 'onMouseDown',
      'onMouseUp', 'onMouseOver'],
    onScroll: noop
  }

  constructor(props) {
    super(props)
    this.handlers = this.createScrollDetectionHandlers()
  }

  componentDidMount() {
    this.scrollPosition = this.getScrollPosition()
  }

  onScroll({target}) {
    const prevPos = this.scrollPosition
    const currPos = this.getScrollPosition()
    if (prevPos.top !== currPos.top || prevPos.left !== currPos.left) {
      this.scrollPosition = currPos
      this.props.onScroll({target})
    }
  }

  onEventProxy(name, e) {
    // Use delay because native scroll happens after some of the events.
    setTimeout(() => {
      const target = this.refs.input
      // Don't trigger onScroll if the element has been detached.
      if (target) this.onScroll({target})
    })
    // Call original callback if it exists.
    if (this.props[name]) this.props[name](e)
  }

  getScrollPosition() {
    const {scrollLeft, scrollTop} = this.refs.input
    return {left: scrollLeft, top: scrollTop}
  }

  createScrollDetectionHandlers() {
    return this.props.scrollDetectionEvents.reduce((handlers, name) => {
      handlers[name] = this.onEventProxy.bind(this, name)
      return handlers
    }, {})
  }

  render() {
    const props = omit(
      {...this.props, ...this.handlers},
      'scrollDetectionEvents'
    )
    return (
      <input
        {...props}
        onScroll={this.props.onScroll}
        ref="input" />
    )
  }
}
