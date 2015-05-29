import React from 'react'
import useSheet from 'react-jss'
import findIndex from 'lodash-es/array/findIndex'
import find from 'lodash-es/collection/find'

import tabsWithControlsStyle from './tabsWithControlsStyle'
import Tabs from './Tabs'

/**
 * Tabs controls.
 */
export default React.createClass({
  mixins: [useSheet(tabsWithControlsStyle)],

  getDefaultProps() {
    return {
      data: null,
      onSelect: null
    }
  },

  getInitialState() {
    return {
      shift: 'start'
    }
  },

  componentDidUpdate() {
    let tab = find(this.props.data, item => item.selected)
    if (tab && tab.id != this.prevTabId) {
      this.checkVisibility(this.prevTabId, tab.id)
      this.prevTabId = tab.id
    }
  },

  render() {
    let {classes} = this.sheet
    let {data} = this.props
    let arrowPrev, arrowNext

    if (this.state.shift == 'end') {
      arrowPrev = (
        <li
          onClick={this.onArrowClick.bind(this, 'prev')}
          className={classes.prevArrow}>
            <span>&#9664;</span>
        </li>
      )
    }

    if (this.state.shift == 'start') {
      arrowNext = (
        <li
          onClick={this.onArrowClick.bind(this, 'next')}
          className={classes.nextArrow}>
            <span>&#9654;</span>
        </li>
      )
    }

    return (
      <ul className={classes.container}>
        {arrowPrev}
        <Tabs
          data={this.props.data}
          onSelect={this.onSelect}
          onInvisible={this.onInvisible}
          ref="tabs" />
        {arrowNext}
      </ul>
    )
  },

  checkVisibility(prevTabId, nextTabId) {
    let {tabs} = this.refs
    tabs.checkVisibility(prevTabId || 'all')
    tabs.checkVisibility(nextTabId || 'all')
  },

  onArrowClick(dir, e) {
    let {data} = this.props
    let selectedIndex = findIndex(data, item => item.selected)
    if (selectedIndex < 0) selectedIndex = 0
    selectedIndex += dir == 'next' ? 1 : -1
    if (data[selectedIndex]) this.onSelect({id: data[selectedIndex].id})
  },

  onSelect(data) {
    this.props.onSelect(data, () => {
      let prevTabId = find(this.props.data, tab => tab.selected).id
      this.checkVisibility(prevTabId, data.id)
    })
  },

  onInvisible(item, visibilityRect) {
    let viewportNode = this.refs.tabs.getDOMNode()
    let viewportWidth = viewportNode.offsetWidth
    let itemNode = item.getDOMNode()
    let itemLeft= itemNode.offsetLeft
    if (!visibilityRect.left) itemLeft -= viewportWidth - itemNode.offsetWidth
    viewportNode.scrollLeft = itemLeft
    let {scrollLeft} = viewportNode
    let shift = 'start'
    if (scrollLeft > 0 && itemLeft != scrollLeft) shift = 'end'
    this.setState({shift: shift})
  }
})
