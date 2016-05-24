import React, {PropTypes, Component} from 'react'
import ReactDOM from 'react-dom'
import {useSheet} from 'grape-web/lib/jss'
import isEmpty from 'lodash/lang/isEmpty'
import find from 'lodash/collection/find'
import findIndex from 'lodash/array/findIndex'
import capitalize from 'lodash/string/capitalize'
import get from 'lodash/object/get'
import pick from 'lodash/object/pick'
import noop from 'lodash/utility/noop'
import keyname from 'keyname'
import {shallowEqual} from 'react-pure-render'

import SearchBrowser from '../search-browser/SearchBrowserModalProvider'
import EmojiBrowser from '../emoji-browser/Browser'
import GrapeInput from '../grape-input/GrapeInput'
import Datalist from '../datalist/Datalist'
import * as mentions from '../mentions/mentions'
import {TYPES as QUERY_TYPES} from '../query/constants'
import QueryModel from '../query/Model'
import GlobalEvent from 'grape-web/lib/global-event/GlobalEvent'
import * as emoji from '../emoji'
import * as emojiSuggest from '../emoji-suggest'
import style from './style'
import * as utils from './utils'

const PUBLIC_METHODS = ['setTextContent', 'getTextContent']

// Map indicates whether browser has its own input field or
// its using the main one.
const browserWithInput = {
  search: true,
  emoji: true,
  emojiSuggest: false,
  user: false
}

/**
 * Uses all types of auto completes to provide end component.
 */
@useSheet(style)
export default class GrapeBrowser extends Component {
  static propTypes = {
    onDidMount: PropTypes.func,
    container: PropTypes.object,
    isLoading: PropTypes.bool,
    placeholder: PropTypes.string,
    setTrigger: PropTypes.bool,
    disabled: PropTypes.bool,
    sheet: PropTypes.object.isRequired,
    customEmojis: PropTypes.object,
    images: PropTypes.object,
    browser: PropTypes.oneOf(Object.keys(browserWithInput)),
    externalServicesInputDelay: PropTypes.number,
    services: PropTypes.array
  }

  static defaultProps = {
    // This attribute has been set by Modal component.
    // We need to set it to null to enable shallowEqual comparance in
    // componentWillReceiveProps, because this is the only new prop.
    ariaHidden: null,
    maxSuggestions: 12,
    externalServicesInputDelay: 150,
    browser: undefined,
    data: undefined,
    images: {},
    contentObjects: [],
    services: [],
    customEmojis: undefined,
    placeholder: undefined,
    focused: false,
    disabled: false,
    setTrigger: false,
    isLoading: false,
    onAbort: undefined,
    onEditPrevious: undefined,
    onSubmit: undefined,
    onAddSearchBrowserIntegration: noop,
    onInsertItem: noop,
    onDidMount: noop
  }

  constructor(props) {
    super(props)
    this.query = new QueryModel({onChange: ::this.onChangeQuery})
    this.exposePublicMethods()
    this.state = this.createState(props)
  }

  componentDidMount() {
    this.setTrigger(this.state.browser)
    this.props.onDidMount(this)
  }

