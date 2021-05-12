import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import assign from 'lodash/assign'
import keyname from 'keyname'
import { shouldPureComponentUpdate } from 'react-pure-render'
import injectSheet from 'grape-web/lib/jss'
import wrapWithOutsideClickListener from 'grape-web/lib/components/outside-click'
import GlobalEvent from 'grape-web/lib/components/global-event'
import { defineMessages, intlShape, injectIntl } from 'react-intl'

import style from './browserStyle'
import TabsWithControls from '../tabs/TabsWithControls'
import Grid from './grid/Grid'
import Item from './item/Item'
import * as dataUtils from './dataUtils'
import * as emoji from '../emoji'
import Input from '../input/Input'
import Empty from '../empty/Empty'

function init(options) {
  const { emojiSheet, customEmojis } = options
  if (emojiSheet) emoji.setSheet(emojiSheet)
  if (customEmojis) emoji.defineCustom(customEmojis)
  dataUtils.init()
}

const messages = defineMessages({
  empty: {
    id: 'noEmojiFound',
    defaultMessage: 'No emoji found.',
  },
})

/**
 * Main emoji browser component.
 */
class Browser extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    onDidMount: PropTypes.func.isRequired,
    onAbort: PropTypes.func.isRequired,
    onSelectItem: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    focused: PropTypes.bool,
    images: PropTypes.object,
  }

  static defaultProps = {
    focused: false,
    images: {},
    className: '',
  }

  constructor(props) {
    super(props)
    this.state = this.createState(this.props, {})
  }

  componentDidMount() {
    this.props.onDidMount(this)
    this.cacheItemsPerRow()
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillUpdate(nextProps, nextState) {
    assign(nextState, this.createState(nextProps, nextState))
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.search === prevState.search) {
      this.cacheItemsPerRow()
    }
  }

  componentWillUnmount() {
    this.grid = null
  }

  onFocusItem = ({ id }) => {
    this.focusItem(id)
  }

  onSelectItem = ({ id }) => {
    this.selectItem(id)
  }

  onSelectTab = ({ id }) => {
    this.selectTab(id)
  }

  onGridDidMount = grid => {
    this.grid = grid
  }

  onInput = ({ search }) => {
    this.setState({
      search,
      facet: search ? 'search' : undefined,
    })
  }

  onKeyDown = e => {
    this.navigate(e)
  }

  onResize = () => {
    this.cacheItemsPerRow()
  }

  getFocusedItem = () => dataUtils.getFocusedItem(this.state.sections)

  createState(nextProps, nextState) {
    const currEmojiSheet = get(this.props, 'images.emojiSheet')
    const newEmojiSheet = get(nextProps, 'images.emojiSheet')
    if (newEmojiSheet && (newEmojiSheet !== currEmojiSheet || !emoji.get())) {
      init({
        emojiSheet: newEmojiSheet,
        customEmojis: nextProps.customEmojis,
      })
    }

    const { facet } = nextState
    let { search } = nextState

    if (facet !== 'search') search = null
    const sections = dataUtils.getSections(search, facet)

    const tabs = dataUtils.getTabs({
      orgLogo: nextProps.images.orgLogo,
      selected: facet,
      hasSearch: Boolean(nextState.search),
    })

    return { tabs, facet, sections }
  }

  cacheItemsPerRow() {
    const { sections } = this.state

    if (!sections.length) return

    const sectionComponent = this.grid.getSectionComponent(sections[0].id)
    const contentComponent = sectionComponent.getContentComponent()
    // eslint-disable-next-line react/no-find-dom-node
    const { width: gridWidth } = ReactDOM.findDOMNode(
      contentComponent,
    ).getBoundingClientRect()

    // Speed up if grid width didn't change.
    if (this.itemsPerRow && gridWidth === this.gridWidth) return
    this.gridWidth = gridWidth

    const id = get(this.state, 'sections[0].items[0].id')
    if (!id) return

    const component = this.grid.getItemComponent(id)

    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(component)
    if (!node) {
      this.itemsPerRow = 0
      return
    }

    const itemWidth = node.offsetWidth
    this.itemsPerRow = Math.floor(gridWidth / itemWidth)
  }

  /**
   * Select tab.
   *
   * @param {String} selector can be facet, "prev" or "next"
   */
  selectTab(selector) {
    const { tabs } = this.state
    let facet = selector
    const currIndex = findIndex(tabs, tab => tab.selected)
    if (selector === 'next') {
      if (tabs[currIndex + 1]) facet = tabs[currIndex + 1].id
      else facet = tabs[0].id
    } else if (selector === 'prev') {
      if (tabs[currIndex - 1]) facet = tabs[currIndex - 1].id
      else facet = tabs[tabs.length - 1].id
    }
    this.setState({ facet })
  }

  focusItem = id => {
    const { sections } = this.state
    if (!sections.length) return
    let nextItemId = id
    const nextItem = dataUtils.getItem(sections, nextItemId, this.itemsPerRow)
    if (nextItem) nextItemId = nextItem.id

    const prevItem = dataUtils.getFocusedItem(sections)

    const prevComponent = this.grid.getItemComponent(prevItem.id)
    if (prevComponent) prevComponent.setState({ focused: false })

    const nextComponent = this.grid.getItemComponent(nextItemId)
    if (nextComponent) nextComponent.setState({ focused: true })

    dataUtils.setFocusedItem(sections, nextItemId)
  }

  selectItem(id) {
    this.focusItem(id)
    this.props.onSelectItem({ item: this.getFocusedItem() })
  }

  /**
   * Keyboard navigation.
   */
  navigate(e) {
    const { query } = e.detail
    switch (keyname(e.keyCode)) {
      case 'down':
        this.focusItem('nextRow')
        e.preventDefault()
        break
      case 'up':
        this.focusItem('prevRow')
        e.preventDefault()
        break
      case 'left':
        this.focusItem('prev')
        e.preventDefault()
        break
      case 'right':
        this.focusItem('next')
        e.preventDefault()
        break
      case 'enter':
        this.props.onSelectItem({ item: this.getFocusedItem() })
        e.preventDefault()
        break
      case 'tab':
        this.selectTab(e.shiftKey ? 'prev' : 'next')
        e.preventDefault()
        break
      case 'esc':
        this.props.onAbort({
          reason: 'esc',
          query,
        })
        e.preventDefault()
        break
      default:
    }
  }

  render() {
    const { classes } = this.props.sheet
    const { formatMessage } = this.props.intl
    const { sections } = this.state
    return (
      <div
        className={`${classes.browser} ${this.props.className}`}
        style={{
          height: 400,
          maxWidth: 292,
          right: -90,
        }}
        onClick={this.props.onClick}
        role="presentation"
      >
        <GlobalEvent event="resize" handler={this.onResize} debounce={500} />
        <Input
          onInput={this.onInput}
          onKeyDown={this.onKeyDown}
          focused={this.props.focused}
          className={classes.input}
          type="emoji"
        />
        <TabsWithControls data={this.state.tabs} onSelect={this.onSelectTab} />
        {!sections.length && <Empty text={formatMessage(messages.empty)} />}
        {sections.length > 0 && (
          <div className={classes.column}>
            <div className={classes.row}>
              <Grid
                data={sections}
                images={this.props.images}
                Item={Item}
                focusedItem={dataUtils.getFocusedItem(sections)}
                className={classes.leftColumn}
                section={{ contentClassName: classes.sectionContent }}
                onFocus={this.onFocusItem}
                onSelect={this.onSelectItem}
                onDidMount={this.onGridDidMount}
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}

const PublicBrowser = injectIntl(
  wrapWithOutsideClickListener(injectSheet(style)(Browser)),
)

PublicBrowser.init = init

export default PublicBrowser
