import React from 'react'
import useSheet from 'react-jss'
import assign from 'lodash-es/object/assign'
import find from 'lodash-es/collection/find'
import pick from 'lodash-es/object/pick'
import debounce from 'lodash-es/function/debounce'

import Section from './Section'
import gridStyle from './gridStyle'

/**
 * List for search results.
 */
export default React.createClass({
  mixins: [useSheet(gridStyle)],

  getDefaultProps() {
    return {
      height: null,
      className: '',
      data: null,
      onFocus: null,
      onSelect: null
    }
  },

  componentDidUpdate(prevProps) {
    let {focusedItem} = this.props
    if (focusedItem && prevProps.focusedItem.id != focusedItem.id) {
      this.onFocus({id: focusedItem.id})
    }
  },

  render() {
    let {data} = this.props
    let {classes} = this.sheet
    let sections

    if (data.length) {
      sections = data.map((section, i) => {
        assign(section, pick(this.props, 'onSelect'))
        return (
          <Section
            {...section}
            onFocus={this.onFocus}
            onInvisible={this.onInvisible}
            visibilityContainment={this}
            key={section.id}
            ref={'section' + i} />
        )
      })
    }

    let style = {
      height: `${this.props.height}px`
    }

    return (
      <div
        className={`${classes.container} ${this.props.className}`}
        style={style}
        onScroll={this.onScroll}>
        {sections}
      </div>
    )
  },

  getItemComponent(id) {
    let component

    find(this.refs, section =>  {
      component = find(section.refs, item => item.props.id == id)
      return component ? true : false
    })

    return component
  },

  onFocus(data) {
    if (data.id == this.focusedItemId) return
    let prevId = this.focusedItemId
    this.focusedItemId = data.id
    this.props.onFocus(data)
    if (prevId) {
      let prevFocusedItem = this.getItemComponent(prevId)
      if (prevFocusedItem) prevFocusedItem.checkVisibility()
    }
    this.getItemComponent(data.id).checkVisibility()
  },

  onInvisible(item, visibilityRect) {
    if (this.scrolling) return
    let viewPortNode = this.getDOMNode()
    let viewPortHeight = this.props.height
    let itemNode = item.getDOMNode()
    let itemHeight = this.itemHeight
    if (!itemHeight) itemHeight = itemNode.offsetHeight
    let itemTop = itemNode.offsetTop
    if (!visibilityRect.top) itemTop -= viewPortHeight - itemHeight
    viewPortNode.scrollTop = itemTop
  },

  onScroll() {
    this.scrolling = true
    this.onScrollStop()
  },

  onScrollStop: debounce(function() {
    this.scrolling = false
  }, 30),
})
