import React, {PropTypes, Component} from 'react'
import ReactDOM from 'react-dom'
import {useSheet} from 'grape-web/lib/jss'
import isArray from 'lodash/lang/isArray'
import isEmpty from 'lodash/lang/isEmpty'
import filter from 'lodash/collection/filter'
import find from 'lodash/collection/find'
import findIndex from 'lodash/array/findIndex'
import capitalize from 'lodash/string/capitalize'
import get from 'lodash/object/get'
import pick from 'lodash/object/pick'
import noop from 'lodash/utility/noop'
import keyname from 'keyname'
import {shouldPureComponentUpdate} from 'react-pure-render'

import SearchBrowser from '../search-browser/Browser'
import EmojiBrowser from '../emoji-browser/Browser'
import * as objectStyle from '../objects/style'
import * as objects from '../objects'
import HighlightedTextarea from '../highlighted-textarea/HighlightedTextarea'
import MaxSize from '../max-size/MaxSize'
import Datalist from '../datalist/Datalist'
import * as mentions from '../mentions/mentions'
import {TYPES as QUERY_TYPES} from '../query/constants'
import QueryModel from '../query/Model'
import GlobalEvent from '../global-event/GlobalEvent'
import style from './style'
import * as utils from './utils'

const PUBLIC_METHODS = ['setTextContent', 'getTextContent']

/**
 * Uses all types of auto completes to provide end component.
 */
@useSheet(style)
export default class Input extends Component {
  static propTypes = {
    onDidMount: PropTypes.func.isRequired,
    container: PropTypes.object,
    isLoading: PropTypes.bool,
    hasIntegrations: PropTypes.bool,
    canAddIntegrations: PropTypes.bool,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    sheet: PropTypes.object.isRequired,
    customEmojis: PropTypes.object,
    images: PropTypes.object
  }

  static defaultProps = {
    maxCompleteItems: 12,
    browser: undefined,
    data: undefined,
    images: {},
    contentObjects: [],
    customEmojis: undefined,
    placeholder: undefined,
    focused: false,
    disabled: false,
    hasIntegrations: false,
    canAddIntegrations: true,
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
    this.state = this.createState(this.props)
  }

  componentDidMount() {
    objectStyle.sheet.attach()
    this.setTrigger(this.state.browser)
    const {onDidMount} = this.props
    if (onDidMount) onDidMount(this)
  }

