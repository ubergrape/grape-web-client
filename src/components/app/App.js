import React, {PropTypes, Component} from 'react'
import ReactDOM from 'react-dom'
import {useSheet} from 'grape-web/lib/jss'
import isEmpty from 'lodash/lang/isEmpty'
import filter from 'lodash/collection/filter'
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
import * as objectStyle from '../objects/style'
import * as objects from '../objects'
import GrapeInput from '../grape-input/GrapeInput'
import Datalist from '../datalist/Datalist'
import * as mentions from '../mentions/mentions'
import {TYPES as QUERY_TYPES} from '../query/constants'
import QueryModel from '../query/Model'
import GlobalEvent from '../global-event/GlobalEvent'
import * as emoji from '../emoji'
import style from './style'
import * as utils from './utils'

const PUBLIC_METHODS = ['setTextContent', 'getTextContent']

// Map indicates whether browser has its own input field or
// its using the main one.
const browserHasInput = {
  search: true,
  emoji: true,
  emojiSuggest: false,
  user: false
}

/**
 * Uses all types of auto completes to provide end component.
 */
@useSheet(style)
export default class App extends Component {
  static propTypes = {
    onDidMount: PropTypes.func,
    container: PropTypes.object,
    isLoading: PropTypes.bool,
    hasIntegrations: PropTypes.bool,
    canAddIntegrations: PropTypes.bool,
    placeholder: PropTypes.string,
    ignoreSuggest: PropTypes.bool,
    setTrigger: PropTypes.bool,
    disabled: PropTypes.bool,
    sheet: PropTypes.object.isRequired,
    customEmojis: PropTypes.object,
    images: PropTypes.object,
    browser: PropTypes.oneOf(Object.keys(browserHasInput)),
    externalServicesInputDelay: PropTypes.number
  }

  static defaultProps = {
    // This attribute has been set by Modal component.
    // We need to set it to null to enable shallowEqual comparance in
    // componentWillReceiveProps, because this is the only new prop.
    ariaHidden: null,
    maxCompleteItems: 12,
    externalServicesInputDelay: 150,
    browser: undefined,
    data: undefined,
    images: {},
    contentObjects: [],
    customEmojis: undefined,
    placeholder: undefined,
    focused: false,
    disabled: false,
    ignoreSuggest: false,
    hasIntegrations: false,
    canAddIntegrations: true,
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
    objectStyle.sheet.attach()
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

    const {ignoreSuggest} = this.state
    const isEmojiSuggest = nextProps.browser === 'emojiSuggest'
    if (ignoreSuggest && isEmojiSuggest) {
      this.setState({ignoreSuggest: false})
      return
    }

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

  componentWillUnmount() {
    objectStyle.sheet.detach()
  }

  onEditPrevious() {
    this.emit('editPrevious')
  }

  onSubmit(data) {
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

  onSelectSearchBrowserFilter(query) {
    clearTimeout(this.searchBrowserInputTimeoutId)
    this.emit('selectFilter', query)
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
      const resultsWithoutFilters = filter(results, res => res.type !== 'filters')
      const index = findIndex(resultsWithoutFilters, res => res.id === item.id)
      rank = index + 1
      service = resultsWithoutFilters[index].service
    }

    clearTimeout(this.searchBrowserInputTimeoutId)
    this.emit('insertItem', {query, type, service, rank})
  }

  onDidMount(name, ref) {
    this[name] = ref
  }

  onKeyDown(e) {
    if (!browserHasInput[this.state.browser]) {
      this.navigateDatalist(e)
    }
  }

  onBlurInput() {
    setTimeout(() => {
      if (!browserHasInput[this.state.browser]) {
        this.emit('blur')
      }
    }, 100)
  }

  onFocusInput() {
    this.emit('focus')
  }

  onBlurBrowser() {
    this.blurTimeoutId = setTimeout(() => {
      this.closeBrowser()
    }, 100)
  }

  onBlurWindow() {
    clearTimeout(this.blurTimeoutId)
  }

  onInputSearchBrowser(query) {
    const complete = () => {
      this.emit('complete', query)
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

  onChangeInput({query, content} = {}) {
    clearTimeout(this.searchBrowserInputTimeoutId)
    if (query) {
      // If it is a browser trigger, we don't reopen browser, but let user type
      // whatever he wants.
      // If its a mentioning, user types the search.
      // TODO migrate mentioning to the browser.
      if (!query.key || !utils.isBrowserType(query.trigger)) {
        this.query.set(query, {silent: true})
        this.emit('complete', {...this.query.toJSON(), emoji})
      }
    } else if (!this.query.isEmpty()) { // Query has been removed or caret position changed, for datalist only.
      this.query.reset()
      if (this.state.browser) this.onAbort({reason: 'deleteTrigger'})
    }

    if (content !== undefined) this.setState({content})
    this.emit('change')
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
    const state = pick(nextProps, 'browser', 'data', 'isLoading', 'ignoreSuggest')

    if (state.browser === 'user') {
      state.data = mentions
        .map(state.data)
        .slice(0, nextProps.maxCompleteItems)
    }
    if (state.browser === 'emojiSuggest') {
      state.data = emoji.sortByRankAndLength(state.data)
        .slice(0, nextProps.maxCompleteItems)
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
        state.inputFocused = !browserHasInput[state.browser]
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
   * Keyboard navigation for the datalist (mention, emoji).
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
      const data = find(results, res => res.id === item.id) || item
      const object = objects.create(data.type, data)
      this.setState({contentObjects: [...this.state.contentObjects, object]})
      this.replaceToken(object)
    }
    this.onInsertItem(item, query)
    this.closeBrowser({inputFocused: true})
    this.query.reset()
  }

  replaceToken(object) {
    this.setState({inputFocused: true}, () => {
      this.editable.replaceToken(object)
    })
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
          images={images}
          isExternal={utils.isExternalSearch(data)}
          isLoading={this.props.isLoading}
          hasIntegrations={this.props.hasIntegrations}
          canAddIntegrations={this.props.canAddIntegrations}
          onAbort={::this.onAbort}
          onSelectItem={::this.onSelectSearchBrowserItem}
          onSelectFilter={::this.onSelectSearchBrowserFilter}
          onAddIntegration={::this.onAddSearchBrowserIntegration}
          onInput={::this.onInputSearchBrowser}
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
        className={classes.input}
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
