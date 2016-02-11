import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
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
    addSearchBrowserFilter: PropTypes.func,
    data: PropTypes.object,
    sections: PropTypes.array,
    isLoading: PropTypes.bool,
    images: PropTypes.object,
    height: PropTypes.number,
    className: PropTypes.string,
    search: PropTypes.string,
    filters: PropTypes.array,
    focused: PropTypes.bool,
    focusedList: PropTypes.oneOf(listTypes),
    focusedItem: PropTypes.object,
    tokens: PropTypes.object
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
        if (focusedList === 'actions') {
          this.props.navigateSearchBrowser('back')
        // Reset the search if there is one.
        } else if (this.props.search || this.props.filters.length) {
          this.resetSearch()
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
        this.props.navigateSearchBrowser('select')
        e.preventDefault()
        break
      case 'backspace':
        if (focusedList === 'actions') {
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
    const input = ReactDOM.findDOMNode(this.input)
    if (e.target !== input) e.preventDefault()
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
      // FIXME
      search: value,
      filters: [],
      trigger: '#'
    })
  }

  onAddService(service) {
    this.input.replace(service.label)
    // FIXME
    setTimeout(() => {
      this.props.addSearchBrowserFilter(service)
    })
  }

  resetSearch() {
    this.props.inputSearchBrowserSearch({
      trigger: this.refs.input.query.get('trigger'),
      search: '',
      filters: []
    })
  }

  renderBody() {
    const {sections, search, filters, focusedList, data} = this.props

    if (focusedList === 'services') {
      return (
        <ServiceList
          services={data.services}
          onSelect={::this.onAddService} />
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
          onDidMount={::this.onMountInput}
          onKeyDown={::this.onKeyDown}
          onKeyPress={::this.onKeyPress}
          onChange={::this.onChangeSearch}
          onBlur={::this.onBlur}
          focused={this.props.focused}
          value={this.props.search}
          tokens={this.props.tokens} />
        {body}
        {this.props.isLoading && <Spinner image={this.props.images.spinner} />}
      </div>
    )
  }
}
