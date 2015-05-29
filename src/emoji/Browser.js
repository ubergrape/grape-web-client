import React from 'react'
import useSheet from 'react-jss'
import findIndex from 'lodash-es/array/findIndex'
import pick from 'lodash-es/object/pick'
import assign from 'lodash-es/object/assign'
import get from 'lodash-es/object/get'

import style from '../components/browser/style'
import tabsWithControlsStyle from '../components/tabs/tabsWithControlsStyle'
import TabsWithControls from '../components/tabs/TabsWithControls'
import Grid from '../components/grid/Grid'
import Item from './item/Item'
import * as itemStyle from './item/style'
import * as data from './data'
import * as emoji from './emoji'

const FOCUS_COMMANDS = ['prev', 'next', 'prevRow', 'nextRow']

/**
 * Main emoji browser component.
 */
export default React.createClass({
  mixins: [useSheet(style)],

  getDefaultProps() {
    return {
      images: {},
      height: 400,
      maxWidth: 920,
      className: '',
      itemId: undefined,
      onSelectTab: undefined,
      onSelectItem: undefined,
      key: ''
    }
  },

  getInitialState() {
    return {
      tabs: [],
      sections: []
    }
  },

  componentWillReceiveProps(props) {
    let currEmojiSheet = get(this.props, 'images.emojiSheet')
    let newEmojiSheet = get(props, 'images.emojiSheet')
    if (newEmojiSheet != currEmojiSheet) emoji.setSheet(newEmojiSheet)

    this.setState({
      tabs: data.getTabs(),
      sections: data.getSections()
    })
  },

  componentDidUpdate() {
    this.cacheItemsPerRow()
  },

  render() {
    let {classes} = this.sheet
    let props = pick(this.props, 'images')
    let {sections} = this.state

    assign(props, {
      data: sections,
      Item: Item,
      focusedItem: data.getFocusedItem(sections),
      height: this.props.height - tabsWithControlsStyle.container.height,
      onFocus: this.onFocusItem,
      onSelect: this.onSelectItem
    })

    let style = {
      height: `${this.props.height}px`,
      maxWidth: this.props.maxWidth
    }

    return (
      <div
        className={`${classes.browser} ${this.props.className}`}
        style={style}
        onMouseDown={this.onMouseDown}>
        <TabsWithControls data={this.state.tabs} onSelect={this.onSelectTab} />
        <div className={classes.column}>
          <div className={classes.row}>
            <Grid {...props} className={classes.leftColumn} ref="grid"/>
          </div>
        </div>
      </div>
    )
  },

  cacheItemsPerRow() {
    let {grid} = this.refs
    let gridWidth = grid.getDOMNode().offsetWidth

    // Speed up if grid width didn't change.
    if (gridWidth == this.gridWidth) return this.itemsPerRow || 0
    this.gridWidth = gridWidth

    let id = get(this.state, 'sections[0].items[0].id')
    if (!id) return 0

    let component = grid.getItemComponent(id)
    let itemWidth = component.getDOMNode().offsetWidth
    let itemMargins = itemStyle.MARGIN * 2
    this.itemsPerRow = Math.floor(gridWidth / (itemWidth + itemMargins))

    return this.itemsPerRow
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
    let currIndex = findIndex(tabs, tab => tab.selected)
    let newIndex = findIndex(tabs, tab => tab.id == id)
    let {id} = tabs[newIndex]
    data.setSelectedTab(tabs, newIndex)
    let sections = data.getSections(this.props.data, id)
    data.setSelectedSection(sections, id)
    data.setFocusedItemAt(sections, id, 0)
    this.setState({tabs: tabs, sections: sections, itemId: id}, callback)
    if (!options.silent) this.props.onSelectTab({id: id})
  },

  focusItem(id) {
    let {sections} = this.state
    if (FOCUS_COMMANDS.indexOf(id) >= 0) {
      let items = data.extractItems(sections)
      let currIndex = findIndex(items, item => item.focused)
      let item

      switch (id) {
        case 'next':
          item = items[currIndex + 1]
          if (item) id = item.id
          else id = items[0].id
          break
        case 'prev':
          item = items[currIndex - 1]
          if (item) id = item.id
          else id = items[items.length - 1].id
          break
        case 'nextRow':
          /*
          let currRow = Math.ceil(currIndex / this.itemsPerRow)
          let nextIndex = (currRow + 1) * this.itemsPerRow
          item = items[nextIndex]
          console.log(nextIndex, item)
          if (item) id = item.id
          else id = items[0].id
        */
          break
        case 'prevRow':
          break
      }
    }

    data.setFocusedItem(sections, id)
    this.setState({sections: sections})
  },

  selectItem(id) {
    this.focusItem(id)
    this.props.onSelectItem(data.getFocusedItem(this.state.sections))
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
  }
})
