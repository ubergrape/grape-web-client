import React from 'react'
import useSheet from 'react-jss'
import findIndex from 'lodash-es/array/findIndex'
import find from 'lodash-es/collection/find'

import style from './tabsWithControlsStyle'
import Tabs from './Tabs'

/**
 * Tabs controls.
 */
export default React.createClass({
  mixins: [useSheet(style)],

  getDefaultProps() {
    return {
      data: undefined,
      onSelect: undefined
    }
  },

  getInitialState() {
    return {
      leftEdge: true,
      rightEdge: true
    }
  },

  componentDidUpdate() {
    let tab = find(this.props.data, item => item.selected)
    if (tab && tab.id != this.selected) {
      this.checkVisibility(this.selected, tab.id)
      this.selected = tab.id
    }

    this.setEdgesState()
  },

  render() {
    let {classes} = this.sheet

    return (
      <ul className={classes.controls}>
        {!this.state.leftEdge &&
          <li
            onClick={this.onScrollPrev}
            className={classes.prevArrow}>
              <span>&#9664;</span>
          </li>
        }
        <Tabs
          data={this.props.data}
          onSelect={this.onSelect}
          onInvisible={this.onInvisible}
          ref="tabs" />
        {!this.state.rightEdge &&
          <li
            onClick={this.onScrollNext}
            className={classes.nextArrow}>
              <span>&#9654;</span>
          </li>
        }
      </ul>
    )
  },

  checkVisibility(prevTabId, nextTabId) {
    let {tabs} = this.refs
    tabs.checkVisibility(prevTabId || 'all')
    tabs.checkVisibility(nextTabId || 'all')
  },

  setEdgesState() {
    let {leftEdge, rightEdge} = this.state
    let innerWidth = this.getInnerWidth()
    let outerWidth = this.getOuterWidth()

    if (innerWidth < outerWidth) {
      leftEdge = true
      rightEdge = true
    }
    else {
      let scrollLeft = this.getViewportNode().scrollLeft
      leftEdge = scrollLeft == 0
      rightEdge = scrollLeft + outerWidth == innerWidth
    }

    if (leftEdge != this.state.leftEdge || rightEdge != this.state.rightEdge) {
      this.setState({leftEdge, rightEdge})
    }
  },

  getInnerWidth() {
    let inner = this.refs.tabs.getInnerComponent()
    return inner.getDOMNode().offsetWidth
  },

  getOuterWidth() {
    return this.getDOMNode().offsetWidth
  },

  getViewportNode() {
    return this.refs.tabs.getDOMNode()
  },

  onScrollNext() {
    let viewportNode = this.getViewportNode()
    viewportNode.scrollLeft += viewportNode.offsetWidth
    this.setEdgesState()
  },

  onScrollPrev() {
    let viewportNode = this.getViewportNode()
    viewportNode.scrollLeft -= viewportNode.offsetWidth
    this.setEdgesState()
  },

  onSelect(data) {
    this.props.onSelect(data, () => {
      let prevTabId = find(this.props.data, tab => tab.selected).id
      this.checkVisibility(prevTabId, data.id)
    })
  },

  onInvisible(item, visibilityRect) {
    let viewportNode = this.getViewportNode()
    let viewportWidth = viewportNode.offsetWidth
    let itemNode = item.getDOMNode()
    let itemLeft= itemNode.offsetLeft
    if (!visibilityRect.left) itemLeft -= viewportWidth - itemNode.offsetWidth
    viewportNode.scrollLeft = itemLeft
    this.setEdgesState()
  }
})
