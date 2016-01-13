import React, {Component, PropTypes} from 'react'
import pick from 'lodash/object/pick'
import get from 'lodash/object/get'
import keyname from 'keyname'
import noop from 'lodash/utility/noop'

import {useSheet} from 'grape-web/lib/jss'
import style from './browserStyle'
import TabsWithControls from '../tabs/TabsWithControls'
import Item from './item/Item'
import Empty from '../empty/Empty'
import Spinner from 'grape-web/lib/spinner/Spinner'
import Input from '../input/Input'
import * as services from './services'

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
    focusSearchBrowserItem: PropTypes.func,
    selectSearchBrowserItem: PropTypes.func,
    focusedItem: PropTypes.object,
    data: PropTypes.object,
    sections: PropTypes.array,
    maxItemsPerSectionInAll: PropTypes.number,
    container: PropTypes.element,
    focused: PropTypes.bool,
    isExternal: PropTypes.bool,
    externalServicesInputDelay: PropTypes.number,
    isLoading: PropTypes.bool,
    images: PropTypes.object,
    height: PropTypes.number,
    className: PropTypes.string,
    tabs: PropTypes.array,
    search: PropTypes.string,
    filters: PropTypes.array
  }

  static defaultProps = {
    height: 400,
    className: '',
    maxItemsPerSectionInAll: 5,
    isExternal: false,
    isLoading: false,
    canAddIntegrations: false,
    externalServicesInputDelay: 500,
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
    this.exposePublicMethods()
  }

  componentDidMount() {
    this.props.onDidMount(this)
  }

  onFocusItem({id}) {
    this.props.focusSearchBrowserItem(id)
  }

  onSelectItem({id} = {}) {
    // After selection we don't care about scheduled inputs.
    clearTimeout(this.onInputTimeoutId)
    this.props.selectSearchBrowserItem(id)
  }

  onSelectTab({id}) {
    this.selectTab(id)
  }

  onKeyDown(e) {
    if (!this.props.data) return
    switch (keyname(e.keyCode)) {
      case 'down':
        this.props.focusSearchBrowserItem('next')
        e.preventDefault()
        break
      case 'up':
        this.props.focusSearchBrowserItem('prev')
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
      default:
    }
  }

  onInput(query) {
    this.setState({
      search: query.search,
      filters: query.filters
    }, () => {
      const {onInput} = this.props
      const {inputDelay} = this.state

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
    return this.props.focusedItem
  }

  /**
   * Select tab.
   *
   * @param {String} id can be item id or "prev" or "next"
   */
  /*
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
    */

  exposePublicMethods() {
    const {container} = this.props
    if (!container) return
    PUBLIC_METHODS.forEach(method => container[method] = ::this[method])
  }

  renderContent() {
    const {sections, data} = this.props

    if (!data) return null

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
        focusedItem={this.props.focusedItem}
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
            onKeyDown={::this.onKeyDown}
            onInput={::this.onInput}
            onChangeFilters={this.props.onSelectFilter}
            focused={this.props.focused}
            filters={this.props.filters}
            search={this.props.search}
            className={classes.input}
            type="search"
            placeholder="Grape Search" />
        </div>
        {this.props.tabs &&
          <TabsWithControls data={this.props.tabs} onSelect={::this.onSelectTab} />
        }
        {content}
        {this.props.isLoading && <Spinner image={this.props.images.spinner} />}
      </div>
    )
  }
}
