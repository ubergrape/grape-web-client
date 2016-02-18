import React, {Component, PropTypes} from 'react'
import keyname from 'keyname'
import Spinner from 'grape-web/lib/spinner/Spinner'
import {useSheet} from 'grape-web/lib/jss'

import style from './searchBrowserStyle'
import Item from './item/Item'
import * as services from './services'
import SearchInput from './search-input/SearchInput'
import ServiceList from './service-list/ServiceList'
import Empty from '../empty/Empty'
import {listTypes} from '../../constants/searchBrowser'

/**
 * Main search browser component.
 */
@useSheet(style)
export default class Browser extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onDidMount: PropTypes.func,
    onAbort: PropTypes.func,
    onBlur: PropTypes.func,
    focusSearchBrowserItem: PropTypes.func,
    selectSearchBrowserItem: PropTypes.func,
    navigateSearchBrowser: PropTypes.func,
    inputSearchBrowserSearch: PropTypes.func,
    showSearchBrowserServices: PropTypes.func,
    focusSearchBrowserService: PropTypes.func,
    addSearchBrowserFilter: PropTypes.func,
    resetSearchBrowser: PropTypes.func,
    sections: PropTypes.array,
    isLoading: PropTypes.bool,
    images: PropTypes.object,
    height: PropTypes.number,
    className: PropTypes.string,
    search: PropTypes.string,
    filters: PropTypes.array,
    focusedList: PropTypes.oneOf(listTypes),
    focusedItem: PropTypes.object,
    focusedService: PropTypes.object
  }

  componentDidMount() {
    this.props.onDidMount(this)
  }

  onFocusItem({id}) {
    if (this.props.focusedItem.id === id) return
    this.props.focusSearchBrowserItem(id)
  }

  onSelectItem({id} = {}) {
    this.props.selectSearchBrowserItem(id)
  }

  onKeyPress(e) {
    if (String.fromCharCode(e.charCode) === '+') {
      this.props.showSearchBrowserServices()
    }
  }

  onKeyDown(e) {
    const {focusedList} = this.props

    switch (keyname(e.keyCode)) {
      case 'esc':
        // Actions are focused - focus objects.
        if (focusedList === 'actions' || focusedList === 'services') {
          this.props.navigateSearchBrowser('back')
        // Reset the search if there is one.
        } else if (this.props.search || this.props.filters.length) {
          this.props.resetSearchBrowser()
        } else {
          this.props.onAbort()
        }
        e.preventDefault()
        break
      case 'down':
        this.props.navigateSearchBrowser('next')
        e.preventDefault()
        break
      case 'up':
        this.props.navigateSearchBrowser('prev')
        e.preventDefault()
        break
      case 'enter':
        if (focusedList === 'services') this.onAddService(this.props.focusedService)
        else this.props.navigateSearchBrowser('select')
        e.preventDefault()
        break
      case 'backspace':
        if (focusedList === 'actions' || focusedList === 'services') {
          this.props.navigateSearchBrowser('back')
          e.preventDefault()
        }
        break
      default:
    }
  }

  onMouseDown(e) {
    // This flag is to fix IE11 issue
    // http://stackoverflow.com/questions/2023779/clicking-on-a-divs-scroll-bar-fires-the-blur-event-in-i-e
    this.blurPrevented = true

    // Avoids loosing focus and though caret position in input.
    if (e.target.nodeName !== 'INPUT') e.preventDefault()
  }

  onBlur(e) {
    if (!this.blurPrevented) {
      this.props.onBlur(e)
      return
    }

    this.blurPrevented = false
    e.target.focus()
  }

  onMountInput(ref) {
    this.input = ref
  }

  onChangeSearch({value}) {
    this.props.inputSearchBrowserSearch({
      search: value,
      split: this.input.splitByTokens()
    })
  }

  onAddService(service) {
    this.props.addSearchBrowserFilter(service)
    // FIXME
    setTimeout(() => {
      this.input.replace(service.label)
    })
  }

  renderBody() {
    const {sections, search, filters, focusedList} = this.props

    if (focusedList === 'services') {
      return (
        <ServiceList
          {...this.props}
          focused={this.props.focusedService}
          onSelect={::this.onAddService}
          onFocus={this.props.focusSearchBrowserService} />
      )
    }

    if (sections.length) {
      const Service = services.Default
      return (
        <Service
          {...this.props}
          Item={Item}
          data={sections}
          onFocus={::this.onFocusItem}
          onSelect={::this.onSelectItem} />
      )
    }

    if (search || filters.length) {
      return <Empty text="Nothing found" />
    }
  }

  render() {
    const {classes} = this.props.sheet
    const body = this.renderBody()

    const inlineStyle = {
      // Set a fixed height when we have content, otherwise just input field.
      height: body ? this.props.height : 'auto'
    }

    return (
      <div
        className={`${classes.browser} ${this.props.className}`}
        style={inlineStyle}
        onMouseDown={::this.onMouseDown}
        data-test="search-browser"
        tabIndex="-1">
        <SearchInput
          {...this.props}
          value={this.props.search}
          onDidMount={::this.onMountInput}
          onKeyDown={::this.onKeyDown}
          onKeyPress={::this.onKeyPress}
          onChange={::this.onChangeSearch}
          onBlur={::this.onBlur} />
        {body}
        {this.props.isLoading && <Spinner image={this.props.images.spinner} />}
      </div>
    )
  }
}
