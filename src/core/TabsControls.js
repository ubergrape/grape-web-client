import React from 'react'
import useSheet from 'react-jss'
import findIndex from 'lodash-es/array/findIndex'
import find from 'lodash-es/collection/find'

import tabsControlsStyle from './tabsControlsStyle'
import Tabs from './Tabs'

/**
 * Tabs controls.
 */
export default React.createClass({
  mixins: [useSheet(tabsControlsStyle)],

  getDefaultProps() {
    return {
      data: null,
      onSelect: null
    }
  },

  componentDidUpdate() {
    let nextFacet = find(this.props.data, item => item.selected).service
    if (nextFacet != this.prevFacet) {
      this.checkVisibility(this.prevFacet, nextFacet)
      this.prevFacet = nextFacet
    }
  },

  render() {
    let {classes} = this.sheet
    let {data} = this.props
    let arrowPrev, arrowNext

    let selectedIndex = findIndex(data, item => item.selected)
    if (selectedIndex > 0) {
      arrowPrev = (
        <li
          onClick={this.onArrow.bind(this, 'prev')}
          className={classes.prevArrow}>
            <span>&#9664;</span>
        </li>
      )
    }

    if (selectedIndex < data.length - 1) {
      arrowNext = (
        <li
          onClick={this.onArrow.bind(this, 'next')}
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

  checkVisibility(prevFacet, nextFacet) {
    let {tabs} = this.refs
    tabs.checkVisibility(prevFacet || 'all')
    tabs.checkVisibility(nextFacet || 'all')
  },

  onArrow(dir) {
    let {data} = this.props
    let selectedIndex = findIndex(data, item => item.selected)
    if (selectedIndex < 0) selectedIndex = 0
    selectedIndex += dir == 'next' ? 1 : -1
    if (data[selectedIndex]) this.onSelect({facet: data[selectedIndex].service})
  },

  onSelect(data) {
    this.props.onSelect(data, () => {
      let currFacet = find(this.props.data, item => item.selected).service
      this.checkVisibility(currFacet, data.facet)
    })
  },

  onInvisible(item, visibilityRect) {
    let viewPortNode = this.refs.tabs.getDOMNode()
    let viewPortWidth = viewPortNode.offsetWidth
    let itemNode = item.getDOMNode()
    let itemLeft= itemNode.offsetLeft
    if (!visibilityRect.left) itemLeft -= viewPortWidth - itemNode.offsetWidth
    viewPortNode.scrollLeft = itemLeft
  }
})