  componentWillReceiveProps(nextProps) {
    // We need to do early return here because for "some reason?" this method
    // is called when inserting items from the search-browser. While
    // search-browser is closed, props still define it as open, which leads to
    // reopening of the search-browser by setState call below.
    // To avoid this we introduced temporarily shallowEqual, hopefully it can
    // go away after full migration to redux.
    if (shallowEqual(nextProps, this.props)) return

    const newEmojiSheet = get(nextProps, 'images.emojiSheet')
    const currEmojiSheet = get(this.props, 'images.emojiSheet')
    if (newEmojiSheet !== currEmojiSheet) {
      EmojiBrowser.init({
        emojiSheet: newEmojiSheet,
        customEmojis: nextProps.customEmojis
      })
    }
    this.setState(this.createState(nextProps))
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.browser !== this.state.browser && nextProps.setTrigger) {
      this.setTrigger(nextState.browser)
    }
  }

  onEditPrevious() {
    this.emit('editPrevious')
  }

  onSubmit(data) {
    clearTimeout(this.searchBrowserInputTimeoutId)
    this.query.reset()
    this.emit('submit', data)
  }

  onAbort(data = {}) {
    const {browser} = this.state
    this.closeBrowser({inputFocused: true}, () => {
      this.emit('abort', {...data, browser})
    })
  }

  onSelectSearchBrowserItem({item, query}) {
    clearTimeout(this.searchBrowserInputTimeoutId)
    this.insertItem(item, query)
  }

  onSelectEmojiBrowserItem({item, query}) {
    this.insertItem(item, query)
  }

  onSelectDatalistItem(item) {
    this.insertItem(item, this.query.toJSON())
  }

  onAddSearchBrowserIntegration() {
    this.closeBrowser(null, () => {
      this.emit('addIntegration')
    })
  }

  onInsertItem(item, query) {
    const {type} = item
    let {service} = item
    let rank = 0

    const results = get(this.state, 'data.results')
    if (!isEmpty(results)) {
      const index = findIndex(results, res => res.id === item.id)
      rank = index + 1
      service = results[index].service
    }

    clearTimeout(this.searchBrowserInputTimeoutId)
    this.emit('insertItem', {query, type, service, rank})
  }

  onDidMount(name, ref) {
    this[name] = ref
  }

  onKeyDown(e) {
    if (browserWithInput[this.state.browser] === false) {
      this.navigateDatalist(e)
    }
  }

  onBlurInput() {
    // Delay blur event for the case when an external button was clicked,
    // because we are going to regain focus in a bit.
    setTimeout(() => {
      if (browserWithInput[this.state.browser] === false) {
        this.emit('blur')
      }
    }, 100)
  }

  onFocusInput() {
    this.emit('focus')
  }

  onBlurBrowser() {
    // We don't want to close browser when entire window looses the focus.
    this.blurTimeoutId = setTimeout(() => {
      this.closeBrowser()
    }, 100)
  }

  onBlurWindow() {
    clearTimeout(this.blurTimeoutId)
  }

  onChangeSearchBrowser(data) {
    const complete = () => {
      this.emit('complete', {...data, trigger: this.query.get('trigger')})
      this.emit('change')
    }

    if (!utils.isExternalSearch(this.state.data)) return complete()

    clearTimeout(this.searchBrowserInputTimeoutId)
    this.searchBrowserInputTimeoutId = setTimeout(
      complete,
      this.props.externalServicesInputDelay
    )
  }

  onInputResize() {
    this.emit('resize')
  }

  onLoadServices() {
    this.emit('loadServices')
  }

  onLoadServicesResultsAmounts(search, callback) {
    this.emit('loadServicesResultsAmounts', {search, callback})
  }

  onChangeInput({query, content} = {}) {
    // Handler might be called when content has been just set, so it is changed
    // for the underlying component but not here.
    const contentHasChanged = content !== this.state.content
    const isBrowserOpened = Boolean(this.state.browser)
    const hasTrigger = Boolean(query && query.trigger)

    clearTimeout(this.searchBrowserInputTimeoutId)

    if (hasTrigger && contentHasChanged) {
      this.query.set(query, {silent: true})
      this.emit('complete', {...this.query.toJSON(), emoji})
    }

    // Query has been removed or caret position changed, for datalist only.
    if (!hasTrigger && !this.query.isEmpty()) {
      this.query.reset()
      if (isBrowserOpened) this.onAbort({reason: 'deleteTrigger'})
    }

    if (content === undefined) this.emit('change')
    else this.setState({content}, () => this.emit('change'))
  }

  onChangeQuery(str) {
    this.editable.insert(str)
  }

  setTrigger(browser) {
    if (!browser) return

    this.query.set('trigger', QUERY_TYPES[browser])
  }

  getTextContent() {
    return this.state.content
  }

  setTextContent(content, options = {}) {
    this.query.reset()
    this.setState({content}, () => {
      if (!options.silent) this.onChangeInput()
    })
  }

  exposePublicMethods() {
    const {container} = this.props
    if (!container) return
    PUBLIC_METHODS.forEach(method => container[method] = ::this[method])
  }

  createState(nextProps) {
    const state = pick(nextProps, 'browser', 'data', 'isLoading')

    if (state.browser === 'user') {
      state.data = mentions
        .map(state.data)
        .slice(0, nextProps.maxSuggestions)
    }
    if (state.browser === 'emojiSuggest') {
      state.data = emojiSuggest
        .sortByRankAndLength(state.data)
        .slice(0, nextProps.maxSuggestions)
    }
    state.query = this.query.toJSON()

    const canShowBrowser = utils.canShowBrowser(this.state, state)

    if (canShowBrowser) {
      state.browserOpened = true
    } else {
      state.browser = null
      state.browserOpened = false
    }

    if (!this.state) {
      state.content = ''
    }

    state.inputFocused = false
    if (nextProps.focused) {
      state.inputFocused = true

      if (state.browserOpened) {
        state.inputFocused = !browserWithInput[state.browser]
      }
    }

    return state
  }

  closeBrowser(state, callback) {
    this.setState({
      browser: null,
      browserOpened: false,
      ...state
    }, callback)
  }

  /**
   * Keyboard navigation for the datalist (mention, emojiSuggest).
   */
  navigateDatalist(e) {
    const {datalist} = this
    if (!datalist) return

    switch (keyname(e.keyCode)) {
      case 'down':
      case 'tab':
        datalist.focus('next')
        e.preventDefault()
        break
      case 'up':
        datalist.focus('prev')
        e.preventDefault()
        break
      case 'enter':
        this.insertItem(datalist.state.focused)
        e.preventDefault()
        break
      default:
    }
  }

  insertItem(item, query) {
    if (item) {
      const results = get(this.state, 'data.results')
      const result = find(results, res => res.id === item.id) || item
      this.editable.replace(result)
    }
    this.onInsertItem(item, query)
    this.closeBrowser({inputFocused: true})
    this.query.reset()
  }

  /**
   * Emit DOM event.
   */
  emit(type, data) {
    const capType = capitalize(type)
    let name = `grape${capType}`
    const event = new CustomEvent(name, {
      bubbles: true,
      cancelable: true,
      detail: data
    })
    ReactDOM.findDOMNode(this).dispatchEvent(event)
    name = `on${capType}`
    const callback = this.props[name]
    if (callback) callback(data)
  }

  renderBrowser() {
    const {browser, browserOpened, data} = this.state
    if (!browser || !browserOpened) return null

    const {classes} = this.props.sheet
    const {images} = this.props

    if (browser === 'search') {
      return (
        <SearchBrowser
          data={data}
          services={this.props.services}
          images={images}
          isExternal={utils.isExternalSearch(data)}
          isLoading={this.props.isLoading}
          onAbort={::this.onAbort}
          onSelectItem={::this.onSelectSearchBrowserItem}
          onAddIntegration={::this.onAddSearchBrowserIntegration}
          onChange={::this.onChangeSearchBrowser}
          onLoadServices={::this.onLoadServices}
          onLoadResultsAmounts={::this.onLoadServicesResultsAmounts}
          onDidMount={this.onDidMount.bind(this, 'browser')} />
      )
    }

    if (browser === 'emoji') {
      return (
        <EmojiBrowser
          images={images}
          className={classes.browser}
          customEmojis={this.props.customEmojis}
          onAbort={::this.onAbort}
          onSelectItem={::this.onSelectEmojiBrowserItem}
          onBlur={::this.onBlurBrowser}
          onDidMount={this.onDidMount.bind(this, 'browser')} />
      )
    }

    return (
      <Datalist
        className={classes.browser}
        images={images}
        data={data}
        onSelect={::this.onSelectDatalistItem}
        onDidMount={this.onDidMount.bind(this, 'datalist')} />
    )
  }

  render() {
    const {classes} = this.props.sheet

    return (
      <div
        className={classes.grapeBrowser}
        data-test="grape-browser">
        <GlobalEvent event="blur" handler={::this.onBlurWindow} />
        {this.renderBrowser()}
        <div className={classes.scroll}>
          <GrapeInput
            onKeyDown={::this.onKeyDown}
            onAbort={::this.onAbort}
            onResize={::this.onInputResize}
            onChange={::this.onChangeInput}
            onBlur={::this.onBlurInput}
            onFocus={::this.onFocusInput}
            onSubmit={::this.onSubmit}
            onEditPrevious={::this.onEditPrevious}
            onDidMount={this.onDidMount.bind(this, 'editable')}
            placeholder={this.props.placeholder}
            disabled={this.props.disabled}
            focused={this.state.inputFocused}
            content={this.state.content} />
        </div>
      </div>
    )
  }
}
