import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import noop from 'lodash/utility/noop'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from 'grape-web/lib/jss'
import style from './tabsWithControlsStyle'
import Tabs from './Tabs'

/**
 * Tabs controls.
 */
@useSheet(style)
export default class TabsWithControls extends Component {
  static defaultProps = {
    data: undefined,
    onSelect: noop
  }

  constructor(props) {
    super(props)
    this.state = {
      leftEdge: true,
      rightEdge: true
    }
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidUpdate() {
    this.setEdgesState()
  }

  render() {
    let {classes} = this.props.sheet
    let {data} = this.props
    if (!data.length) return null

    return (
      <ul className={classes.controls}>
        {!this.state.leftEdge &&
          <li
            onClick={::this.onScrollPrev}
            className={classes.prevArrow}>
              <span>&#9664;</span>
          </li>
        }
        <Tabs
          data={this.props.data}
          onSelect={this.props.onSelect}
          onInvisible={::this.onInvisible}
          onDidMount={::this.onTabsDidMount} />
        {!this.state.rightEdge &&
          <li
            onClick={::this.onScrollNext}
            className={classes.nextArrow}>
              <span>&#9654;</span>
          </li>
        }
      </ul>
    )
  }

  setEdgesState() {
    if (!this.props.data.length) return

    let {leftEdge, rightEdge} = this.state
    let innerWidth = this.getInnerWidth()
    let outerWidth = this.getOuterWidth()

    if (innerWidth < outerWidth) {
      leftEdge = true
      rightEdge = true
    }
    else {
      let scrollLeft = this.getViewportNode().scrollLeft
      leftEdge = scrollLeft === 0
      rightEdge = scrollLeft + outerWidth === innerWidth
    }

    if (leftEdge !== this.state.leftEdge || rightEdge !== this.state.rightEdge) {
      this.setState({leftEdge, rightEdge})
    }
  }

  getInnerWidth() {
    let inner = this.tabs.getInnerComponent()
    return ReactDOM.findDOMNode(inner).offsetWidth
  }

  getOuterWidth() {
    return ReactDOM.findDOMNode(this).offsetWidth
  }

  getViewportNode() {
    return ReactDOM.findDOMNode(this.tabs)
  }

  onScrollNext() {
    let viewportNode = this.getViewportNode()
    viewportNode.scrollLeft += viewportNode.offsetWidth
    this.setEdgesState()
  }

  onScrollPrev() {
    let viewportNode = this.getViewportNode()
    viewportNode.scrollLeft -= viewportNode.offsetWidth
    this.setEdgesState()
  }

  onInvisible(item, visibilityRect) {
    let viewportNode = this.getViewportNode()
    let viewportWidth = viewportNode.offsetWidth
    let itemNode = ReactDOM.findDOMNode(item)
    let itemLeft = itemNode.offsetLeft
    if (!visibilityRect.left) itemLeft -= viewportWidth - itemNode.offsetWidth
    viewportNode.scrollLeft = itemLeft
    this.setEdgesState()
  }

  onTabsDidMount(tabs) {
    this.tabs = tabs
  }
}
