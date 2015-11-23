import React, {Component} from 'react'
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
import Editable from '../editable/Editable'
import Textarea from '../textarea/Textarea'
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
 * Uses all types of auto completes and content editable to provide end component.
 */
@useSheet(style)
export default class Input extends Component {
  static defaultProps = {
    maxCompleteItems: 12,
    browser: undefined,
    data: undefined,
    images: {},
    content: '',
    contentObjects: [],
    specialObjectKey: '%%GRAPE_SPECIAL_OBJECT%%',
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
    onComplete: undefined,
    onChange: undefined,
    onAddSearchBrowserIntegration: noop,
    onFilterSelect: noop,
    onInsertItem: noop,
    onFocus: noop,
    onBlur: noop,
    onResize: noop,
    onDidMount: noop
  }

  constructor(props) {
    super(props)
    this.query = new QueryModel({onChange: ::this.onChangeQuery})
    this.exposePublicMethods()
    this.state = this.createState(this.props)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillReceiveProps(nextProps) {
    let newEmojiSheet = get(nextProps, 'images.emojiSheet')
    let currEmojiSheet = get(this.props, 'images.emojiSheet')
    if (newEmojiSheet !== currEmojiSheet) {
      EmojiBrowser.init({
        emojiSheet: newEmojiSheet,
        customEmojis: nextProps.customEmojis
      })
    }

    this.setState(this.createState(nextProps))
  }

  componentDidMount() {
    objectStyle.sheet.attach()
    this.setTrigger(this.state.browser)
    let {onDidMount} = this.props
    if (onDidMount) onDidMount(this)
  }

  componentWillUnmount() {
    objectStyle.sheet.detach()
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.browser !== this.state.browser) {
      this.setTrigger(nextState.browser)
    }
  }

  setTrigger(browser) {
    if (!browser) return
    this.query.set('trigger', QUERY_TYPES[browser])
  }

