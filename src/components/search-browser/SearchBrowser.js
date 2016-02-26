import React, {Component, PropTypes} from 'react'
import keyname from 'keyname'
import Spinner from 'grape-web/lib/spinner/Spinner'
import {useSheet} from 'grape-web/lib/jss'

import style from './searchBrowserStyle'
import Item from './item/Item'
import {Default as Service} from './services'
import SearchInput from './search-input/SearchInput'
import ServiceList from './service-list/ServiceList'
import Info from './info/Info'
import Empty from '../empty/Empty'
import {listTypes} from './constants'

/**
 * Main search browser component.
 */
@useSheet(style)
export default class SearchBrowser extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onDidMount: PropTypes.func,
    onAbort: PropTypes.func,
    onBlur: PropTypes.func,
    showSearchBrowserItems: PropTypes.func,
    focusSearchBrowserItem: PropTypes.func,
    selectSearchBrowserItem: PropTypes.func,
    changeSearchBrowserInput: PropTypes.func,
    focusSearchBrowserService: PropTypes.func,
    addSearchBrowserService: PropTypes.func,
    clearSearchBrowserInput: PropTypes.func,
    focusSearchBrowserActions: PropTypes.func,
    focusSearchBrowserAction: PropTypes.func,
    execSearchBrowserAction: PropTypes.func,
    sections: PropTypes.array,
    currServices: PropTypes.array,
    isLoading: PropTypes.bool,
    images: PropTypes.object,
    height: PropTypes.number,
    className: PropTypes.string,
    value: PropTypes.string,
    search: PropTypes.string,
    focusedView: PropTypes.oneOf(listTypes),
    focusedItem: PropTypes.object,
    focusedService: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.onDidMount(this)
  }

  componentWillReceiveProps(nextProps) {
    const service = this.state.lastAddedService
    if (service && nextProps.filters.indexOf(service.id) >= 0) {
      this.setState({lastAddedService: null})
      this.input.replace(service.label)
    }
  }

  onFocusItem({id}) {
    if (this.props.focusedItem.id === id) return
    this.props.focusSearchBrowserItem(id)
  }

  onSelectItem({id} = {}) {
    this.props.selectSearchBrowserItem(id)
  }

  onKeyDown(e) {
    const {focusedView} = this.props

    switch (keyname(e.keyCode)) {
      case 'esc':
        // Actions are focused - focus objects.
        if (focusedView !== 'objects') {
          this.props.showSearchBrowserItems()
        // Reset the search if there is one.
        } else if (this.props.value.trim()) {
          this.props.clearSearchBrowserInput()
        } else {
          this.props.onAbort()
        }
        e.preventDefault()
        break
      case 'down':
        if (focusedView === 'services') this.props.focusSearchBrowserService('next')
        else if (focusedView === 'actions') this.props.focusSearchBrowserAction('next')
        else this.props.focusSearchBrowserItem('next')
        e.preventDefault()
        break
      case 'up':
        if (focusedView === 'services') this.props.focusSearchBrowserService('prev')
        else if (focusedView === 'actions') this.props.focusSearchBrowserAction('prev')
        else this.props.focusSearchBrowserItem('prev')
        e.preventDefault()
        break
      case 'enter':
        if (focusedView === 'services') this.onAddService(this.props.focusedService)
        else if (focusedView === 'actions') this.props.execSearchBrowserAction()
        else this.props.focusSearchBrowserActions()
        e.preventDefault()
        break
      case 'backspace':
        if (focusedView === 'actions') {
          this.props.showSearchBrowserItems()
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

  onAddService(service) {
    if (!service) return
    // We need to schedule the filter insertion into input until the action is
    // created and applied to the state, because as soon as we insert the filter
    // into the input, change event will trigger the search and before this,
    // state needs to have all the data in place.
    this.setState({lastAddedService: service}, () => {
      this.props.addSearchBrowserService(service)
    })
  }

  getBody() {
    const {height, sections, search, focusedView} = this.props

    if (focusedView === 'services') {
      const element = (
        <ServiceList
          {...this.props}
          services={this.props.currServices}
          focused={this.props.focusedService}
          onSelect={::this.onAddService}
          onFocus={this.props.focusSearchBrowserService} />
      )
      return {element, height}
    }

    if (sections.length) {
      const element = (
        <Service
          {...this.props}
          Item={Item}
          data={sections}
          onFocus={::this.onFocusItem}
          onSelect={::this.onSelectItem} />
      )
      return {element, height}
    }

    if (search.trim()) {
      return {
        element: <Empty text="No Results." />,
        height: 'auto'
      }
    }

    return {
      element: <Info {...this.props} />,
      height: 'auto'
    }
  }

  render() {
    const {classes} = this.props.sheet
    const body = this.getBody()

    return (
      <div
        className={`${classes.browser} ${this.props.className}`}
        // Set a fixed height when we have search results, otherwise height should
        // be auto detected.
        style={{
          height: body.height,
          maxHeight: this.props.height
        }}
        onMouseDown={::this.onMouseDown}
        data-test="search-browser"
        tabIndex="-1">
        <SearchInput
          {...this.props}
          onDidMount={::this.onMountInput}
          onKeyDown={::this.onKeyDown}
          onChange={this.props.changeSearchBrowserInput}
          onBlur={::this.onBlur} />
        {body.element}
        {this.props.isLoading && <Spinner image={this.props.images.spinner} />}
      </div>
    )
  }
}
