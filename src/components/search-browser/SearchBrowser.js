import PropTypes from 'prop-types'
import React, {Component} from 'react'
import keyname from 'keyname'
import Spinner from 'grape-web/lib/spinner/Spinner'
import injectSheet from 'grape-web/lib/jss'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import style from './searchBrowserStyle'
import Results from './results/Results'
import SearchInput from './search-input/SearchInput'
import ServiceList from './service-list/ServiceList'
import Info from './info/Info'
import Empty from '../empty/Empty'
import {listTypes} from './constants'

const messages = defineMessages({
  empty: {
    id: 'noResults',
    defaultMessage: 'No Results.'
  }
})


/**
 * Main search browser component.
 */
@injectSheet(style)
@injectIntl
export default class SearchBrowser extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    onDidMount: PropTypes.func,
    onAbort: PropTypes.func,
    onBlur: PropTypes.func,
    onAddIntegration: PropTypes.func,
    servicesResultsAmounts: PropTypes.object,
    showSearchBrowserResults: PropTypes.func,
    focusSearchBrowserResult: PropTypes.func,
    selectSearchBrowserResult: PropTypes.func,
    changeSearchBrowserInput: PropTypes.func,
    focusSearchBrowserService: PropTypes.func,
    addSearchBrowserService: PropTypes.func,
    clearSearchBrowserInput: PropTypes.func,
    focusSearchBrowserActions: PropTypes.func,
    focusSearchBrowserAction: PropTypes.func,
    execSearchBrowserAction: PropTypes.func,
    results: PropTypes.array,
    currServices: PropTypes.array,
    isLoading: PropTypes.bool,
    images: PropTypes.object,
    height: PropTypes.number,
    className: PropTypes.string,
    value: PropTypes.string,
    search: PropTypes.string,
    focusedView: PropTypes.oneOf(listTypes),
    focusedResult: PropTypes.object,
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

  onFocusResult = (result) => {
    if (this.props.focusedResult === result) return
    this.props.focusSearchBrowserResult(result)
  }

  onSelectResult = (result) => {
    this.props.selectSearchBrowserResult(result)
  }

  onKeyDown = (e) => {
    const {focusedView} = this.props

    switch (keyname(e.keyCode)) {
      case 'esc':
        // Actions are focused - focus results.
        if (focusedView !== 'results') {
          this.props.showSearchBrowserResults()
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
        else this.props.focusSearchBrowserResult('next')
        e.preventDefault()
        break
      case 'up':
        if (focusedView === 'services') this.props.focusSearchBrowserService('prev')
        else if (focusedView === 'actions') this.props.focusSearchBrowserAction('prev')
        else this.props.focusSearchBrowserResult('prev')
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
          this.props.showSearchBrowserResults()
          e.preventDefault()
        }
        break
      default:
    }
  }

  onMouseDown = (e) => {
    // This flag is to fix IE11 issue
    // http://stackoverflow.com/questions/2023779/clicking-on-a-divs-scroll-bar-fires-the-blur-event-in-i-e
    this.blurPrevented = true

    // Avoids loosing focus and though caret position in input.
    if (e.target.nodeName !== 'INPUT') e.preventDefault()
  }

  onBlur = (e) => {
    if (!this.blurPrevented) {
      this.props.onBlur(e)
      return
    }

    this.blurPrevented = false
    e.target.focus()
  }

  onMountInput = (ref) => {
    this.input = ref
  }

  onAddService = (service) => {
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
    const {
      height, results, search, intl: {formatMessage},
      onAddIntegration, focusedView,
      currServices, focusedService, focusSearchBrowserService,
      ...rest
    } = this.props

    if (focusedView === 'services') {
      const element = (
        <ServiceList
          {...rest}
          services={currServices}
          focused={focusedService}
          onSelect={::this.onAddService}
          onFocus={focusSearchBrowserService} />
      )
      return {element, height}
    }

    if (results.length) {
      const element = (
        <Results
          {...rest}
          focusedView={focusedView}
          data={results}
          onFocus={::this.onFocusResult}
          onSelect={::this.onSelectResult} />
      )
      return {element, height}
    }

    if (search.trim()) {
      return {
        element: <Empty text={formatMessage(messages.empty)} />,
        height: 'auto'
      }
    }

    return {
      element: <Info onAddIntegration={onAddIntegration} />,
      height: 'auto'
    }
  }

  render() {
    const {
      sheet: {classes},
      height,
      changeSearchBrowserInput,
      className,
      ...rest
    } = this.props
    const body = this.getBody()

    return (
      <div
        className={`${classes.browser} ${className}`}
        // Set a fixed height when we have search results, otherwise height should
        // be auto detected.
        style={{
          height: body.height,
          maxHeight: height
        }}
        onMouseDown={this.onMouseDown}
        data-test="search-browser"
        tabIndex="-1">
        <SearchInput
          {...rest}
          onDidMount={this.onMountInput}
          onKeyDown={this.onKeyDown}
          onChange={changeSearchBrowserInput}
          onBlur={this.onBlur} />
        {body.element}
        {this.props.isLoading && <Spinner image={this.props.images.spinner} />}
      </div>
    )
  }
}
