import React, {Component} from 'react'
import useSheet from 'react-jss'
import findIndex from 'lodash-es/array/findIndex'
import pick from 'lodash-es/object/pick'

import style from '../components/browser/style'
import tabsWithControlsStyle from '../components/tabs/tabsWithControlsStyle'
import TabsWithControls from '../components/tabs/TabsWithControls'
import Item from './item/Item'
import Empty from '../components/empty/Empty'
import Spinner from '../components/spinner/Spinner'
import * as services from './services'
import * as dataUtils from './dataUtils'
import {shouldPureComponentUpdate} from 'react-pure-render'

/**
 * Main search browser component.
 */
@useSheet(style)
export default class Browser extends Component {
  static defaultProps = {
    data: undefined,
    height: 400,
    maxWidth: 920,
    className: '',
    maxItemsPerSectionInAll: 5,
    isExternal: false,
    itemId: undefined,
    hasIntegrations: undefined,
    canAddIntegrations: undefined,
    orgName: undefined,
    orgOwner: undefined,
    images: undefined,
    onAddIntegration: undefined,
    onSelectTab: undefined,
    onSelectItem: undefined,
    onDidMount: undefined
  }

  constructor(props) {
    super(props)
    this.state = this.createState(this.props)
    this.exposePublicMethods()
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillReceiveProps(props) {
    this.setState(this.createState(props))
  }

  componentDidMount() {
    let {onDidMount} = this.props
    if (onDidMount) onDidMount(this)
  }

  exposePublicMethods() {
    let {container} = this.props
    if (!container) return
    ['selectTab', 'focusItem', 'getFocusedItem'].forEach(method => {
      container[method] = ::this[method]
    })
  }

  createState(props) {
    let sections = dataUtils.getSections(
      props.data,
      props.itemId,
      props.maxItemsPerSectionInAll
    )
    let tabs = []

    if (props.data) {
      tabs = dataUtils.getTabs(props.data.services, props.itemId)
    }

    return {
      sections: sections,
      tabs: tabs,
      itemId: props.itemId
    }
  }

  /**
   * Select tab.
   *
   * @param {String} id can be item id or "prev" or "next"
   */
  selectTab(id) {
    let {tabs} = this.state
    let currIndex = findIndex(tabs, tab => tab.selected)

    let newIndex
    let set = false

    if (id == 'next') {
      newIndex = currIndex + 1
      if (newIndex < tabs.length) {
        set = true
      }
    }
    else if (id == 'prev') {
      newIndex = currIndex - 1
      if (newIndex >= 0) {
        set = true
      }
    }
    else {
      newIndex = findIndex(tabs, tab => tab.id == id)
      set = true
    }

    if (set) {
      let {id} = tabs[newIndex]
      dataUtils.setSelectedTab(tabs, newIndex)
      let sections = dataUtils.getSections(
        this.props.data,
        id,
        this.props.maxItemsPerSectionInAll
      )
      dataUtils.setSelectedSection(sections, id)
      dataUtils.setFocusedItemAt(sections, id, 0)
      this.setState({tabs: tabs, sections: sections, itemId: id})
      this.props.onSelectTab({id: id})
    }
  }

  focusItem(id) {
    let {sections} = this.state
    let set = false

    if (id == 'next' || id == 'prev') {
      let selectedSection = dataUtils.getSelectedSection(sections)
      let items = selectedSection ? selectedSection.items : dataUtils.extractItems(sections)
      let focusedIndex = findIndex(items, item => item.focused)
      let newItem

      if (id == 'next') {
        newItem = items[focusedIndex + 1]
      }
      else if (id == 'prev') {
        newItem = items[focusedIndex - 1]
      }

      if (newItem) {
        id = newItem.id
        set = true
      }
    }
    else {
      set = true
    }

    if (set) {
      dataUtils.setFocusedItem(sections, id)
      this.setState({sections: [...sections]})
    }
  }

  getFocusedItem() {
    return dataUtils.getFocusedItem(this.state.sections)
  }

  selectItem(id) {
    this.focusItem(id)
    this.props.onSelectItem(this.getFocusedItem())
  }

  render() {
    let {classes} = this.props.sheet
    let {sections} = this.state
    let selectedSection = dataUtils.getSelectedSection(sections)
    let data = selectedSection ? [selectedSection] : sections
    let Service = services.Default
    let content

    if (data.length) {
      let props = pick(this.props, 'hasIntegrations', 'canAddIntegrations',
        'images', 'onAddIntegration', 'orgName', 'orgOwner')

      content = (
        <Service
          {...props}
          Item = {Item}
          data = {data}
          focusedItem = {this.getFocusedItem()}
          onFocus = {::this.onFocusItem}
          onSelect = {::this.onSelectItem} />
      )
    }
    else {
      let text

      if (this.props.isExternal) {
        text = `Write the search term to search ${this.props.data.search.service}.`
      }
      else if (this.props.data.results) {
        text = 'Nothing found.'
      }

      content = <Empty text={text} />
    }

    return (
      <div
        className={`${classes.browser} ${this.props.className}`}
        style={pick(this.props, 'height', 'maxWidth')}
        onMouseDown={::this.onMouseDown}>
        <TabsWithControls data={this.state.tabs} onSelect={::this.onSelectTab} />
        {content}
        {!data.length && <Spinner />}
      </div>
    )
  }

  onFocusItem(data) {
    this.focusItem(data.id)
  }

  onSelectItem(data) {
    this.selectItem(data.id)
  }

  onSelectTab(data) {
    this.selectTab(data.id)
  }

  onMouseDown(e) {
    // Important!!!
    // Avoids loosing focus and though caret position in editable.
    e.preventDefault()
  }
}
