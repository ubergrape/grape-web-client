import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import keyname from 'keyname'
import Spinner from 'grape-web/lib/components/spinner'
import { debouncingTime } from 'grape-web/lib/constants/time'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/noop'
import find from 'lodash/find'
import debounce from 'lodash/debounce'
import { defineMessages, intlShape, injectIntl } from 'react-intl'

import style from './searchBrowserStyle'
import Results from './results/Results'
import SearchInput from './search-input/SearchInput'
import ServiceList from './service-list/ServiceList'
import Info from './info/Info'
import { listTypes } from './constants'
import Empty from '../empty/Empty'
import { SERVICES_TRIGGER, QUERY_REGEX } from '../../components/query/constants'

const messages = defineMessages({
  empty: {
    id: 'noResults',
    defaultMessage: 'No Results.',
  },
})

/**
 * Main search browser component.
 */
class SearchBrowser extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    results: PropTypes.array,
    servicesStats: PropTypes.object,
    // List of service id's.
    services: PropTypes.array,
    // Filtered services.
    currServices: PropTypes.array,
    /* eslint-disable react/no-unused-prop-types */
    filters: PropTypes.array,
    /* eslint-enable react/no-unused-prop-types */
    isLoading: PropTypes.bool,
    height: PropTypes.number,
    className: PropTypes.string,
    tokens: PropTypes.object,
    // Entire input value including filters.
    value: PropTypes.string,
    // Only user input without filters.
    search: PropTypes.string,
    focusedView: PropTypes.oneOf(listTypes),
    focusedResult: PropTypes.object,
    focusedService: PropTypes.object,
    actions: PropTypes.array,
    focusedAction: PropTypes.object,
    hoveredAction: PropTypes.object,
    data: PropTypes.object,
    onUpdateResults: PropTypes.func,
    onBlurAction: PropTypes.func,
    onDidMount: PropTypes.func,
    onAbort: PropTypes.func,
    onBlur: PropTypes.func,
    onAddIntegration: PropTypes.func,
    onLoadServices: PropTypes.func,
    onLoadServicesStats: PropTypes.func,
    onShowResults: PropTypes.func,
    onFocusResult: PropTypes.func,
    onSelectResult: PropTypes.func,
    onFocusService: PropTypes.func,
    onAddFilter: PropTypes.func,
    onReset: PropTypes.func,
    onFocusActions: PropTypes.func,
    onFocusAction: PropTypes.func,
    onExecAction: PropTypes.func,
    onChange: PropTypes.func,
    onShowServices: PropTypes.func,
    onUpdateInput: PropTypes.func,
    onSelectItem: PropTypes.func,
    goTo: PropTypes.func,
  }

  static defaultProps = {
    actions: undefined,
    focusedAction: undefined,
    hoveredAction: undefined,
    results: [],
    servicesStats: undefined,
    services: [],
    currServices: [],
    filters: [],
    tokens: undefined,
    focusedView: 'results',
    focusedResult: undefined,
    focusedService: undefined,
    isLoading: undefined,
    value: '',
    search: '',
    className: '',
    height: 400,
    data: {
      search: {},
      results: [],
      services: [],
    },
    onUpdateResults: noop,
    onBlurAction: noop,
    onDidMount: noop,
    onAbort: noop,
    onBlur: noop,
    onAddIntegration: noop,
    onLoadServices: noop,
    onShowResults: noop,
    onFocusResult: noop,
    onSelectResult: noop,
    onFocusService: noop,
    onAddFilter: noop,
    onReset: noop,
    onFocusActions: noop,
    onFocusAction: noop,
    onExecAction: noop,
    onChange: noop,
    onShowServices: noop,
    onUpdateInput: noop,
    onLoadServicesStats: noop,
    onSelectItem: noop,
    goTo: noop,
  }

  state = {}

  componentDidMount() {
    const { data, onDidMount, onLoadServices } = this.props
    onDidMount(this)
    onLoadServices()
    this.onUpdateResults(data)
  }

  componentWillReceiveProps(nextProps) {
    const { data, services } = nextProps
    const { onShowServices, onLoadServicesStats } = this.props
    const { query, search } = this.state
    const service = this.state.lastAddedService

    if ((data && data.results !== this.props.data.results) || service)
      this.onUpdateResults(data, service)
    if (services !== this.props.services && query && query.trigger === '+') {
      onShowServices({ query, services })
      onLoadServicesStats({ search: search.replace(QUERY_REGEX, '') })
    }

    if (service && nextProps.filters.indexOf(service.id) >= 0) {
      this.setState({ lastAddedService: null })
      this.input.replace(service.label)
    }
  }

  onUpdateResults(data, service) {
    const { onUpdateResults, search } = this.props

    if (
      data &&
      // Only update if search empty, like on initial mount. Or if service
      // already picked and search field is empty, and service equals `null`.
      (search || (search === '' && service === null)) &&
      // Only update results when the results have been returned for the
      // current search state.
      // This will avoid unneded rerendering when:
      // 1. Input has been modified faster that we received results
      // 2. Results for a previous search came in later the for the current.
      data.search.text === search
    ) {
      onUpdateResults(data)
    }
  }

  onFocusResult = result => {
    if (this.props.focusedResult === result) return
    this.props.onFocusResult(result)
  }

  onSelectResult = result => {
    this.props.onSelectResult(result)
  }

  onKeyDown = e => {
    const { focusedView } = this.props

    switch (keyname(e.keyCode)) {
      case 'esc':
        // Actions are focused - focus results.
        if (focusedView !== 'results') {
          this.props.onShowResults()
          // Reset the search if there is one.
        } else if (this.props.value.trim()) {
          this.props.onReset()
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
        if (focusedView === 'services')
          this.onAddFilter(this.props.focusedService)
        else if (focusedView === 'actions') this.onExecAction()
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

  onMouseDown = e => {
    // This flag is to fix IE11 issue
    // http://stackoverflow.com/questions/2023779/clicking-on-a-divs-scroll-bar-fires-the-blur-event-in-i-e
    this.blurPrevented = true

    // Avoids loosing focus and though caret position in input.
    if (e.target.nodeName !== 'INPUT') e.preventDefault()
  }

  onBlur = e => {
    if (!this.blurPrevented) {
      this.props.onBlur(e)
      return
    }

    this.blurPrevented = false
    e.target.focus()
  }

  onMountInput = ref => {
    this.input = ref
  }

  onAddFilter = service => {
    if (!service) return
    // We need to schedule the filter insertion into input until the action is
    // created and applied to the state, because as soon as we insert the filter
    // into the input, change event will trigger the search and before this,
    // state needs to have all the data in place.
    this.setState({ lastAddedService: service }, () => {
      this.props.onAddFilter(service)
    })
  }

  onChange = ({ value, search, filters, query }) => {
    const { onUpdateInput, onReset } = this.props
    if (!value) {
      onReset()
    }
    this.onChangeInput({ search, filters, query })
    onUpdateInput({ value, search, filters })
  }

  onChangeInput = debounce(({ search, filters, query }) => {
    const {
      onChange,
      onShowServices,
      onShowResults,
      onLoadServicesStats,
      services,
    } = this.props

    this.setState({ search, query })
    if (query.trigger === SERVICES_TRIGGER) {
      onShowServices({ query, services })
      onLoadServicesStats({ search: search.replace(QUERY_REGEX, '') })
    } else if (search) {
      onShowResults()
    }
    onChange({
      search,
      filters: filters.map(filter => find(services, { id: filter }).key),
    })
  }, debouncingTime)

  onExecAction = () => {
    const {
      onExecAction,
      onReset,
      onSelectItem,
      focusedResult: result,
      focusedAction: action,
      goTo,
    } = this.props

    onExecAction({ result, action }, goTo)

    if (action.type === 'insert') {
      onReset()
      onSelectItem({ item: result })
    }
  }

  getBody() {
    const {
      height,
      results,
      search,
      intl: { formatMessage },
      onAddIntegration,
      focusedView,
      focusedResult,
      currServices,
      focusedService,
      onFocusService,
      servicesStats,
      isLoading,
      actions,
      focusedAction,
      hoveredAction,
      onFocusAction,
      onBlurAction,
      data,
    } = this.props

    if (focusedView === 'services') {
      const element = (
        <ServiceList
          servicesStats={servicesStats}
          services={currServices}
          focused={focusedService}
          onSelect={this.onAddFilter}
          onFocus={onFocusService}
        />
      )
      return { element, height }
    }

    if (results.length) {
      const element = (
        <Results
          focusedResult={focusedResult}
          search={search}
          focusedView={focusedView}
          data={results}
          actions={actions}
          focusedAction={focusedAction}
          hoveredAction={hoveredAction}
          onExecAction={this.onExecAction}
          onFocusAction={onFocusAction}
          onBlurAction={onBlurAction}
          onFocus={this.onFocusResult}
          onSelect={this.onSelectResult}
        />
      )
      return { element, height }
    }

    if (!isLoading && data.search.text && search) {
      return {
        element: <Empty text={formatMessage(messages.empty)} />,
        height: 'auto',
      }
    }

    return {
      element: <Info onAddIntegration={onAddIntegration} />,
      height: 'auto',
    }
  }

  render() {
    const { classes, height, className, tokens, value } = this.props
    const body = this.getBody()

    return (
      <div
        className={`${classes.browser} ${className}`}
        // Set a fixed height when we have search results, otherwise height should
        // be auto detected.
        style={{
          height: body.height,
          maxHeight: height,
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
          onChange={this.onChange}
          onBlur={this.onBlur}
        />
        {body.element}
        {this.props.isLoading && <Spinner overlay />}
      </div>
    )
  }
}

export default injectSheet(style)(injectIntl(SearchBrowser))
