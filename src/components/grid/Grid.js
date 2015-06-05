import React from 'react'
import useSheet from 'react-jss'
import assign from 'lodash-es/object/assign'
import find from 'lodash-es/collection/find'
import pick from 'lodash-es/object/pick'
import debounce from 'lodash-es/function/debounce'

import Section from './Section'
import gridStyle from './gridStyle'

/**
 * Items renderer/scroller.
 */
export default React.createClass({
  mixins: [useSheet(gridStyle)],

  getDefaultProps() {
    return {
      Item: undefined,
      height: undefined,
      className: '',
      data: undefined,
      onFocus: undefined,
      onSelect: undefined,
      section: {}
    }
  },

  componentDidUpdate(prevProps) {
    let currFocused = this.props.focusedItem
    let prevFocused = prevProps.focusedItem
    if (currFocused && prevFocused && prevFocused.id != currFocused.id) {
      this.onFocus({id: currFocused.id})
    }
  },

  render() {
    let {data} = this.props
    let {classes} = this.sheet
    let sections

    if (data.length) {
      sections = data.map((data, i) => {
        data = assign({}, data, pick(this.props, 'onSelect', 'Item'), this.props.section)
        return (
          <Section
            {...data}
            onFocus={this.onFocus}
            onInvisible={this.onInvisible}
            visibilityContainment={this}
            key={data.id}
            ref={data.id} />
        )
      })
    }

    let style = {
      height: `${this.props.height}px`
    }

    return (
      <div
        className={`${classes.grid} ${this.props.className}`}
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

  getSectionComponent(id) {
    return this.refs[id]
  },

  onFocus(data) {
    if (data.id == this.focusedItemId) return
    this.focusedItemId = data.id
    this.props.onFocus(data)
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
