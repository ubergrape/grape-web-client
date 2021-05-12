import PropTypes from 'prop-types'
import React, { Component } from 'react'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/noop'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import pick from 'lodash/pick'
import keyname from 'keyname'
import { shallowEqual } from 'react-pure-render'

import SearchBrowser from '../../containers/search-browser/SearchBrowserProvider'
import EmojiBrowser from '../emoji-browser/Browser'
import GrapeInput from '../grape-input/GrapeInput'
import Datalist from '../datalist/Datalist'
import * as mentions from '../mentions/mentions'
import { TYPES as QUERY_TYPES } from '../query/constants'
import QueryModel from '../query/Model'
import * as emoji from '../emoji'
import * as emojiSuggest from '../emoji-suggest'
import style from './style'
import * as utils from './utils'

// Map indicates whether browser has its own input field or
// its using the main one.
const browserWithInput = {
  search: true,
  emoji: true,
  emojiSuggest: false,
  user: false,
}

/**
 * Uses all types of auto completes to provide end component.
 */
class GrapeBrowser extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    /* eslint-disable react/no-unused-prop-types */
    setTrigger: PropTypes.bool,
    browser: PropTypes.oneOf(Object.keys(browserWithInput)),
    focused: PropTypes.bool,
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    /* eslint-enable react/no-unused-prop-types */
    isPostingLimited: PropTypes.bool,
    targetMessage: PropTypes.object,
    quoteMessage: PropTypes.object,
    editable: PropTypes.object,
    classes: PropTypes.object.isRequired,
    customEmojis: PropTypes.object,
    images: PropTypes.object,
    externalServicesInputDelay: PropTypes.number,
    results: PropTypes.array,
    services: PropTypes.array,
    servicesStats: PropTypes.object,
    channel: PropTypes.object,
    onDidMount: PropTypes.func,
    onEditPrevious: PropTypes.func,
    onSubmit: PropTypes.func,
    onAbort: PropTypes.func,
    onAddIntegration: PropTypes.func,
    onInsertItem: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onComplete: PropTypes.func,
    onChange: PropTypes.func,
    onResize: PropTypes.func,
    onLoadServices: PropTypes.func,
    onLoadServicesStats: PropTypes.func,
    goTo: PropTypes.func,
  }

  static defaultProps = {
    // This attribute has been set by Modal component.
    // We need to set it to null to enable shallowEqual comparance in
    // componentWillReceiveProps, because this is the only new prop.
    externalServicesInputDelay: 150,
    browser: undefined,
    data: {
      search: {},
      results: [],
      services: [],
    },
    images: {},
    results: [],
    services: [],
    servicesStats: {},
    channel: {},
    customEmojis: undefined,
    focused: false,
    isPostingLimited: false,
    targetMessage: null,
    quoteMessage: null,
    editable: null,
    setTrigger: false,
    isLoading: false,
    onDidMount: noop,
    onEditPrevious: noop,
    onSubmit: noop,
    onAbort: noop,
    onAddIntegration: noop,
    onInsertItem: noop,
    onBlur: noop,
    onFocus: noop,
    onComplete: noop,
    onChange: noop,
    onResize: noop,
    onLoadServices: noop,
    onLoadServicesStats: noop,
    goTo: noop,
  }

  constructor(props) {
    super(props)
    this.query = new QueryModel({ onChange: this.onChangeQuery })

    const emojiSheet = get(props, 'images.emojiSheet')
    if (emojiSheet) {
      EmojiBrowser.init({
        emojiSheet,
        customEmojis: props.customEmojis,
      })
    }

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

    const newCustomEmojiSheet = get(nextProps, 'customEmojis')
    const currCustomEmojiSheet = get(this.props, 'customEmojis')

    if (
      newEmojiSheet !== currEmojiSheet ||
      newCustomEmojiSheet !== currCustomEmojiSheet
    ) {
      EmojiBrowser.init({
        emojiSheet: newEmojiSheet,
        customEmojis: nextProps.customEmojis,
      })
    }
    this.setState(this.createState(nextProps))
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.browserOpened !== nextState.browserOpened ||
      !nextState.browserOpened ||
      nextProps.services !== this.props.services ||
      nextProps.isLoading !== this.props.isLoading ||
      nextProps.results !== this.props.results
    )
      return true
    if (isEqual(this.props.data, nextProps.data)) return false
    return true
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.browser !== this.state.browser && nextProps.setTrigger) {
      this.setTrigger(nextState.browser)
    }
  }

  onSubmit = data => {
    clearTimeout(this.searchBrowserInputTimeoutId)
    this.query.reset()
    this.props.onSubmit(data)
    this.setState({ content: '' })
  }

  onAbort = (data = {}) => {
    const { browser } = this.state
    this.closeBrowser({ inputFocused: true }, () => {
      this.props.onAbort({ ...data, browser })
    })
  }

  onSelectSearchBrowserItem = ({ item, query }) => {
    clearTimeout(this.searchBrowserInputTimeoutId)
    this.closeBrowser({ inputFocused: true }, () => {
      this.insertItem(item, query)
    })
  }

  onSelectEmojiBrowserItem = ({ item, query }) => {
    this.insertItem(item, query)
  }

  onSelectDatalistItem = item => {
    this.insertItem(item, this.query.toJSON())
  }

  onInsertItem = item => {
    let rank = 0
    const results = get(this.state, 'data.results')
    if (!isEmpty(results)) {
      const index = findIndex(results, res => res.id === item.id)
      rank = index + 1
    }

    clearTimeout(this.searchBrowserInputTimeoutId)
    this.props.onInsertItem({ item, rank })
  }

  onDidMountBrowser = ref => {
    this.browser = ref
  }

  onDidMountDatalist = ref => {
    this.datalist = ref
  }

  onDidMountEditable = ref => {
    this.editable = ref
  }

  onKeyDown = e => {
    if (browserWithInput[this.state.browser] === false) {
      this.navigateDatalist(e)
    }
  }

  onBlurInput = () => {
    // Delay blur event for the case when an external button was clicked,
    // because we are going to regain focus in a bit.
    setTimeout(() => {
      const { browser } = this.state
      if (!browser || browserWithInput[browser] === false) {
        this.props.onBlur()
      }
    }, 100)
  }

  onEmojiBrowserOutsideClick = () => {
    this.closeBrowser(null, () => {
      const { browser } = this.state
      this.props.onAbort({ reason: 'esc', browser })
    })
  }

  onChangeSearchBrowser = data => {
    const complete = () => {
      this.props.onComplete({ ...data, trigger: this.query.get('trigger') })
      this.props.onChange()
    }

    if (!utils.isExternalSearch(this.state.data)) {
      complete()
      return
    }

    clearTimeout(this.searchBrowserInputTimeoutId)
    this.searchBrowserInputTimeoutId = setTimeout(
      complete,
      this.props.externalServicesInputDelay,
    )
  }

  onChangeInput = ({ query, content, channelChanged } = {}) => {
    // Handler might be called when content has been just set, so it is changed
    // for the underlying component but not here.
    const contentHasChanged = content !== this.state.content
    const isBrowserOpened = Boolean(this.state.browser)
    const hasTrigger = Boolean(query && query.trigger)

    clearTimeout(this.searchBrowserInputTimeoutId)
    if (hasTrigger && contentHasChanged) {
      this.query.set(query, { silent: true })
      this.props.onComplete({ ...this.query.toJSON(), emoji })
    }

    // Query has been removed or caret position changed, for datalist only.
    if (!hasTrigger && !this.query.isEmpty()) {
      this.query.reset()
      if (isBrowserOpened) this.onAbort({ reason: 'deleteTrigger' })
    }

    if (channelChanged) return
    if (content === undefined) this.props.onChange()
    else this.setState({ content }, this.props.onChange)
  }

  onChangeQuery = str => {
    this.editable.insert(str)
  }

  setTrigger(browser) {
    if (!browser) return

    this.query.set('trigger', QUERY_TYPES[browser])
  }

  getTextContent = () => this.state.content

  setTextContent = (content, options = {}) => {
    const { caretPosition, silent } = options
    this.query.reset()
    this.setState({ content, caretPosition }, () => {
      if (!silent) this.onChangeInput()
    })
  }

  createState(nextProps) {
    const state = pick(nextProps, 'browser', 'data', 'isLoading')

    if (state.browser === 'user') {
      state.data = mentions.map(state.data).slice(0, nextProps.maxSuggestions)
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

    const { channel, targetMessage, quoteMessage } = this.props
    state.inputFocused = false

    // In some cases like switching channels and entering/exiting edit mode,
    // putting focus to input field, quoting and inserting objects from Grape Search
    if (
      channel.id !== nextProps.channel.id ||
      targetMessage !== nextProps.targetMessage ||
      quoteMessage !== nextProps.quoteMessage ||
      (this.state && this.state.browserOpened !== state.browserOpened)
    ) {
      state.inputFocused = true
      return state
    }

    if (nextProps.focused && state.browserOpened) {
      state.inputFocused = !browserWithInput[state.browser]
    }

    return state
  }

  closeBrowser(state, callback) {
    this.setState(
      {
        browser: null,
        browserOpened: false,
        ...state,
      },
      callback,
    )
  }

  /**
   * Keyboard navigation for the datalist (mention, emojiSuggest).
   */
  navigateDatalist(e) {
    const { datalist } = this
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
    this.closeBrowser({ inputFocused: true })
    this.query.reset()
  }

  renderBrowser() {
    const { browser, browserOpened, data } = this.state

    if (!browser || !browserOpened) return null

    const {
      classes,
      images,
      servicesStats,
      services,
      isLoading,
      onLoadServices,
      onLoadServicesStats,
      onAddIntegration,
      goTo,
    } = this.props

    if (browser === 'search') {
      return (
        <SearchBrowser
          className={classes.browser}
          data={data}
          services={services}
          servicesStats={servicesStats}
          images={images}
          isLoading={isLoading}
          onAbort={this.onAbort}
          onSelectItem={this.onSelectSearchBrowserItem}
          onAddIntegration={onAddIntegration}
          onChange={this.onChangeSearchBrowser}
          onLoadServices={onLoadServices}
          onLoadServicesStats={onLoadServicesStats}
          onDidMount={this.onDidMountBrowser}
          goTo={goTo}
        />
      )
    }

    if (browser === 'emoji') {
      return (
        <EmojiBrowser
          images={images}
          className={classes.browser}
          customEmojis={this.props.customEmojis}
          onAbort={this.onAbort}
          onSelectItem={this.onSelectEmojiBrowserItem}
          onOutsideClick={this.onEmojiBrowserOutsideClick}
          onDidMount={this.onDidMountBrowser}
          focused
        />
      )
    }

    return (
      <Datalist
        className={classes.browser}
        images={images}
        data={data}
        onSelect={this.onSelectDatalistItem}
        onDidMount={this.onDidMountDatalist}
      />
    )
  }

  render() {
    const { classes, onFocus, onEditPrevious, onResize, channel } = this.props

    return (
      <div className={classes.grapeBrowser} data-test="grape-browser">
        {this.renderBrowser()}
        <div className={classes.scroll}>
          <GrapeInput
            onKeyDown={this.onKeyDown}
            onAbort={this.onAbort}
            onResize={onResize}
            onChange={this.onChangeInput}
            onBlur={this.onBlurInput}
            onFocus={onFocus}
            onSubmit={this.onSubmit}
            onEditPrevious={onEditPrevious}
            onDidMount={this.onDidMountEditable}
            isPostingLimited={this.props.isPostingLimited}
            focused={this.state.inputFocused}
            content={this.state.content}
            channel={channel}
            caretPosition={this.state.caretPosition}
          />
        </div>
      </div>
    )
  }
}

export default injectSheet(style)(GrapeBrowser)
