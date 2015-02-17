import React from 'react'
import useSheet from 'react-jss'
import clone from 'lodash-es/lang/clone'
import cloneDeep from 'lodash-es/lang/cloneDeep'
import find from 'lodash-es/collection/find'
import findIndex from 'lodash-es/array/findIndex'

import browserStyle from './browserStyle'
import Tabs from './Tabs'
import * as services from '../services'
import * as dataUtils from '../common/utils/data'

/**
 * Main component which uses everything else.
 */
let Browser = React.createClass({
  mixins: [useSheet(browserStyle)],

  componentWillReceiveProps(props) {
    let sections = dataUtils.getSections(props.data)
    this.setState({
      sections: sections,
      tabs: dataUtils.getTabs(sections)
    })
  },

  /**
   * Select facet.
   *
   * @param {String} facet can be service id or "prev" or "next"
   */
  selectFacet(facet) {
    let tabs = this.state.tabs
    let sections = this.state.sections
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
      // "All" tab is special case, just take the first service.
      dataUtils.setFocusedObjectAt(sections, service || sections[0].service, 0)
      this.setState({tabs: tabs, sections: sections})
      this.emit('selectfacet', {service: service})
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
    this.emit('selectobject', {id: id})
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
  },

  render() {
    if (!this.state) return null
    let classes = this.sheet.classes
    let sections = this.state.sections
    let selectedSection = dataUtils.getSelectedSection(sections)
    let serviceName, data

    if (selectedSection) {
      serviceName = selectedSection.service
      if (!serviceName) throw new Error(`No service "${serviceName}" found.`)
      data = [selectedSection]
    }
    else {
      serviceName = 'all'
      data = sections
    }

    let facet = React.createElement(services[serviceName], {
      data: data,
      focus: this.focusObject,
      select: this.selectObject
    })

    return (
      <div className={classes.container}>
        <Tabs data={this.state.tabs} select={this.selectFacet} />
        {facet}
      </div>
    )
  }
})

export default Browser

