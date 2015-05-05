import React from 'react'
import useSheet from 'react-jss'
import findIndex from 'lodash-es/array/findIndex'
import pick from 'lodash-es/object/pick'
import assign from 'lodash-es/object/assign'

import browserStyle from './browserStyle'
import tabsControlsStyle from './tabsControlsStyle'
import TabsControls from './TabsControls'
import Empty from './Empty'
import * as services from '../services'
import * as dataUtils from '../common/utils/data'

/**
 * Main component which uses everything else.
 */
export default React.createClass({
  mixins: [useSheet(browserStyle)],

  getDefaultProps() {
    return {
      data: undefined,
      height: 340,
      className: '',
      maxObjectsPerSectionInAll: 5,
      isExternal: false,
      serviceId: undefined,
      hasIntegrations: undefined,
      canAddIntegrations: undefined,
      orgName: undefined,
      orgOwner: undefined,
      images: undefined,
      onAddIntegration: undefined,
      onSelectFacet: undefined,
      onSelectObject: undefined
    }
  },

  getInitialState() {
    return this.createState(this.props)
  },

  componentWillReceiveProps(props) {
    this.setState(this.createState(props))
  },

  createState(props) {
    let sections = dataUtils.getSections(props.data, props.serviceId, props.maxObjectsPerSectionInAll)
    let tabs = []

    if (props.data) {
      tabs = dataUtils.getTabs(props.data.services, sections, props.serviceId)
    }

    return {
      sections: sections,
      tabs: tabs,
      serviceId: props.serviceId
    }
  },

  /**
   * Select facet.
   *
   * @param {String} facet can be service id or "prev" or "next"
   * @param {Object} [options]
   */
  selectFacet(facet, options = {}, callback) {
    let {tabs} = this.state
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
      let maxObjects = service ? undefined : this.props.maxObjectsPerSectionInAll
      let sections = dataUtils.getSections(this.props.data, service, maxObjects)
      dataUtils.setSelectedSection(sections, service)
      dataUtils.setFocusedObjectAt(sections, service, 0)
      this.setState({tabs: tabs, sections: sections, serviceId: service}, callback)
      if (!options.silent) this.props.onSelectFacet({service: service})
    }
  },

  focusObject(id) {
    let {sections} = this.state
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
    this.props.onSelectObject({id: id})
  },

  render() {
    let {classes} = this.sheet
    let {sections} = this.state
    let selectedSection = dataUtils.getSelectedSection(sections)
    let serviceName = 'all'
    let data = selectedSection ? [selectedSection] : sections
    let content

    if (data.length) {
      let props = pick(this.props, 'hasIntegrations', 'canAddIntegrations',
        'images', 'onAddIntegration', 'orgName', 'orgOwner')

      assign(props, {
        data: data,
        focusedObject: this.getFocusedObject(),
        height: this.props.height - tabsControlsStyle.container.height,
        onFocus: this.onFocusObject,
        onSelect: this.onSelectObject,
      })

      content = React.createElement(services[serviceName], props)
    }
    else {
      let text
      if (this.props.isExternal) {
        text = `Write the search term to search ${this.props.data.search.service}.`
      }
      content = <Empty text={text}/>
    }

    let style = {
      height: `${this.props.height}px`
    }

    return (
      <div
        className={`${classes.container} ${this.props.className}`}
        style={style}
        >
        <TabsControls data={this.state.tabs} onSelect={this.onSelectFacet} />
        {content}
      </div>
    )
  },

  onFocusObject(data) {
    this.focusObject(data.id)
  },

  onSelectObject(data) {
    this.selectObject(data.id)
  },

  onSelectFacet(data, callback) {
    this.selectFacet(data.facet, {}, callback)
  }
})
