import React from 'react'
import useSheet from 'react-jss'
import cloneDeep from 'lodash-es/lang/cloneDeep'
import assign from 'lodash-es/object/assign'
import find from 'lodash-es/collection/find'
import pick from 'lodash-es/object/pick'
import VisibilitySensor from 'react-visibility-sensor'

import Section from './Section'
import listStyle from './listStyle'
import * as objectStyle from './listStyle'

/**
 * List for search results.
 */
export default React.createClass({
  mixins: [useSheet(listStyle)],

  getDefaultProps() {
    return {
      height: null,
      className: '',
      data: null,
      focus: null,
      select: null
    }
  },

  componentDidUpdate(prevProps) {
    let id = this.props.focusedObject.id
    if (prevProps.focusedObject.id != id) {
      this.onFocus({id: id})
    }
  },

  render() {
    let {data} = this.props
    let classes = this.sheet.classes
    let sections

    if (data.length) {
      sections = data.map((section, i) => {
        assign(section, pick(this.props, 'select'))
        return (
          <Section
            {...section}
            focus={this.onFocus}
            invisible={this.onInvisible}
            visibilityContainment={this}
            key={section.service}
            ref={'section' + i}/>
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
        >
        {sections}
      </div>
    )
  },

  getObjectComponent(id) {
    let component

    find(this.refs, section =>  {
      component = find(section.refs, object => object.props.id == id)
      return component ? true : false
    })

    return component
  },

  onFocus(data) {
    if (data.id == this.focusedObjectId) return
    let prevId = this.focusedObjectId
    this.focusedObjectId = data.id
    this.props.focus(data)
    if (prevId) this.getObjectComponent(prevId).checkVisibility()
    this.getObjectComponent(data.id).checkVisibility()
  },

  onInvisible(item, visibilityRect) {
    let viewPortNode = this.getDOMNode()
    let viewPortHeight = this.props.height
    let itemNode = item.getDOMNode()
    let itemHeight = itemNode.offsetHeight
    let itemTop = itemNode.offsetTop
    if (!visibilityRect.top) itemTop -= viewPortHeight - itemHeight
    viewPortNode.scrollTop = itemTop
  }
})