  render() {
    let {classes} = this.props.sheet
    let {data} = this.state
    let isExternal = utils.isExternalSearch(data)
    let browser = this.renderBrowser({
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
          innerWidth={this.state.editableWidth}
          innerHeight={this.state.editableHeight}
          onResize={::this.onInputResize}>
          <Textarea
            onChange={::this.onChangeInput}
            placeholder={this.props.placeholder}
            disabled={this.props.disabled}
            focused={this.state.editableFocused}
            onDidMount={this.onDidMount.bind(this, 'textarea')}
            content={this.getTextContent()}/>
        </MaxSize>

      </div>
    )
  }

  renderBrowser(options) {
    let {browser, browserOpened, data} = this.state

    if (!browser || !browserOpened) return null

    if (browser === 'search') {
      return (
        <SearchBrowser
          {...options}
          data={data}
          isLoading={this.props.isLoading}
          hasIntegrations={this.props.hasIntegrations}
          canAddIntegrations={this.props.canAddIntegrations}
          onSelectItem={::this.onSelectSearchBrowserItem}
          onSelectFilter={::this.onSelectSearchBrowserFilter}
          onAddIntegration={::this.onAddSearchBrowserIntegration}
          onInput={::this.onInputSearchBrowser}
          onAbort={::this.onAbort}
          onBlur={::this.onBlurBrowser}
          onDidMount={this.onDidMount.bind(this, 'browser')} />
      )
    }

    if (browser === 'emoji') {
      return (
        <EmojiBrowser
          {...options}
          customEmojis={this.props.customEmojis}
          onSelectItem={::this.onSelectEmojiBrowserItem}
          onBlur={::this.onBlurBrowser}
          onAbort={::this.onAbort}
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

  createState(nextProps) {
    let state = pick(nextProps, 'browser', 'data', 'isLoading')
    state.editableFocused = nextProps.focused
    if (state.browser === 'user') state.data = mentions.map(state.data)
    if (isArray(state.data)) state.data = state.data.slice(0, nextProps.maxCompleteItems)
    state.query = this.query.toJSON()
    let canShowBrowser = utils.canShowBrowser(this.state, state)
    if (!canShowBrowser) state.browser = null
    state.browserOpened = this.state ? this.state.browserOpened : false
    if (canShowBrowser && state.query.trigger) {
      state.browserOpened = true
    }

    return state
  }

  exposePublicMethods() {
    let {container} = this.props
    if (!container) return
    PUBLIC_METHODS.forEach(method => container[method] = ::this[method])
  }

  getTextContent() {
    return ''
    // return this.state.
    //return this.textarea.getTextContent()
  }

  setTextContent(text) {
    this.query.reset()
    return this.editable.setTextContent(text)
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
    let {datalist} = this
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
      let results = get(this.state, 'data.results')
      let data = find(results, res => res.id === item.id) || item
      let object = objects.create(data.type, data)
      this.setState({ contentObjects: [...this.state.contentObjects, object] })
      this.replaceQuery(object)
    }
    this.onInsertItem(item, query)
    this.closeBrowser({editableFocused: true})
    this.query.reset()
  }

  replaceQuery(replacement, options, callback = noop) {
    this.setState({editableFocused: true}, () => {
      let replaced = this.textarea.replaceQuery(replacement)
      callback(replaced)
    })

  }

  insertQuery(queryStr, options, callback = noop) {
    this.setState({editableFocused: true}, () => {
      let inserted = this.editable.modifyAtCaret((left, right) => {
        let newLeft = left
        // Add space after text if there is no.
        if (newLeft[newLeft.length - 1] !== ' ') newLeft += ' '
        newLeft += queryStr
        return [newLeft, right]
      }, {...options, query: this.query.toJSON()})
      callback(inserted)
    })
  }

  /**
   * Emit DOM event.
   */
  emit(type, data) {
    let capType = capitalize(type)
    let name = `grape${capType}`
    let event = new CustomEvent(name, {
      bubbles: true,
      cancelable: true,
      detail: data
    })
    ReactDOM.findDOMNode(this).dispatchEvent(event)
    name = `on${capType}`
    let callback = this.props[name]
    if (callback) callback(data)
  }

  onAbort(data = {}) {
    this.closeBrowser({editableFocused: true}, () => {
      this.emit('abort', {...data, browser: this.state.browser})
    })
  }

  onEditPrevious() {
    this.emit('editPrevious')
  }

  onSubmit(data) {
    this.query.reset()
    this.emit('submit', data)
  }

  onChangeInput(query = {}) {

    if (query) {
      // If it is a browser trigger, we don't reopen browser, but let user type
      // whatever he wants.
      // If its a mentioning, user types the search.
      // TODO migrate mentioning to the browser.
      if (!query.key || !utils.isBrowserType(query.trigger)) {
        let changed = this.query.set(query, {silent: true})
        if (changed) this.emit('complete', this.query.toJSON())
      }
    }
    // Query has been removed or caret position changed, for datalist only.
    else if (!this.query.isEmpty()) {
      this.query.reset()
      this.onAbort({reason: 'deleteTrigger'})
    }
    this.emit('change')
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
    let {type, service} = item
    let rank = 0

    let results = get(this.state, 'data.results')
    if (!isEmpty(results)) {
      let resultsWithoutFilters = filter(results, res => res.type !== 'filters')
      let index = findIndex(resultsWithoutFilters, res => res.id === item.id)
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

  onFocusEditable() {
    this.setState({editableFocused: true}, () => {
      if (!this.props.focused) this.emit('focus')
    })
  }

  onBlurEditable() {
    this.setState({editableFocused: false}, () => {
      if (!utils.isBrowserType(this.state.browser)) {
        this.onBlurBrowser()
      }
      if (this.props.focused) this.emit('blur')
    })
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
    let options = {
      query: this.query.toJSON(),
      keepMarkers: true
    }

    this.replaceQuery(newQueryStr, options, replaced => {
      let open = inserted => {
        if (inserted) this.setState({browserOpened: true})
      }
      return replaced ? open(replaced) : this.insertQuery(newQueryStr, options, open)
    })
  }

  onInputSearchBrowser(data) {
    this.emit('complete', data)
    this.emit('change')
  }

  onEditableResize({width, height}) {
    this.setState({
      editableWidth: width,
      editableHeight: height
    })
  }

  onInputResize() {
    this.emit('resize')
  }
}
