import React from 'react'
import useSheet from 'react-jss'
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
    let {classes} = this.sheet

    return (
      <div
        className={`${classes.grid} ${this.props.className}`}
        onScroll={this.onScroll}>
        {this.props.data.map(data => {
          let props = {...data, ...pick(this.props, 'onSelect', 'Item'), ...this.props.section}
          return (
            <Section
              {...props}
              onFocus={this.onFocus}
              onInvisible={this.onInvisible}
              visibilityContainment={this}
              key={props.id}
              ref={props.id} />
          )
        })}
      </div>
    )
  },

  getItemComponent(id) {
    let component

    find(this.refs, section =>  {
      component = find(section.refs, item => item.props.id == id)
      return Boolean(component)
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
    let itemNode = item.getDOMNode()
    let itemTop = itemNode.offsetTop

    // Scrolling up.
    let scrollTop = itemTop

    // Scrolling down.
    if (visibilityRect.top) {
      let viewPortHeight = viewPortNode.offsetHeight
      let itemHeight = this.itemHeight
      if (!itemHeight) itemHeight = itemNode.offsetHeight
      scrollTop = itemTop - viewPortHeight + itemHeight
    }

    viewPortNode.scrollTop = scrollTop
  },

  onScroll() {
    this.scrolling = true
    this.onScrollStop()
  },

  onScrollStop: debounce(function() {
    this.scrolling = false
  }, 30)
})
