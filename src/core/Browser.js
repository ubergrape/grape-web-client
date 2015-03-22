import React from 'react'
import useSheet from 'react-jss'
import clone from 'lodash-es/lang/clone'
import cloneDeep from 'lodash-es/lang/cloneDeep'
import find from 'lodash-es/collection/find'
import findIndex from 'lodash-es/array/findIndex'

import browserStyle from './browserStyle'
import Tabs from './Tabs'
import Empty from './Empty'
import * as services from '../services'
import * as dataUtils from '../common/utils/data'

/**
 * Main component which uses everything else.
 */
export default React.createClass({
  mixins: [useSheet(browserStyle)],

  getInitialState() {
    return this.createState(this.props)
  },

  componentWillReceiveProps(props) {
    this.setState(this.createState(props))
  },

  createState(props) {
    let sections = dataUtils.getSections(props.data)
    let {selectedServiceId} = this.state || {}
    let tabs = []

    if (props.data) {
      tabs = dataUtils.getTabs(props.data.services, sections, selectedServiceId)
    }

    return {
      sections: sections,
      tabs: tabs,
      selectedServiceId: selectedServiceId
    }
  },

  /**
   * Select facet.
   *
   * @param {String} facet can be service id or "prev" or "next"
   */
  selectFacet(facet) {
    let {tabs, sections} = this.state
    let currIndex = findIndex(tabs, tab => tab.selected)

    let newIndex
    let set = false

    if (facet == 'next') {
      newIndex = currIndex + 1
      if (newIndex < tabs.length) {
        set = true
      }
    }
    else if (facet == 'prev') {
      newIndex = currIndex - 1
      if (newIndex >= 0) {
        set = true
      }
    }
    else {
      newIndex = findIndex(tabs, tab => tab.service == facet)
      set = true
    }

    if (set) {
      let service = tabs[newIndex].service
      dataUtils.setSelectedTab(tabs, newIndex)
      dataUtils.setSelectedSection(sections, service)
      dataUtils.setFocusedObjectAt(sections, service, 0)
      this.setState({tabs: tabs, sections: sections, selectedServiceId: service})
      this.emit('selectFacet', {service: service})
    }
  },

  focusObject(id) {
    let sections = this.state.sections
    let set = false

    if (id == 'next' || id == 'prev') {
      let selectedSection = dataUtils.getSelectedSection(sections)
      let objects = selectedSection ? selectedSection.results : dataUtils.getObjects(sections)
      let focusedIndex = findIndex(objects, object => object.focused)
      let newObject

      if (id == 'next') {
        newObject = objects[focusedIndex + 1]
      }
      else if (id == 'prev') {
        newObject = objects[focusedIndex - 1]
      }

      if (newObject) {
        id = newObject.id
        set = true
      }
    }
    else {
      set = true
    }

    if (set) {
      dataUtils.setFocusedObject(sections, id)
      this.setState({sections: sections})
    }
  },

  getFocusedObject() {
    return dataUtils.getFocusedObject(this.state.sections)
  },

  selectObject(id) {
    this.focusObject(id)
    this.emit('selectObject', {id: id})
  },

  /**
   * Emit DOM event.
   */
  emit(type, data) {
    let event = new CustomEvent(type, {
      bubbles: true,
      cancelable: true,
      detail: data
    })
    this.getDOMNode().dispatchEvent(event)
    let cb = this.props[type]
    if (cb) cb(data)
  },

  render() {
    let classes = this.sheet.classes
    let sections = this.state.sections
    let selectedSection = dataUtils.getSelectedSection(sections)
    let serviceName = 'all', data

    if (selectedSection) {
      data = [selectedSection]
    }
    else {
      data = sections
    }

    let facet
    let empty

    if (data.length) {
      facet = React.createElement(services[serviceName], {
        data: data,
        focus: this.focusObject,
        select: this.selectObject
      })
    }
    else {
      empty = <Empty />
    }

    let className = classes.container + ' ' + this.props.className
    return (
      <div className={className}>
        <Tabs data={this.state.tabs} select={this.selectFacet} />
        {facet}
        {empty}
      </div>
    )
  }
})