  componentWillReceiveProps(nextProps) {
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

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillUpdate(nextProps, nextState) {
    if (nextState.browser !== this.state.browser) {
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
    const currentBrowser = this.state.browser
    this.closeBrowser({textareaFocused: true}, () => {
      this.emit('abort', {...data, browser: currentBrowser})
    })
  }

  onSelectSearchBrowserItem({item, query}) {
    this.insertItem(item, query)
  }

  onSelectSearchBrowserFilter(query) {
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

    this.emit('insertItem', {query, type, service, rank})
  }

  onDidMount(name, ref) {
    this[name] = ref
  }

  onKeyDown(e) {
    switch (this.state.browser) {
      case 'user':
        this.navigateDatalist(e)
        break
      default:
    }
  }

  onBlurBrowser() {
    this.blurTimeoutId = setTimeout(() => {
      this.closeBrowser()
    }, 50)
  }

  onBlurWindow() {
    clearTimeout(this.blurTimeoutId)
  }

  onChangeQuery(newQueryStr) {
    this.textarea.insertQueryString(newQueryStr)
  }

  onInputSearchBrowser(data) {
    this.emit('complete', data)
    this.emit('change')
  }

  onInputResize() {
    this.emit('resize')
  }

  onChangeInput(query = {}) {
    if (query) {
      // If it is a browser trigger, we don't reopen browser, but let user type
      // whatever he wants.
      // If its a mentioning, user types the search.
      // TODO migrate mentioning to the browser.
      if (!query.key || !utils.isBrowserType(query.trigger)) {
        this.query.set(query, {silent: true})
        this.emit('complete', this.query.toJSON())
      }
    } else if (!this.query.isEmpty()) { // Query has been removed or caret position changed, for datalist only.
      this.query.reset()
      if (this.state.browser) this.onAbort({reason: 'deleteTrigger'})
    }
    this.emit('change')
  }

  setTrigger(browser) {
    if (!browser) return
    this.query.set('trigger', QUERY_TYPES[browser])
  }

  getTextContent() {
    return this.textarea ? this.textarea.getTextWithMarkdown() : ''
  }

  setTextContent(text, options) {
    this.query.reset()
    this.textarea.setTextContent(text, options)
  }

  exposePublicMethods() {
    const {container} = this.props
    if (!container) return
    PUBLIC_METHODS.forEach(method => container[method] = ::this[method])
  }

  createState(nextProps) {
    const state = pick(nextProps, 'browser', 'data', 'isLoading')
    state.textareaFocused = nextProps.focused
    if (state.browser === 'user') state.data = mentions.map(state.data)
    if (isArray(state.data)) state.data = state.data.slice(0, nextProps.maxCompleteItems)
    state.query = this.query.toJSON()
    const canShowBrowser = utils.canShowBrowser(this.state, state)
    if (!canShowBrowser) state.browser = null
    state.browserOpened = this.state ? this.state.browserOpened : false
    if (canShowBrowser) state.browserOpened = true
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
      this.setState({ contentObjects: [...this.state.contentObjects, object] })
      this.replaceQuery(object)
    }
    this.onInsertItem(item, query)
    this.closeBrowser({textareaFocused: true})
    this.query.reset()
  }

  replaceQuery(replacement) {
    this.setState({textareaFocused: true})
    this.textarea.replaceQuery(replacement)
  }

  insertQuery() {
    this.setState({textareaFocused: true})
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

  renderBrowser(options) {
    const {browser, browserOpened, data} = this.state

    if (!browser || !browserOpened) return null

    if (browser === 'search') {
      return (
        <SearchBrowser
          {...options}
          data={data}
          isLoading={this.props.isLoading}
          hasIntegrations={this.props.hasIntegrations}
          canAddIntegrations={this.props.canAddIntegrations}
          onAbort={::this.onAbort}
          onSelectItem={::this.onSelectSearchBrowserItem}
          onSelectFilter={::this.onSelectSearchBrowserFilter}
          onAddIntegration={::this.onAddSearchBrowserIntegration}
          onInput={::this.onInputSearchBrowser}
          onBlur={::this.onBlurBrowser}
          onDidMount={this.onDidMount.bind(this, 'browser')} />
      )
    }

    if (browser === 'emoji') {
      return (
        <EmojiBrowser
          {...options}
          customEmojis={this.props.customEmojis}
          onAbort={::this.onAbort}
          onSelectItem={::this.onSelectEmojiBrowserItem}
          onBlur={::this.onBlurBrowser}
          onDidMount={this.onDidMount.bind(this, 'browser')} />
      )
    }

    return (
      <Datalist
        {...options}
        data={data}
        onSelect={::this.onSelectDatalistItem}
        onDidMount={this.onDidMount.bind(this, 'datalist')} />
    )
  }

  render() {
    const {classes} = this.props.sheet
    const {data} = this.state
    const isExternal = utils.isExternalSearch(data)
    const browser = this.renderBrowser({
      isExternal: isExternal,
      className: classes.browser,
      images: this.props.images
    })

    return (
      <div
        onKeyDown={::this.onKeyDown}
        className={classes.input}
        data-test="grape-input">
        <GlobalEvent event="blur" handler={::this.onBlurWindow} />
        <div className={classes.completeWrapper} data-test="complete-wrapper">
          {browser}
        </div>
        <MaxSize
          onResize={::this.onInputResize}>
          <HighlightedTextarea
            onAbort={::this.onAbort}
            onResize={::this.onInputResize}
            onChange={::this.onChangeInput}
            onSubmit={::this.onSubmit}
            onEditPrevious={::this.onEditPrevious}
            onDidMount={this.onDidMount.bind(this, 'textarea')}
            preventSubmit={Boolean(this.state.browser)}
            placeholder={this.props.placeholder}
            disabled={this.props.disabled}
            focused={this.state.textareaFocused}
            content={this.getTextContent()}/>
        </MaxSize>
      </div>
    )
  }
}
