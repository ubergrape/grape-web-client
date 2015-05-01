import React from 'react'
import useSheet from 'react-jss'
import findIndex from 'lodash-es/array/findIndex'
import find from 'lodash-es/collection/find'

import tabsStyle from './tabsStyle'
import Tab from './Tab'

/**
 * Tabs container.
 */
export default React.createClass({
  mixins: [useSheet(tabsStyle)],

  componentDidUpdate() {
    let nextFacet = find(this.props.data, item => item.selected).service
    if (nextFacet != this.prevFacet) {
      this.checkVisibility(this.prevFacet, nextFacet)
      this.prevFacet = nextFacet
    }
  },

  render() {
    let {classes} = this.sheet
    let {data, onSelect} = this.props

    return (
      <ul className={classes.container}>
        <li
          onClick={this.onArrow.bind(this, 'prev')}
          className={classes.leftArrow}>
            <span>&#9664;</span>
        </li>
        <ul className={classes.tabs} ref="tabs">
          {data.map(item => {
            let facet = item.service || 'all'
            return <Tab
              {...item}
              onSelect={this.onSelect}
              onInvisible={this.onInvisible}
              getContainmentNode={this.getTabsDOMNode}
              key={facet}
              ref={facet} />
          })}
        </ul>
        <li
          onClick={this.onArrow.bind(this, 'next')}
          className={classes.rightArrow}>
            <span>&#9654;</span>
        </li>
      </ul>
    )
  },

  checkVisibility(prevFacet, nextFacet) {
    this.refs[prevFacet || 'all'].checkVisibility()
    this.refs[nextFacet || 'all'].checkVisibility()
  },

  getTabsDOMNode() {
    return this.refs.tabs.getDOMNode()
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
