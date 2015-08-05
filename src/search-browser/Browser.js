import React, {Component} from 'react'
import findIndex from 'lodash/array/findIndex'
import pick from 'lodash/object/pick'
import get from 'lodash/object/get'
import keyname from 'keyname'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from '../jss'
import style from '../browser/style'
import TabsWithControls from '../tabs/TabsWithControls'
import Item from './item/Item'
import Empty from '../empty/Empty'
import Spinner from '../spinner/Spinner'
import Input from '../input/Input'
import * as services from './services'
import * as dataUtils from './dataUtils'
import buildQuery from '../query/build'
import {TYPES as QUERY_TYPES} from '../query/constants'

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
    isLoading: false,
    hasIntegrations: undefined,
    canAddIntegrations: undefined,
    orgName: undefined,
    orgOwner: undefined,
    images: undefined,
    inputDelay: 500,
    focused: undefined,
    onAddIntegration: undefined,
    onSelectItem: undefined,
    onSelectFilter: undefined,
    onDidMount: undefined,
    onChange: undefined,
    onAbort: undefined,
    onBlur: undefined
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
    let {data} = props

    if (!data) return {}

    let serviceId
    if (this.state && this.state.filters) {
      serviceId = dataUtils.filtersToServiceId(data, this.state.filters)
    }

    let sections = dataUtils.getSections(
      data,
      serviceId,
      props.maxItemsPerSectionInAll
    )

    let tabs = dataUtils.getTabs(data.services, serviceId)

    let inputDelay = props.isExternal ? props.inputDelay : undefined

    return {sections, tabs, inputDelay}
  }

  /**
   * Select tab.
   *
   * @param {String} id can be item id or "prev" or "next"
   */
  selectTab(selector) {
    let {tabs} = this.state
    let currIndex = findIndex(tabs, tab => tab.selected)
    let newIndex

    if (selector === 'next') {
      newIndex = currIndex + 1
      if (!tabs[newIndex]) newIndex = 0
    }
    else if (selector === 'prev') {
      newIndex = currIndex - 1
      if (newIndex < 0) newIndex = tabs.length - 1
    }
    else {
      newIndex = findIndex(tabs, tab => tab.id === selector)
    }

    let {id} = tabs[newIndex]
    dataUtils.setSelectedTab(tabs, newIndex)
    let sections = dataUtils.getSections(
      this.props.data,
      id,
      this.props.maxItemsPerSectionInAll
    )
    dataUtils.setSelectedSection(sections, id)
    dataUtils.setFocusedItemAt(sections, id, 0)
    let service = dataUtils.findById(this.props.data.services, id)
    let filters = service ? [service.key] : []
    this.setState({tabs, sections, filters})
  }

  focusItem(selector) {
    let {sections} = this.state
    let id

    if (selector === 'next' || selector === 'prev') {
      let selectedSection = dataUtils.getSelectedSection(sections)
      let items = selectedSection ? selectedSection.items : dataUtils.extractItems(sections)
      let focusedIndex = findIndex(items, item => item.focused)
      let newItem

      if (selector === 'next') {
        newItem = items[focusedIndex + 1]
        if (!newItem) newItem = items[0]
      }
      else if (selector === 'prev') {
        newItem = items[focusedIndex - 1]
        if (!newItem) newItem = items[items.length - 1]
      }

      id = newItem.id
    }
    else id = selector

    if (id) {
      dataUtils.setFocusedItem(sections, id)
      this.setState({sections: [...sections]})
    }
  }

  getFocusedItem() {
    return dataUtils.getFocusedItem(this.state.sections)
  }

  render() {
    let {classes} = this.props.sheet

    return (
      <div
        className={`${classes.browser} ${this.props.className}`}
        style={pick(this.props, 'height', 'maxWidth')}
        onMouseDown={::this.onMouseDown}>
        <Input
          onInput={::this.onInput}
          onChangeFilters={this.props.onSelectFilter}
          onBlur={this.props.onBlur}
          onKeyDown={::this.onKeyDown}
          delay={this.state.inputDelay}
          focused={this.props.focused}
          filters={this.state.filters}
          search={this.state.search}
          type="search" />
        {this.state.tabs &&
          <TabsWithControls data={this.state.tabs} onSelect={::this.onSelectTab} />
        }
        {this.renderContent()}
        {this.props.isLoading && <Spinner image={this.props.images.spinner} />}
      </div>
    )
  }

  renderContent() {
    let {sections} = this.state
    let {data} = this.props

    if (!data) return null

    let selectedSection = dataUtils.getSelectedSection(sections)
    if (selectedSection) sections = [selectedSection]

    if (data.results.length && sections.length) return this.renderService(sections)

    let hasSearch = Boolean(get(data, 'search.text'))
    let hasService = Boolean(get(data, 'search.container'))

    if (hasSearch || hasService) return <Empty text="Nothing found" />

    if (this.props.isExternal) {
      let text = `Write the search term to search ${data.search.service}.`
      return <Empty text={text} />
    }

    // We have no search, no results and its not an external search.
    // Yet we can always render queries suggestions.
    return this.renderService(sections)
  }

  renderService(data) {
    let Service = services.Default
    let props = pick(this.props, 'hasIntegrations', 'canAddIntegrations',
      'images', 'onAddIntegration', 'orgName', 'orgOwner')

    return (
      <Service
        {...props}
        Item={Item}
        data={data}
        focusedItem={this.getFocusedItem()}
        onFocus={::this.onFocusItem}
        onSelect={::this.onSelectItem} />
    )
  }

  /**
   * Keyboard navigation.
   */
  navigate(e) {
    switch (keyname(e.keyCode)) {
      case 'down':
        this.focusItem('next')
        e.preventDefault()
        break
      case 'up':
        this.focusItem('prev')
        e.preventDefault()
        break
      case 'right':
      case 'tab':
        this.selectTab('next')
        e.preventDefault()
        break
      case 'left':
        this.selectTab('prev')
        e.preventDefault()
        break
      case 'enter':
        this.onSelectItem()
        e.preventDefault()
        break
      case 'esc':
        this.props.onAbort({
          reason: 'esc',
          query: e.detail.query
        })
        e.preventDefault()
        break
      default:
    }
  }

  onFocusItem({id}) {
    this.focusItem(id)
  }

  onSelectItem({id} = {}) {
    if (id) this.focusItem(id)
    let item = this.getFocusedItem()

    if (item.type === 'filters') {
      let query = buildQuery({
        trigger: QUERY_TYPES.search,
        filters: [item.id]
      })
      this.setState({
        search: '',
        filters: query.filters
      })
      this.props.onSelectFilter(query)
      return
    }

    this.props.onSelectItem(item)
  }

  onSelectTab({id}) {
    this.selectTab(id)
  }

  onKeyDown(e) {
    this.navigate(e)
  }

  onInput(query) {
    this.setState({
      search: query.search,
      filters: query.filters
    }, this.props.onInput.bind(null, query))
  }

  onMouseDown(e) {
    // Important!!!
    // Avoids loosing focus and though caret position in input.
    e.preventDefault()
  }
}
