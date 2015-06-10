import React from 'react'
import useSheet from 'react-jss'
import findIndex from 'lodash-es/array/findIndex'
import pick from 'lodash-es/object/pick'
import assign from 'lodash-es/object/assign'
import get from 'lodash-es/object/get'
import debounce from 'lodash-es/function/debounce'

import style from './browserStyle'
import tabsWithControlsStyle from '../components/tabs/tabsWithControlsStyle'
import TabsWithControls from '../components/tabs/TabsWithControls'
import Grid from '../components/grid/Grid'
import Empty from '../components/empty/Empty'
import Item from './item/Item'
import Icon from './Icon'
import * as dataUtils from './dataUtils'
import * as emoji from './emoji'

/**
 * Main emoji browser component.
 */
let Browser = React.createClass({
  mixins: [useSheet(style)],

  getDefaultProps() {
    return {
      customEmojis: undefined,
      images: {},
      height: 400,
      maxWidth: 920,
      className: '',
      onSelectItem: undefined,
      search: '',
      onNotFound: undefined
    }
  },

  getInitialState() {
    return this.createState(this.props)
  },

  componentWillReceiveProps(props) {
    let state = this.createState(props)
    if (state.sections.length) this.setState(state)
    else this.props.onNotFound()
  },

  createState(props) {
    let currEmojiSheet = get(this.props, 'images.emojiSheet')
    let newEmojiSheet = get(props, 'images.emojiSheet')
    if (newEmojiSheet && (newEmojiSheet != currEmojiSheet || !emoji.get())) {
      Browser.init({
        emojiSheet: newEmojiSheet,
        customEmojis: props.customEmojis
      })
    }

    let tabs = dataUtils.getTabs({orgLogo: props.images.orgLogo})
    return {
      tabs: tabs,
      sections: tabs.length ? dataUtils.getSections(tabs[0].id, props.search) : []
    }
  },

  componentWillMount() {
    this.onResize = this.onResize.bind(this)
    window.addEventListener('resize', this.onResize)
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  },

  componentDidMount() {
    this.cacheItemsPerRow()
  },

  componentDidUpdate() {
    this.cacheItemsPerRow()
  },

  render() {
    let {classes} = this.sheet
    let {sections} = this.state
    let props
    let content

    if (sections.length) {
      props = pick(this.props, 'images')
      assign(props, {
        data: sections,
        Item: Item,
        focusedItem: dataUtils.getFocusedItem(sections),
        height: this.props.height - tabsWithControlsStyle.container.height,
        onFocus: this.onFocusItem,
        onSelect: this.onSelectItem
      })
      content = (
        <div className={classes.column}>
          <div className={classes.row}>
            <Grid
              {...props}
              className={classes.leftColumn}
              section={{contentClassName: classes.sectionContent}}
              ref="grid" />
          </div>
        </div>
      )
    }
    else {
      content = <Empty />
    }

    let style = pick(this.props, 'height', 'maxWidth')

    return (
      <div
        className={`${classes.browser} ${this.props.className}`}
        style={style}
        onMouseDown={this.onMouseDown}>
        <TabsWithControls data={this.state.tabs} onSelect={this.onSelectTab} />
        {content}
      </div>
    )
  },

  getFocusedItem() {
    return dataUtils.getFocusedItem(this.state.sections)
  },

  cacheItemsPerRow() {
    let {grid} = this.refs
    let {sections} = this.state

    if (!sections.length) return

    let contentRect = grid.getSectionComponent(this.state.sections[0].id).getContentClientRect()
    let {width: gridWidth} = contentRect

    // Speed up if grid width didn't change.
    if (this.itemsPerRow && gridWidth == this.gridWidth) return
    this.gridWidth = gridWidth

    let id = get(this.state, 'sections[0].items[0].id')
    if (!id) return

    let component = grid.getItemComponent(id)
    let itemWidth = component.getDOMNode().offsetWidth
    this.itemsPerRow = Math.floor(gridWidth / itemWidth)
  },

  /**
   * Select tab.
   *
   * @param {String} id can be item id or "prev" or "next"
   * @param {Object} [options]
   * @param {Function} [callback]
   */
  selectTab(id, options = {}, callback) {
    let {tabs} = this.state
    if (id == 'next') {
      let currIndex = findIndex(tabs, tab => tab.selected)
      if (tabs[currIndex + 1]) id = tabs[currIndex + 1].id
      else id = tabs[0].id
    }
    let newIndex = findIndex(tabs, tab => tab.id == id)
    let {id} = tabs[newIndex]
    dataUtils.setSelectedTab(tabs, newIndex)
    let sections = dataUtils.getSections(id, this.props.search)
    this.setState({tabs: tabs, sections: sections}, callback)
  },

  focusItem(id) {
    let {sections} = this.state
    let item = dataUtils.getItem(sections, id, this.itemsPerRow)
    if (item) id = item.id
    dataUtils.setFocusedItem(sections, id)
    this.setState({sections: sections})
  },

  selectItem(id) {
    this.focusItem(id)
    this.props.onSelectItem(this.getFocusedItem())
  },

  onFocusItem(data) {
    this.focusItem(data.id)
  },

  onSelectItem(data) {
    this.selectItem(data.id)
  },

  onSelectTab(data, callback) {
    this.selectTab(data.id, {}, callback)
  },

  onMouseDown(e) {
    // Important!!!
    // Avoids loosing focus and though caret position in editable.
    e.preventDefault()
  },

  onResize: debounce(function() {
    this.cacheItemsPerRow()
  }, 500)
})

Browser.init = function (options) {
  let {emojiSheet, customEmojis} = options
  if (emojiSheet) emoji.setSheet(emojiSheet)
  if (customEmojis) emoji.defineCustom(customEmojis)
  dataUtils.init()
}

Browser.replace = emoji.replace
Browser.get = emoji.get
Browser.Icon = Icon

export default Browser
