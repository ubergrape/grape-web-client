import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import keyname from 'keyname'
import Spinner from 'grape-web/lib/components/spinner'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'
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
import {listTypes} from './constants'
import Empty from '../empty/Empty'

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
export default class SearchBrowser extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    results: PropTypes.array,
    servicesStats: PropTypes.object,
    currServices: PropTypes.array,
    /* eslint-disable react/no-unused-prop-types */
    filters: PropTypes.array,
    /* eslint-enable react/no-unused-prop-types */
    isLoading: PropTypes.bool,
    height: PropTypes.number,
    className: PropTypes.string,
    tokens: PropTypes.object,
    value: PropTypes.string,
    search: PropTypes.string,
    focusedView: PropTypes.oneOf(listTypes),
    focusedResult: PropTypes.object,
    focusedService: PropTypes.object,
    onDidMount: PropTypes.func,
    onAbort: PropTypes.func,
    onBlur: PropTypes.func,
    onAddIntegration: PropTypes.func,
    onLoadServices: PropTypes.func,
    onShowResults: PropTypes.func,
    onFocusResult: PropTypes.func,
    onSelectResult: PropTypes.func,
    onChangeInput: PropTypes.func,
    onFocusService: PropTypes.func,
    onAddService: PropTypes.func,
    onClearInput: PropTypes.func,
    onFocusActions: PropTypes.func,
    onFocusAction: PropTypes.func,
    onExecAction: PropTypes.func
  }

  static defaultProps = {
    results: [],
    servicesStats: null,
    currServices: [],
    filters: [],
    tokens: null,
    focusedView: 'results',
    focusedResult: null,
    focusedService: null,
    isLoading: false,
    value: '',
    search: '',
    className: '',
    height: 400,
    onDidMount: noop,
    onAbort: noop,
    onBlur: noop,
    onAddIntegration: noop,
    onLoadServices: noop,
    onShowResults: noop,
    onFocusResult: noop,
    onSelectResult: noop,
    onChangeInput: noop,
    onFocusService: noop,
    onAddService: noop,
    onClearInput: noop,
    onFocusActions: noop,
    onFocusAction: noop,
    onExecAction: noop
  }

  state = {}

  componentDidMount() {
    this.props.onDidMount(this)
    this.props.onLoadServices()
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
    this.props.onFocusResult(result)
  }

  onSelectResult = (result) => {
    this.props.onSelectResult(result)
  }

  onKeyDown = (e) => {
    const {focusedView} = this.props

    switch (keyname(e.keyCode)) {
      case 'esc':
        // Actions are focused - focus results.
        if (focusedView !== 'results') {
          this.props.onShowResults()
        // Reset the search if there is one.
        } else if (this.props.value.trim()) {
          this.props.onClearInput()
        } else {
          this.props.onAbort()
        }
        e.preventDefault()
        break
      case 'down':
        if (focusedView === 'services') this.props.onFocusService('next')
        else if (focusedView === 'actions') this.props.onFocusAction('next')
        else this.props.onFocusResult('next')
        e.preventDefault()
        break
      case 'up':
        if (focusedView === 'services') this.props.onFocusService('prev')
        else if (focusedView === 'actions') this.props.onFocusAction('prev')
        else this.props.onFocusResult('prev')
        e.preventDefault()
        break
      case 'enter':
        if (focusedView === 'services') this.onAddService(this.props.focusedService)
        else if (focusedView === 'actions') this.props.onExecAction()
        else this.props.onFocusActions()
        e.preventDefault()
        break
      case 'backspace':
        if (focusedView === 'actions') {
          this.props.onShowResults()
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
      this.props.onAddService(service)
    })
  }

  getBody() {
    const {
      height, results, search, intl: {formatMessage},
      onAddIntegration, focusedView, focusedResult,
      currServices, focusedService, onFocusService,
      servicesStats
    } = this.props

    if (focusedView === 'services') {
      const element = (
        <ServiceList
          servicesStats={servicesStats}
          services={currServices}
          focused={focusedService}
          onSelect={this.onAddService}
          onFocus={onFocusService}
        />
      )
      return {element, height}
    }

    if (results.length) {
      const element = (
        <Results
          focusedResult={focusedResult}
          search={search}
          focusedView={focusedView}
          data={results}
          onFocus={this.onFocusResult}
          onSelect={this.onSelectResult}
        />
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
      classes,
      height,
      onChangeInput,
      className,
      tokens, value
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
        tabIndex="-1"
      >
        <SearchInput
          value={value}
          tokens={tokens}
          onDidMount={this.onMountInput}
          onKeyDown={this.onKeyDown}
          onChange={onChangeInput}
          onBlur={this.onBlur}
        />
        {body.element}
        {this.props.isLoading && <Spinner overlay />}
      </div>
    )
  }
}
