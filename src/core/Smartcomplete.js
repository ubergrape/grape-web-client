'use strict'

import React from 'react'
import useSheet from 'react-jss'
import clone from 'lodash-es/lang/clone'
import cloneDeep from 'lodash-es/lang/cloneDeep'
import find from 'lodash-es/collection/find'
import findIndex from 'lodash-es/array/findIndex'

import smartcompleteStyle from './smartcompleteStyle'
import Tabs from './Tabs'
import * as services from '../services'
import * as dataUtils from '../common/utils/data'

/**
 * Main Smartcomplete class which uses everything else.
 */
var Smartcomplete = React.createClass({
  mixins: [useSheet(smartcompleteStyle)],

  componentWillReceiveProps(props) {
    var sections = dataUtils.getSections(props.data)
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
    var tabs = this.state.tabs
    var sections = this.state.sections
    var currIndex = findIndex(tabs, tab => tab.selected)
    var newIndex
    var set = false

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
    } else {
      newIndex = findIndex(tabs, tab => tab.service == facet)
      set = true
    }

    if (set) {
      var service = tabs[newIndex].service
      dataUtils.setSelectedTab(tabs, newIndex)
      dataUtils.setSelectedSection(sections, service)
      // "All" tab is special case, just take the first service.
      dataUtils.setSelectedObjectAt(sections, service || sections[0].service, 0)
      this.setState({tabs: tabs, sections: sections})
      this.emit('selectfacet', {service: service})
    }
  },

  selectObject(id) {
    var sections = this.state.sections
    var set = false

    if (id == 'next' || id == 'prev') {
      var selectedSection = dataUtils.getSelectedSection(sections)
      var objects = selectedSection ? selectedSection.results : dataUtils.getObjects(sections)
      var selectedIndex = findIndex(objects, object => object.selected)
      var newObject

      if (id == 'next') {
        newObject = objects[selectedIndex + 1]
      }
      else if (id == 'prev') {
        newObject = objects[selectedIndex - 1]
      }

      if (newObject) {
        id = newObject.id
        set = true
      }
    } else {
      set = true
    }

    if (set) {
      dataUtils.setSelectedObject(sections, id)
      this.setState({sections: sections})
      this.emit('selectobject', {id: id})
    }
  },

  getSelectedObject() {
    return dataUtils.getSelectedObject(this.state.sections)
  },

  pickObject(id) {
    this.selectObject(id)
    this.emit('pickobject', {id: id})
  },

  /**
   * Emit DOM event.
   */
  emit(type, data) {
    var event = new CustomEvent(type, {
      bubbles: true,
      cancelable: true,
      detail: data
    })
    this.getDOMNode().dispatchEvent(event)
  },

  render() {
    if (!this.state) return null
    var classes = this.sheet.classes
    var sections = this.state.sections
    var selectedSection = dataUtils.getSelectedSection(sections)
    var serviceName, data

    if (selectedSection) {
      var serviceName = selectedSection.service
      if (!serviceName) throw new Error(`No service "${serviceName}" found.`)
      data = [selectedSection]
    } else {
      serviceName = 'all'
      data = sections
    }

    var facet = React.createElement(services[serviceName], {
      data: data,
      select: this.selectObject,
      pick: this.pickObject
    })

    return (
      <div className={classes.container}>
        <Tabs data={this.state.tabs} select={this.selectFacet} />
        {facet}
      </div>
    )
  }
})

export default Smartcomplete

