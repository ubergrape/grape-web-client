import React, {Component, PropTypes} from 'react'
import get from 'lodash/object/get'
import keyname from 'keyname'

import {useSheet} from 'grape-web/lib/jss'
import style from './browserStyle'
import TabsWithControls from '../tabs/TabsWithControls'
import Item from './item/Item'
import Empty from '../empty/Empty'
import Spinner from 'grape-web/lib/spinner/Spinner'
import Input from '../input/Input'
import * as services from './services'

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
    selectSearchBrowserTab: PropTypes.func,
    navigateSearchBrowser: PropTypes.func,
    focusedItem: PropTypes.object,
    focused: PropTypes.bool,
    data: PropTypes.object,
    sections: PropTypes.array,
    maxItemsPerSectionInAll: PropTypes.number,
    container: PropTypes.element,
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

  componentDidMount() {
    this.props.onDidMount(this)
  }

  onFocusItem({id}) {
    if (this.props.focusedItem.id === id) return
    this.props.focusSearchBrowserItem(id)
  }

  onSelectItem({id} = {}) {
    this.ignoreScheduledInput()
    this.props.selectSearchBrowserItem(id)
  }

  onSelectTab({id}) {
    this.props.selectSearchBrowserTab(id)
  }

  onKeyDown(e) {
    if (!this.props.data) return

    this.ignoreScheduledInput()

    switch (keyname(e.keyCode)) {
      case 'down':
        this.props.navigateSearchBrowser('next')
        e.preventDefault()
        break
      case 'up':
        this.props.navigateSearchBrowser('prev')
        e.preventDefault()
        break
      case 'enter':
        this.props.navigateSearchBrowser('select')
        e.preventDefault()
        break
      case 'backspace':
        this.props.navigateSearchBrowser('back')
        e.preventDefault()
        break
      case 'tab':
        this.props.selectSearchBrowserTab(e.shiftKey ? 'prev' : 'next')
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

  // After selection we don't care about scheduled inputs.
  ignoreScheduledInput() {
    clearTimeout(this.onInputTimeoutId)
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
    return (
      <Service
        {...this.props}
        Item={Item}
        data={data}
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
