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

const FOCUS_COMMANDS = ['prev', 'next', 'prevRow', 'nextRow']

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
      search: ''
    }
  },

  getInitialState() {
    return this.createState(this.props)
  },

  componentWillReceiveProps(props) {
    this.setState(this.createState(props))
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

    if (FOCUS_COMMANDS.indexOf(id) >= 0) {
      let items = dataUtils.extractItems(sections)
      let currIndex = findIndex(items, item => item.focused)
      let item = items[currIndex]
      let currSection
      let rowsAmount
      let currRow
      let itemsShift

      switch (id) {
        case 'next':
          item = items[currIndex + 1]
          id = item ? item.id : items[0].id
          break
        case 'prev':
          item = items[currIndex - 1]
          id = item ? item.id : items[items.length - 1].id
          break
        case 'nextRow':
          currSection = dataUtils.getCurrentSection(sections, item.id)
          currIndex = findIndex(currSection.items, item => item.focused)
          currRow = Math.floor(currIndex / this.itemsPerRow)
          itemsShift = currIndex - currRow * this.itemsPerRow
          let nextRow = currRow + 1
          let nextIndex = nextRow * this.itemsPerRow + itemsShift
          item = currSection.items[nextIndex]
          rowsAmount = Math.ceil(currSection.items.length / this.itemsPerRow)
          if (item) id = item.id
          // We are already on the last row of the current section,
          // move to the next section or to the first one.
          else if (nextRow == rowsAmount) {
            let currSectionIndex = findIndex(sections, section => section.id == currSection.id)
            let nextSection = sections[currSectionIndex + 1]
            if (nextSection) id =  nextSection.items[itemsShift].id
            else id = sections[0].items[itemsShift].id
          }
          // This must be the last row and it has no item at the current shift.
          // Go to the last item of the section.
          else id = currSection.items[currSection.items.length - 1].id
          break
        case 'prevRow':
          currSection = dataUtils.getCurrentSection(sections, item.id)
          currIndex = findIndex(currSection.items, item => item.focused)
          currRow = Math.floor(currIndex / this.itemsPerRow)
          itemsShift = currIndex - currRow * this.itemsPerRow
          let prevRow = currRow - 1
          let prevIndex = prevRow * this.itemsPerRow + itemsShift
          item = currSection.items[prevIndex]
          rowsAmount = Math.ceil(currSection.items.length / this.itemsPerRow)

          if (item) id = item.id
          // We are already on the fist row of the current section,
          // move to the last row of prev section.
          else {
            let currSectionIndex = findIndex(sections, section => section.id == currSection.id)
            let prevSection = sections[currSectionIndex - 1]
            if (!prevSection) prevSection = sections[sections.length - 1]
            rowsAmount = Math.ceil(prevSection.items.length / this.itemsPerRow)
            let prevRow = rowsAmount - 1
            let prevIndex = prevRow * this.itemsPerRow + itemsShift
            item = prevSection.items[prevIndex]
            if (item) id = item.id
            else id = prevSection.items[prevSection.items.length - 1].id
          }
          break
      }
    }

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
