import React from 'react'
import useSheet from 'react-jss'
import findIndex from 'lodash-es/array/findIndex'
import pick from 'lodash-es/object/pick'
import assign from 'lodash-es/object/assign'
import get from 'lodash-es/object/get'

import style from './browserStyle'
import tabsWithControlsStyle from '../components/tabs/tabsWithControlsStyle'
import TabsWithControls from '../components/tabs/TabsWithControls'
import Grid from '../components/grid/Grid'
import Item from './item/Item'
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
    if (newEmojiSheet != currEmojiSheet) {
      emoji.setSheet(newEmojiSheet)
      data.init()
    }

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
    let {sections} = this.state
    let props = pick(this.props, 'images')

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
            <Grid
              {...props}
              className={classes.leftColumn}
              section={{contentClassName: classes.sectionContent}}
              ref="grid" />
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
    this.itemsPerRow = Math.floor(gridWidth / itemWidth)

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
    /*
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
    */
  },

  focusItem(id) {
    let {sections} = this.state

    if (FOCUS_COMMANDS.indexOf(id) >= 0) {
      let items = data.extractItems(sections)
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
          currSection = data.getCurrentSection(sections, item.id)
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
          currSection = data.getCurrentSection(sections, item.id)
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
