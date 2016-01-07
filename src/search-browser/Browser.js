import React, {Component, PropTypes} from 'react'
import findIndex from 'lodash/array/findIndex'
import pick from 'lodash/object/pick'
import get from 'lodash/object/get'
import keyname from 'keyname'
import {shouldPureComponentUpdate} from 'react-pure-render'
import noop from 'lodash/utility/noop'

import {useSheet} from 'grape-web/lib/jss'
import style from './browserStyle'
import TabsWithControls from '../tabs/TabsWithControls'
import Item from './item/Item'
import Empty from '../empty/Empty'
import Spinner from 'grape-web/lib/spinner/Spinner'
import Input from '../input/Input'
import * as services from './services'
import * as dataUtils from './dataUtils'
import buildQuery from '../query/build'
import {TYPES as QUERY_TYPES} from '../query/constants'

const PUBLIC_METHODS = ['selectTab', 'focusItem', 'getFocusedItem']

/**
 * Main search browser component.
 */
@useSheet(style)
export default class Browser extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onDidMount: PropTypes.func,
    onSelectFilter: PropTypes.func,
    onSelectItem: PropTypes.func,
    onInput: PropTypes.func,
    onAbort: PropTypes.func,
    onBlur: PropTypes.func,
    data: PropTypes.object,
    maxItemsPerSectionInAll: PropTypes.number,
    container: PropTypes.element,
    inputDelay: PropTypes.number,
    focused: PropTypes.bool,
    isExternal: PropTypes.bool,
    isLoading: PropTypes.bool,
    images: PropTypes.object,
    height: PropTypes.number,
    className: PropTypes.string
  }

  static defaultProps = {
    height: 400,
    className: '',
    maxItemsPerSectionInAll: 5,
    isExternal: false,
    isLoading: false,
    canAddIntegrations: false,
    inputDelay: 500,
    onAddIntegration: noop,
    onSelectItem: noop,
    onSelectFilter: noop,
    onDidMount: noop,
    onChange: noop,
    onAbort: noop,
    onBlur: noop
  }

  constructor(props) {
    super(props)
    this.state = this.createState(this.props)
    this.exposePublicMethods()
  }

  componentDidMount() {
    this.props.onDidMount(this)
  }

  componentWillReceiveProps(props) {
    this.setState(this.createState(props))
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onFocusItem({id}) {
    this.focusItem(id)
  }

  onSelectItem({id} = {}) {
    if (id) this.focusItem(id)
    const item = this.getFocusedItem()
    const trigger = QUERY_TYPES.search

    if (item.type === 'filters') {
      const service = dataUtils.findById(this.props.data.services, item.id)
      const filters = service ? [service.key] : []
      this.setState({
        search: '',
        filters
      })
      const query = buildQuery({trigger, filters})
      this.props.onSelectFilter(query)
      return
    }

    const query = buildQuery({
      trigger,
      filters: this.state.filters,
      search: this.state.search
    })

    // After selection we don't care about scheduled inputs.
    clearTimeout(this.onInputTimeoutId)

    this.props.onSelectItem({item, query})
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
    }, () => {
      const {inputDelay, onInput} = this.props
      if (!inputDelay) return onInput(query)
      clearTimeout(this.onInputTimeoutId)
      this.onInputTimeoutId = setTimeout(onInput.bind(null, query), inputDelay)
    })
  }

  onMouseDown(e) {
    // Avoids loosing focus and though caret position in input.
    e.preventDefault()
  }

  onAbort(data) {
    // After abortion we don't care about scheduled inputs.
    clearTimeout(this.onInputTimeoutId)
    this.props.onAbort(data)
  }

  getFocusedItem() {
    return dataUtils.getFocusedItem(this.state.sections)
  }

  focusItem(selector) {
    const {sections} = this.state
    let id

    if (selector === 'next' || selector === 'prev') {
      const selectedSection = dataUtils.getSelectedSection(sections)
      const items = selectedSection ? selectedSection.items : dataUtils.extractItems(sections)
      const focusedIndex = findIndex(items, item => item.focused)
      let newItem

      if (selector === 'next') {
        newItem = items[focusedIndex + 1]
        if (!newItem) newItem = items[0]
      } else if (selector === 'prev') {
        newItem = items[focusedIndex - 1]
        if (!newItem) newItem = items[items.length - 1]
      }

      id = newItem.id
    } else id = selector

    if (id) {
      dataUtils.setFocusedItem(sections, id)
      this.setState({sections: [...sections]})
    }
  }

  createState(props) {
    const {data} = props

    if (!data) {
      return {
        sections: [],
        tabs: []
      }
    }

    let serviceId
    if (this.state && this.state.filters) {
      serviceId = dataUtils.filtersToServiceId(data, this.state.filters)
    }

    const sections = dataUtils.getSections(
      data,
      serviceId,
      props.maxItemsPerSectionInAll
    )

    const tabs = dataUtils.getTabs(data.services, serviceId)

    const inputDelay = props.isExternal ? props.inputDelay : undefined

    return {sections, tabs, inputDelay}
  }

  /**
   * Select tab.
   *
   * @param {String} id can be item id or "prev" or "next"
   */
  selectTab(selector) {
    const {tabs} = this.state
    const currIndex = findIndex(tabs, tab => tab.selected)
    let newIndex

    if (selector === 'next') {
      newIndex = currIndex + 1
      if (!tabs[newIndex]) newIndex = 0
    } else if (selector === 'prev') {
      newIndex = currIndex - 1
      if (newIndex < 0) newIndex = tabs.length - 1
    } else {
      newIndex = findIndex(tabs, tab => tab.id === selector)
    }

    const {id} = tabs[newIndex]
    dataUtils.setSelectedTab(tabs, newIndex)
    const sections = dataUtils.getSections(
      this.props.data,
      id,
      this.props.maxItemsPerSectionInAll
    )
    dataUtils.setSelectedSection(sections, id)
    dataUtils.setFocusedItemAt(sections, id, 0)
    const service = dataUtils.findById(this.props.data.services, id)
    const filters = service ? [service.key] : []
    this.setState({tabs, sections, filters})
  }

  exposePublicMethods() {
    const {container} = this.props
    if (!container) return
    PUBLIC_METHODS.forEach(method => container[method] = ::this[method])
  }

  /**
   * Keyboard navigation.
   */
  navigate(e) {
    if (!this.props.data) return
    const {query} = e.detail
    switch (keyname(e.keyCode)) {
      case 'down':
        this.focusItem('next')
        e.preventDefault()
        break
      case 'up':
        this.focusItem('prev')
        e.preventDefault()
        break
      case 'tab':
        this.selectTab(e.shiftKey ? 'prev' : 'next')
        e.preventDefault()
        break
      case 'enter':
        this.onSelectItem()
        e.preventDefault()
        break
      case 'esc':
        this.onAbort({
          reason: 'esc',
          query
        })
        e.preventDefault()
        break
      case 'backspace':
        if (!query.key) {
          this.onAbort({
            reason: 'backspace',
            query
          })
          e.preventDefault()
        }
        break
      default:
    }
  }

  renderContent() {
    let {sections} = this.state
    const {data} = this.props

    if (!data) return null

    const selectedSection = dataUtils.getSelectedSection(sections)
    if (selectedSection) sections = [selectedSection]

    if (data.results.length && sections.length) return this.renderService(sections)

    const hasSearch = Boolean(get(data, 'search.text'))
    const hasService = Boolean(get(data, 'search.container'))

    if (hasSearch || hasService) return <Empty text="Nothing found" />

    if (this.props.isExternal) {
      const text = `Write the search term to search ${data.search.service}.`
      return <Empty text={text} />
    }

    // We have no search, no results and its not an external search.
    // Yet we can always render queries suggestions.
    return this.renderService(sections)
  }

  renderService(data) {
    const Service = services.Default
    const props = pick(this.props, 'hasIntegrations', 'canAddIntegrations',
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

  render() {
    const {classes} = this.props.sheet
    const content = this.renderContent()
    const inlineStyle = {
      height: content ? this.props.height : 'auto'
    }

    return (
      <div
        className={`${classes.browser} ${this.props.className}`}
        style={inlineStyle}
        onMouseDown={::this.onMouseDown}
        data-test="search-browser">
        <div className={classes.inputContainer}>
          <span className={classes.searchIcon} />
          <Input
            onInput={::this.onInput}
            onChangeFilters={this.props.onSelectFilter}
            onBlur={this.props.onBlur}
            onKeyDown={::this.onKeyDown}
            focused={this.props.focused}
            filters={this.state.filters}
            search={this.state.search}
            className={classes.input}
            type="search"
            placeholder="Grape Search" />
        </div>
        {this.state.tabs &&
          <TabsWithControls data={this.state.tabs} onSelect={::this.onSelectTab} />
        }
        {content}
        {this.props.isLoading && <Spinner image={this.props.images.spinner} />}
      </div>
    )
  }
}
