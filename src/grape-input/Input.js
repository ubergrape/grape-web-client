import React, {Component} from 'react'
import {useSheet} from '../jss'
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
import Datalist from '../datalist/Datalist'
import * as mentions from '../mentions/mentions'
import {TYPES as QUERY_TYPES} from '../query/constants'
import QueryModel from '../query/Model'
import style from './style'
import * as utils from './utils'

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
    onAddSearchBrowserIntegration: undefined,
    onFilterSelect: undefined,
    onInsertItem: undefined,
    onFocus: undefined,
    onBlur: undefined,
    onDidMount: undefined
  }

  constructor(props) {
    super(props)
    this.query = new QueryModel({onChange: ::this.onChangeQuery})
    this.exposePublicMethods()
    this.onBlurWindow = ::this.onBlurWindow
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

    let nextState = this.createState(nextProps)

    this.setState(nextState)
  }

  componentDidMount() {
    window.addEventListener('blur', this.onBlurWindow)
    objectStyle.sheet.attach()
    this.setTrigger(this.state.browser)
    let {onDidMount} = this.props
    if (onDidMount) onDidMount(this)
  }

  componentDidUnmount() {
    window.removeEventListener('blur', this.onBlurWindow)
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
        <div className={classes.completeWrapper} data-test="complete-wrapper">
          {browser}
        </div>
        <Editable
          placeholder={this.props.placeholder}
          disabled={this.props.disabled}
          focused={this.state.focused}
          insertAnimationDuration={objectStyle.INSERT_ANIMATION_DURATION}
          onAbort={::this.onAbort}
          onEditPrevious={::this.onEditPrevious}
          onSubmit={::this.onSubmit}
          onChange={::this.onChangeEditable}
          onFocus={::this.onFocusEditable}
          onBlur={::this.onBlurEditable}
          onDidMount={this.onDidMount.bind(this, 'editable')} />
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
    let state = pick(nextProps, 'browser', 'focused', 'data', 'isLoading')
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
    ['setTextContent', 'getTextContent'].forEach(method => {
      container[method] = ::this[method]
    })
  }

  getTextContent() {
    return this.editable.getTextContent()
  }

  setTextContent(text) {
    this.query.reset()
    return this.editable.setTextContent(text)
  }

  closeBrowser(data) {
    this.setState({
      browser: null,
      browserOpened: false,
      ...data
    })
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
      let Obj = objects[data.type] || objects.search
      let object = new Obj(data)
      // Add space to let user type next thing faster.
      this.replaceQuery(object.toHTML() + '&nbsp;', query)
    }
    this.onInsertItem(item, query)
    this.closeBrowser({focused: true})
    this.query.reset()
  }

  replaceQuery(replacement, query, callback = noop) {
    this.setState({focused: true}, () => {
      let replaced = this.editable.replaceQuery(replacement, {query})
      callback(replaced)
    })
  }

  insertQuery(queryStr, callback = noop) {
    this.setState({focused: true}, () => {
      let inserted = this.editable.modify((left, right) => {
        let newLeft = left
        // Add space after text if there is no.
        if (newLeft[newLeft.length - 1] !== ' ') newLeft += ' '
        newLeft += queryStr
        return [newLeft, right]
      }, {query: this.query.toJSON()})
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
    React.findDOMNode(this).dispatchEvent(event)
    name = `on${capType}`
    let callback = this.props[name]
    if (callback) callback(data)
  }

  onAbort(data = {}) {
    this.closeBrowser({focused: true})
    this.emit('abort', {...data, browser: this.state.browser})
  }

  onEditPrevious() {
    this.emit('editPrevious')
  }

  onSubmit(data) {
    this.query.reset()
    this.emit('submit', data)
  }

  onChangeEditable(query) {
    // Used by datalist only.
    if (query) {
      let changed = this.query.set(query, {silent: true})
      if (changed) this.emit('complete', this.query.toJSON())
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
    this.closeBrowser()
    this.emit('addIntegration')
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
    this.setState({focused: true})
    this.emit('focus')
  }

  onBlurEditable() {
    if (utils.isBrowserType(this.state.browser)) {
      this.setState({focused: false})
      return
    }

    // We use the timeout to avoid closing suggestions when whole window
    // got unfocused. We want still to close it when
    this.blurTimeoutId = setTimeout(() => {
      this.query.reset()
      this.closeBrowser({focused: false})
      this.emit('blur')
    }, 50)
  }

  onBlurBrowser() {
    this.blurTimeoutId = setTimeout(() => {
      this.closeBrowser()
      this.emit('blur')
    }, 50)
  }

  onBlurWindow() {
    clearTimeout(this.blurTimeoutId)
  }

  onChangeQuery(newQueryStr) {
    this.replaceQuery(newQueryStr, this.query.toJSON(), replaced => {
      let open = inserted => {
        if (inserted) this.setState({browserOpened: true})
      }
      return replaced ? open(replaced) : this.insertQuery(newQueryStr, open)
    })
  }

  onInputSearchBrowser(data) {
    this.emit('complete', data)
    this.emit('change')
  }
}
